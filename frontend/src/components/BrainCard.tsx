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
  title: string;
  description?: string;
  type: "youtube" | "twitter" | "document" | "link" | "image" | "music";
}

const BrainCard = ({
  link = "https://www.youtube.com/watch?v=fe0QmskwWEM",
  title = "New tech 2025",
  type = "document",
  description = "New tech 2025",
}: BrainCardProps) => {
  return (
    <>
      <div className="bg-white rounded-lg w-[350px] min-h-[300px] p-3 group flex flex-col justify-between">
        {/* card header */}
        <header className="header border-b border-gray-200 py-2 w-full flex justify-between">
          <div className="headings flex items-center justify-center gap-2">
            {type === "youtube" && <YoutubeIcon size="lg" color="secondary" />}
            {type === "twitter" && <TweetIcon size="md" color="secondary" />}
            {type === "document" && <DocIcon size="md" color="secondary" />}
            {type === "link" && <LinkIcon size="md" color="secondary" />}
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
        <div className="content rounded-lg overflow-hidden mt-4">
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

          {/* tweet */}
          {type === "twitter" && (
            <blockquote className="twitter-tweet w-full h-full">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}
          {/* document */}
          {type === "document" && (
            <div className="text-sm text-black flex items-center gap-2">
              <DocIcon size="md" color="secondary" />
              <p className="description line-clamp-3">{description}</p>
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
