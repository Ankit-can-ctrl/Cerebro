import { Request, Response } from "express";
import { Link } from "../models/linkModel";
import { randomString } from "../config/random";
import { RequestWithUser } from "../middleware/authmiddleware";
import { User } from "../models/userModel";
import { Content } from "../models/contentModel";

export const createLink = async (req: RequestWithUser, res: Response) => {
  try {
    // when share is true, we need to create a new link , if share is false then we need to disable or
    // delete the link
    const share = req.body.share;

    if (share) {
      // If share is true, create or get existing link
      const existingLink = await Link.findOne({ userId: req.userId });

      if (existingLink) {
        res.json({ hash: existingLink.hash });
        return;
      }

      const hash = randomString(10);
      await Link.create({
        userId: req.userId,
        hash: hash,
      });
      res.status(201).json({ message: hash });
    } else {
      // If share is false, delete the link
      await Link.deleteOne({ userId: req.userId });
      res.status(200).json({ message: "Link deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating link" });
  }
};

export const getLinkContent = async (req: RequestWithUser, res: Response) => {
  try {
    const hash = req.params.hash;

    const link = await Link.findOne({ hash });
    if (!link) {
      res.status(404).json({ message: "Link not found!" });
      return;
    }
    const content = await Content.find({ userId: link.userId });

    const user = await User.findById(link.userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.json({
      user: user.username,
      content: content,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching the data." });
  }
};

// Utility: basic HTML meta extraction without external deps
const extractBetween = (html: string, start: RegExp, end: RegExp) => {
  const s = html.search(start);
  if (s === -1) return null;
  const e = html.slice(s).search(end);
  if (e === -1) return null;
  return html.slice(s, s + e);
};

const getMetaContent = (html: string, selector: RegExp): string | null => {
  const match = html.match(selector);
  if (!match) return null;
  const contentMatch = match[0].match(/content\s*=\s*"([^"]*)"/i);
  return contentMatch ? contentMatch[1] : null;
};

const absolutize = (
  base: URL,
  url: string | null | undefined
): string | null => {
  if (!url) return null;
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
};

export const getLinkMetadata = async (req: Request, res: Response) => {
  try {
    const rawUrl = String(req.query.url || "");
    if (!rawUrl) {
      res.status(400).json({ error: "Missing url query param" });
      return;
    }

    // Basic validation: http/https only
    const ensured = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    let url: URL;
    try {
      url = new URL(ensured);
    } catch {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }
    if (!/^https?:$/i.test(url.protocol)) {
      res.status(400).json({ error: "Only http/https URLs are allowed" });
      return;
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      res.status(415).json({ error: "URL did not return HTML content" });
      return;
    }

    const html = await response.text();

    // Extract metadata: prefer og: then twitter: then standard meta
    const title =
      getMetaContent(html, /<meta[^>]+property\s*=\s*"og:title"[^>]*>/i) ||
      getMetaContent(html, /<meta[^>]+name\s*=\s*"twitter:title"[^>]*>/i) ||
      (() => {
        const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        return m ? m[1].trim() : null;
      })();

    const description =
      getMetaContent(
        html,
        /<meta[^>]+property\s*=\s*"og:description"[^>]*>/i
      ) ||
      getMetaContent(html, /<meta[^>]+name\s*=\s*"description"[^>]*>/i) ||
      getMetaContent(html, /<meta[^>]+name\s*=\s*"twitter:description"[^>]*>/i);

    const siteName = getMetaContent(
      html,
      /<meta[^>]+property\s*=\s*"og:site_name"[^>]*>/i
    );

    const image = absolutize(
      url,
      getMetaContent(html, /<meta[^>]+property\s*=\s*"og:image"[^>]*>/i) ||
        getMetaContent(html, /<meta[^>]+name\s*=\s*"twitter:image"[^>]*>/i)
    );

    // Favicon discovery
    const linkTags = html.match(/<link[^>]+>/gi) || [];
    let bestIcon: string | null = null;
    let bestSize = 0;
    for (const tag of linkTags) {
      const relMatch = tag.match(/rel\s*=\s*"([^"]*)"/i);
      const rel = relMatch ? relMatch[1].toLowerCase() : "";
      if (
        rel.includes("icon") ||
        rel.includes("shortcut icon") ||
        rel.includes("apple-touch-icon")
      ) {
        const hrefMatch = tag.match(/href\s*=\s*"([^"]*)"/i);
        const sizesMatch = tag.match(/sizes\s*=\s*"([^"]*)"/i);
        const href = hrefMatch ? hrefMatch[1] : null;
        const sizes = sizesMatch ? sizesMatch[1] : "";
        const numeric = parseInt(sizes.split("x")[0] || "0", 10) || 0;
        const abs = absolutize(url, href);
        if (abs && numeric >= bestSize) {
          bestSize = numeric;
          bestIcon = abs;
        }
      }
    }
    if (!bestIcon) {
      // Public favicon fallbacks
      const host = url.hostname;
      bestIcon = `https://icons.duckduckgo.com/ip3/${host}.ico`;
    }

    const canonicalUrl = absolutize(
      url,
      (() => {
        const m = html.match(
          /<link[^>]+rel\s*=\s*"canonical"[^>]+href\s*=\s*"([^"]+)"[^>]*>/i
        );
        return m ? m[1] : null;
      })()
    );

    res.json({
      title: title || null,
      description: description || null,
      iconUrl: bestIcon,
      siteName: siteName || null,
      image: image || null,
      canonicalUrl: canonicalUrl || url.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
};
