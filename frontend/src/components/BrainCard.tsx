import { ShareIcon } from "../icons/ShareIcon";
import TrashIcon from "../icons/TrashIcon";
import TweetIcon from "../icons/TweetIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import DocIcon from "../icons/DocIcon";
import LinkIcon from "../icons/LinkIcon";
import ImageIcon from "../icons/ImageIcon";
import MusicIcon from "../icons/MusicIcon";

interface BrainCardProps {
  link?: string;
  title?: string;
  description?: string;
  type?: "youtube" | "twitter" | "document" | "website" | "image" | "music";
}

const BrainCard = ({
  link = "https://www.youtube.com/watch?v=fe0QmskwWEM",
  title = "New tech 2025",
  type = "youtube",
  description = "Dustin vs max trilogy UFC",
}: BrainCardProps) => {
  return (
    <>
      <div className="bg-white rounded-lg w-[350px] min-h-[300px] p-3 group flex flex-col justify-between z-[99999]">
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
          <div className="btns opacity-0 invisible group-hover:opacity-100 group-hover:visible flex items-center justify-center gap-4 transition-all duration-300 ease-in-out">
            <div
              className=" cursor-pointer"
              onClick={() => window.open(link, "_blank")}
            >
              <ShareIcon color="secondary" />
            </div>
            <div className="cursor-pointer" onClick={() => {}}>
              <TrashIcon color="secondary" />
            </div>
          </div>
        </header>
        {/* card content */}
        <div className="content rounded-lg overflow-hidden ">
          {/* yoututbe video */}
          {type === "youtube" && (
            <iframe
              className="w-full h-full"
              src={link.replace("watch?v=", "embed/")}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {/* image */}
          {type === "image" && (
            <div>
              <img src={link} alt="image" className="w-full h-full" />
              <p className="description text-[11px] truncate pb-2">
                {description}
              </p>
            </div>
          )}
          {/* music */}
          {type === "music" && (
            <div className=" bg-gray-200  flex items-center justify-center py-5 rounded-lg">
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
                className="lucide lucide-headphones-icon lucide-headphones"
              >
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
              <p className="description text-[11px] truncate pb-2">
                {description}
              </p>
            </div>
          )}
          {/* tweet */}
          {type === "twitter" && (
            <blockquote className="twitter-tweet w-full h-full">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
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
              <p className="description text-[11px] line-clamp-2 pb-2">
                {description}
              </p>
            </div>
          )}
          {/* website */}
          {type === "website" && (
            <div className=" text-black flex flex-col gap-2">
              <div className=" bg-gray-200  flex items-center justify-center py-5 rounded-lg">
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
                  className="lucide lucide-globe-icon lucide-globe"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <p className="description text-[11px] truncate pb-2">
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
            <div className="tag text-white text-[11px] bg-purple-500 px-2 py-1 rounded-md">
              #{"youtube"}
            </div>
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
