import BrainCard from "../components/BrainCard";
import { useContent } from "../hooks/useContent";
import Loader from "../components/Loader";
import { useContentFilter } from "../hooks/useContentFilter";
import { useState } from "react";
import { useContentSearch } from "../hooks/useContentSearch";

const Home = () => {
  const { content, isLoading, error } = useContent();
  const { selectedCategory } = useContentFilter();
  const [query, setQuery] = useState("");
  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError,
  } = useContentSearch(query, 24);

  const visibleContent =
    selectedCategory === "all"
      ? content
      : content.filter((item) => item.type === selectedCategory);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-600 py-10">
        Failed to load content
      </div>
    );
  }

  const showingSearch = query.trim().length > 0;
  const MIN_SCORE = 0.25;
  const results = showingSearch
    ? (searchData?.results ?? []).filter(
        (r: any) => (r?.score ?? 0) >= MIN_SCORE
      )
    : visibleContent;

  return (
    <div>
      <div className="w-full mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your content..."
          className=" px-4 py-3 rounded-lg border text-black outline-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {showingSearch && searchError && (
          <div className="mt-2 text-sm text-red-600">{searchError.message}</div>
        )}
      </div>

      {(isSearching || (showingSearch && !searchData)) && (
        <div className="w-full flex items-center justify-center py-6">
          <Loader />
        </div>
      )}

      {!isSearching && results.length === 0 && (
        <div className="w-full text-center text-gray-500 py-10">
          {showingSearch ? "No results found" : "No content yet"}
        </div>
      )}

      <div className="[column-fill:_balance] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:[columns:350px]">
        {showingSearch
          ? results.map((r: any) => (
              <div key={r.id} className="break-inside-avoid mb-4">
                <BrainCard
                  id={r.id}
                  link={r.link || ""}
                  title={r.title}
                  type={r.type}
                  description={r.description}
                />
              </div>
            ))
          : visibleContent.map((item) => (
              <div key={item._id} className="break-inside-avoid mb-4">
                <BrainCard
                  id={item._id}
                  link={item.link}
                  title={item.title}
                  type={item.type}
                  description={item.description}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Home;
