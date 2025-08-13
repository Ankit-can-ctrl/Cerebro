import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import Button from "./Button";

interface NavbarProps {
  onOpen: () => void;
}

const Navbar = ({ onOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="bg-gradient-to-b from-gray-800/80 to-transparent w-full min-h-[60px] backdrop-blur-sm px-10 py-5 flex justify-between">
      <div className="title flex items-center">
        <img src={logo} alt="logo" className="w-12 h-12" />
        <h1 className="text-4xl font-bold font-primary">Cerebro</h1>
      </div>
      <div className="btns flex items-center gap-3">
        <Button
          text="Share"
          variant="primary"
          size="sm"
          startIcon={<ShareIcon size="sm" />}
        />
        <div className="cursor-pointer">
          <Button
            onClick={onOpen}
            text="Add"
            variant="secondary"
            size="sm"
            startIcon={<PlusIcon size="sm" />}
          />
        </div>
        <div className="cursor-pointer">
          <Button
            onClick={handleLogout}
            text="Logout"
            variant="secondary"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
