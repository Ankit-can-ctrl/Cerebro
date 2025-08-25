import { useEffect, useRef, useState } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import TrashIcon from "../icons/TrashIcon";
import TweetIcon from "../icons/TweetIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import DocIcon from "../icons/DocIcon";
import LinkIcon from "../icons/LinkIcon";
import ImageIcon from "../icons/ImageIcon";
import MusicIcon from "../icons/MusicIcon";
import Loader from "./Loader";
import { useContent } from "../hooks/useContent";

declare global {
  interface Window {
    twttr?: any;
  }
}

interface BrainCardProps {
  id: string;
  link?: string;
  title?: string;
  description?: string;
  type?: "youtube" | "twitter" | "document" | "website" | "image" | "music";
  readOnly?: boolean;
}

const BrainCard = ({
  id,
  link = "https://www.youtube.com/watch?v=fe0QmskwWEM",
  title = "New tech 2025",
  type = "youtube",
  description = "Dustin vs max trilogy UFC",
  readOnly = false,
}: BrainCardProps) => {
  const { deleteContent } = useContent();
  const [isContentLoaded, setIsContentLoaded] = useState(
    type !== "youtube" && type !== "twitter" && type !== "image"
  );
  const twitterContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toSeconds = (t: string | null): number => {
    if (!t) return 0;
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i;
    const match = t.match(regex);
    if (!match) return 0;
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const getYouTubeEmbedUrl = (rawUrl: string): string => {
    const ensureProtocol = (u: string) =>
      /^https?:\/\//i.test(u) ? u : `https://${u}`;
    try {
      const url = new URL(ensureProtocol(rawUrl));
      const host = url.hostname.replace(/^www\./, "").toLowerCase();
      let videoId = "";
      let startSeconds = 0;

      const hashParams = url.hash.startsWith("#")
        ? new URLSearchParams(url.hash.slice(1))
        : new URLSearchParams("");
      const tParam =
        url.searchParams.get("t") ||
        url.searchParams.get("start") ||
        url.searchParams.get("time_continue") ||
        hashParams.get("t");
      startSeconds = toSeconds(tParam);

      if (
        host === "youtube.com" ||
        host === "m.youtube.com" ||
        host === "music.youtube.com"
      ) {
        if (url.pathname === "/watch") {
          videoId = url.searchParams.get("v") || "";
        } else if (url.pathname.startsWith("/shorts/")) {
          videoId = url.pathname.split("/")[2] || "";
        } else if (url.pathname.startsWith("/embed/")) {
          return url.toString();
        }
      } else if (host === "youtu.be") {
        videoId = url.pathname.replace(/^\//, "").split("/")[0];
      }

      const list = url.searchParams.get("list");

      if (!videoId && list) {
        const playlist = new URL(`https://www.youtube.com/embed/videoseries`);
        playlist.searchParams.set("list", list);
        if (startSeconds > 0)
          playlist.searchParams.set("start", String(startSeconds));
        return playlist.toString();
      }

      if (!videoId) return rawUrl;

      const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
      if (list) embed.searchParams.set("list", list);
      if (startSeconds > 0)
        embed.searchParams.set("start", String(startSeconds));
      return embed.toString();
    } catch {
      if (rawUrl.includes("watch?v="))
        return rawUrl.replace("watch?v=", "embed/");
      return rawUrl;
    }
  };

  useEffect(() => {
    if (type === "twitter") {
      const handleRendered = () => setIsContentLoaded(true);

      const ensureTwitterScript = () => {
        if (window.twttr && window.twttr.widgets)
          return Promise.resolve(window.twttr);
        return new Promise<any>((resolve) => {
          const existing = document.querySelector(
            'script[src*="platform.twitter.com/widgets.js"]'
          ) as HTMLScriptElement | null;
          if (existing) {
            existing.onload = () => resolve(window.twttr);
            if (window.twttr) resolve(window.twttr);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://platform.twitter.com/widgets.js";
          script.async = true;
          script.onload = () => resolve(window.twttr);
          document.body.appendChild(script);
        });
      };

      ensureTwitterScript().then((twttr) => {
        if (!twttr) return;
        try {
          twttr.events.bind("rendered", handleRendered);
        } catch {}
        if (twitterContainerRef.current) {
          try {
            twttr.widgets.load(twitterContainerRef.current);
          } catch {}
        }
      });

      return () => {
        try {
          window.twttr?.events?.unbind("rendered", handleRendered);
        } catch {}
      };
    }

    if (type !== "youtube" && type !== "image") {
      setIsContentLoaded(true);
    }
  }, [type, link]);

  return (
    <>
      <div className="bg-white rounded-lg w-full h-fit p-3 group flex flex-col justify-between z-[99999]">
        {/* card header */}
        <header className="header border-b border-gray-200 py-2 w-full flex justify-between">
          <div className="headings flex items-center justify-center gap-2">
            {type === "youtube" && <YoutubeIcon size="lg" color="secondary" />}
            {type === "twitter" && <TweetIcon size="md" color="secondary" />}
            {type === "document" && <DocIcon size="md" color="secondary" />}
            {type === "website" && <LinkIcon size="md" color="secondary" />}
            {type === "image" && <ImageIcon size="md" color="secondary" />}
            {type === "music" && <MusicIcon size="md" color="secondary" />}

            <h1 className="title text-sm text-black">{title}</h1>
          </div>
          {!readOnly && (
            <div className="btns opacity-0 invisible group-hover:opacity-100 group-hover:visible flex items-center justify-center gap-4 transition-all duration-300 ease-in-out">
              <div
                className=" cursor-pointer"
                onClick={() => window.open(link, "_blank")}
              >
                <ShareIcon color="secondary" />
              </div>
              <div
                className={`cursor-pointer ${
                  isDeleting ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await deleteContent.mutateAsync({ contentId: id });
                  } catch (e) {
                    alert((e as Error).message || "Failed to delete");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                <TrashIcon color="secondary" />
              </div>
            </div>
          )}
        </header>
        {/* card content */}
        <div className="content rounded-lg overflow-hidden ">
          {!isContentLoaded && (
            <div className="w-full h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
              <Loader />
            </div>
          )}
          {/* yoututbe video */}
          {type === "youtube" && (
            <iframe
              className={`w-full h-[200px] ${
                isContentLoaded ? "block" : "hidden"
              }`}
              src={getYouTubeEmbedUrl(link)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={() => setIsContentLoaded(true)}
            ></iframe>
          )}
          {/* image */}
          {type === "image" && (
            <div>
              <img
                src={link}
                alt="image"
                className={`w-full h-auto ${
                  isContentLoaded ? "block" : "hidden"
                }`}
                onLoad={() => setIsContentLoaded(true)}
              />
              <p className="description text-[11px] line-clamp-3 pb-2">
                {description}
              </p>
            </div>
          )}
          {/* music */}
          {type === "music" && (
            <div className=" text-black flex flex-col gap-2">
              <div className=" bg-gray-200 flex items-center justify-center py-3 rounded-lg px-2">
                <audio
                  className="w-full"
                  src={link}
                  controls
                  preload="metadata"
                  onCanPlay={() => setIsContentLoaded(true)}
                  onError={() => setIsContentLoaded(true)}
                />
              </div>
              {description && (
                <p className="description text-[11px] line-clamp-3 pb-2">
                  {description}
                </p>
              )}
            </div>
          )}
          {/* tweet */}
          {type === "twitter" && (
            <div
              ref={twitterContainerRef}
              className={`${isContentLoaded ? "" : ""}`}
            >
              <blockquote className="twitter-tweet w-full h-full">
                <a href={link.replace("x.com", "twitter.com")}></a>
              </blockquote>
            </div>
          )}
          {/* document */}
          {type === "document" && (
            <div className=" text-black flex flex-col gap-2">
              <div className=" bg-blue-100  flex items-center justify-center py-5 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="68"
                  height="68"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-text-icon lucide-book-text text-gray-500 cursor-pointer"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                  <path d="M8 11h8" />
                  <path d="M8 7h6" />
                </svg>
              </div>
              <p className="description text-[11px] line-clamp-3 pb-2">
                {description}
              </p>
            </div>
          )}
          {/* website */}
          {type === "website" && (
            <div className=" text-black flex flex-col gap-2">
              <div className=" bg-gray-200  flex items-center justify-center py-5 rounded-lg">
                {/* Try to render the website's favicon via Google (fallback) using the hostname */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${(() => {
                    try {
                      return new URL(link).hostname;
                    } catch {
                      return link;
                    }
                  })()}&sz=64`}
                  alt="site-icon"
                  className="w-12 h-12 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <p className="description text-[11px] line-clamp-3 pb-2">
                {description}
              </p>
              <button
                onClick={() => window.open(link, "_blank")}
                className="text-[11px] font-semibold text-white bg-blue-600 rounded-md px-2 py-1"
              >
                Visit website
              </button>
            </div>
          )}
        </div>
        {/* card footer */}
        <div className="">
          <div className="tags flex flex-wrap gap-2 my-2">
            {/* <div className="tag text-white text-[11px] bg-purple-500 px-2 py-1 rounded-md">
              #{"youtube"}
            </div> */}
          </div>
          <div className="date text-black text-[8px] mt-5 flex justify-end">
            2025-07-09
          </div>
        </div>
      </div>
    </>
  );
};

export default BrainCard;
