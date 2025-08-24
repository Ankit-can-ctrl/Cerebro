import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export type SearchItem = {
  id: string;
  title: string;
  description?: string;
  link?: string;
  type: "youtube" | "image" | "music" | "twitter" | "document" | "website";
  score: number;
};

type SearchResponse = { results: SearchItem[]; count: number };

export function useContentSearch(query: string, k = 10) {
  return useQuery<SearchResponse, Error>({
    queryKey: ["content", "search", query, k],
    enabled: !!query?.trim(),
    queryFn: async () => {
      const q = query.trim();
      const res = await api.get<SearchResponse>("/content/search", {
        params: { q, k },
      });
      return res.data;
    },
  });
}
