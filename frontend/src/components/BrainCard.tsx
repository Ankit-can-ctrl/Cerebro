import { ShareIcon } from "../icons/ShareIcon";
import TrashIcon from "../icons/TrashIcon";
import TweetIcon from "../icons/TweetIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import DocIcon from "../icons/DocIcon";
import LinkIcon from "../icons/LinkIcon";
import ImageIcon from "../icons/ImageIcon";
import MusicIcon from "../icons/MusicIcon";

interface BrainCardProps {
  link: string;
  title: string;
  type: "youtube" | "twitter" | "doc" | "link" | "image" | "music";
}

const BrainCard = ({
  link = "https://www.youtube.com/watch?v=fe0QmskwWEM",
  title = "New tech 2025",
  type = "youtube",
}: BrainCardProps) => {
  return (
    <div className="bg-white rounded-lg w-[350px] min-h-[300px] p-3 group">
      {/* card header */}
      <header className="header border-b border-gray-200 py-2 w-full flex justify-between">
        <div className="headings flex items-center justify-center gap-2">
          {type === "youtube" && <YoutubeIcon size="lg" color="secondary" />}
          {type === "twitter" && <TweetIcon size="md" color="secondary" />}
          {type === "doc" && <DocIcon size="md" color="secondary" />}
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
      </div>
      <div className="tags"></div>
      <div className="date"></div>
    </div>
  );
};

export default BrainCard;
