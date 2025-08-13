import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ContentItem } from "./useContent";

export type ContentCategory = "all" | ContentItem["type"];

interface ContentFilterContextValue {
  selectedCategory: ContentCategory;
  setSelectedCategory: (category: ContentCategory) => void;
}

const ContentFilterContext = createContext<ContentFilterContextValue | null>(
  null
);

export function ContentFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory>("all");

  const value = useMemo(
    () => ({ selectedCategory, setSelectedCategory }),
    [selectedCategory]
  );

  return (
    <ContentFilterContext.Provider value={value}>
      {children}
    </ContentFilterContext.Provider>
  );
}

export function useContentFilter() {
  const ctx = useContext(ContentFilterContext);
  if (!ctx) {
    throw new Error(
      "useContentFilter must be used within a ContentFilterProvider"
    );
  }
  return ctx;
}
