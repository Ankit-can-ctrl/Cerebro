import logo from "../assets/logo.png";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import Button from "./Button";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800/80 to-transparent w-full min-h-[60px] backdrop-blur-sm px-10 py-5 flex justify-between">
      <div className="title flex items-center">
        <img src={logo} alt="logo" className="w-12 h-12" />
        <h1 className="text-2xl font-bold">Cerebro</h1>
      </div>
      <div className="btns flex items-center gap-3">
        <Button
          text="Share"
          variant="primary"
          size="sm"
          startIcon={<ShareIcon size="sm" />}
        />
        <Button
          text="Add"
          variant="secondary"
          size="sm"
          startIcon={<PlusIcon size="sm" />}
        />
      </div>
    </div>
  );
};

export default Navbar;
