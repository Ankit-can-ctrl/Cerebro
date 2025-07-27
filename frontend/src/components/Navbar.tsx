import logo from "../assets/logo.png";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import Button from "./Button";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800/80 to-transparent w-full min-h-[60px] backdrop-blur-sm px-10 py-5 flex justify-between">
      <div className="title flex items-center">
        <img src={logo} alt="logo" className="w-12 h-12" />
        <h1 className="text-4xl font-bold">Cerebro</h1>
      </div>
      <div className="btns flex items-center gap-3">
        <Button
          text="Share"
          variant="primary"
          size="md"
          startIcon={<ShareIcon size="md" />}
        />
        <Button
          text="Add"
          variant="secondary"
          size="md"
          startIcon={<PlusIcon size="md" />}
        />
      </div>
    </div>
  );
};

export default Navbar;
