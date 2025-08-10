import { useState } from "react";
import AddBrainModal from "./AddBrainModal";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden font-secondary flex flex-col">
      {isModalOpen && <AddBrainModal onClose={handleModal} />}
      <Navbar onOpen={handleModal} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 ml-32">{<Outlet />}</main>
      </div>
    </div>
  );
};

export default Layout;
