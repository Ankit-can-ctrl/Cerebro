import BrainCard from "../components/BrainCard";
import { useContent } from "../hooks/useContent";
import Loader from "../components/Loader";
import { useContentFilter } from "../hooks/useContentFilter";

const Home = () => {
  const { content, isLoading, error } = useContent();
  const { selectedCategory } = useContentFilter();

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

  return (
    <div className="[column-fill:_balance] columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:[columns:350px]">
      {visibleContent.map((item) => (
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
  );
};

export default Home;
