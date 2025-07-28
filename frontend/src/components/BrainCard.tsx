import TweetIcon from "../icons/TweetIcon";

const BrainCard = () => {
  return (
    <div className="bg-white rounded-lg min-w-[300px] w-fit min-h-[300px] p-3">
      {/* card header */}
      <header className="header">
        <div className="headings">
          <TweetIcon size="md" color="secondary" />
        </div>
        <div className="btns"></div>
      </header>
      <div className="content"></div>
      <div className="tags"></div>
      <div className="date"></div>
    </div>
  );
};

export default BrainCard;
