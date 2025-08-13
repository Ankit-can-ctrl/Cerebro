import { useState, type ComponentType } from "react";
import YoutubeIcon from "../icons/YoutubeIcon";
import TweetIcon from "../icons/TweetIcon";
import DocIcon from "../icons/DocIcon";
import MusicIcon from "../icons/MusicIcon";
import CloseIcon from "../icons/CloseIcon";
import { PlusIcon } from "../icons/PlusIcon";
import type { IconProps } from "../types/IconProps";
import { useContentFilter } from "../hooks/useContentFilter";

type CategoryId =
  | "all"
  | "youtube"
  | "twitter"
  | "document"
  | "website"
  | "image"
  | "music";

interface Category {
  id: CategoryId;
  label: string;
  Icon: ComponentType<IconProps>;
}

const categories: Category[] = [
  { id: "all", label: "All", Icon: YoutubeIcon },
  { id: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { id: "twitter", label: "Twitter", Icon: TweetIcon },
  { id: "document", label: "Documents", Icon: DocIcon },
  { id: "website", label: "Websites", Icon: DocIcon },
  { id: "image", label: "Images", Icon: DocIcon },
  { id: "music", label: "Music", Icon: MusicIcon },
];

const Sidebar = () => {
  const { selectedCategory, setSelectedCategory } = useContentFilter();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={`bg-gradient-to-r from-purple-600/80 to-pink-700/60 ${
        isCollapsed ? "w-[84px]" : "w-[300px]"
      } h-fit absolute top-1/3 rounded-none md:rounded-r-lg backdrop-blur-sm px-3 transition-all duration-300 ease-out`}
    >
      <div className="relative h-full py-6">
        <button
          aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
          className="absolute right-2 top-2 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
        >
          {isCollapsed ? (
            <PlusIcon size="sm" />
          ) : (
            <CloseIcon size="sm" color="primary" />
          )}
        </button>

        {!isCollapsed && (
          <h2 className="text-sm uppercase tracking-widest text-white/70 px-2 mb-3">
            Categories
          </h2>
        )}
        <nav className={isCollapsed ? "mt-10" : ""}>
          <ul className="flex flex-col gap-2">
            {categories.map(({ id, label, Icon }) => {
              const isActive = id === selectedCategory;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center gap-0 px-2" : "gap-3 px-3"
                    } py-2 rounded-md transition-colors border border-white/10 ${
                      isActive
                        ? "bg-white/15 text-white border border-white"
                        : "bg-white/5 hover:bg-white/10 text-white/90"
                    }`}
                  >
                    <Icon
                      size="md"
                      color={isActive ? "primary" : "secondary"}
                    />
                    {!isCollapsed && (
                      <span className="font-medium">{label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
