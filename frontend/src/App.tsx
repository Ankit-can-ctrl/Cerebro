import { useState } from "react";
import AddBrainModal from "./components/AddBrainModal";
import BrainCard from "./components/BrainCard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className=" relative h-screen bg-gray-900 text-white overflow-hidden font-secondary">
      {isModalOpen && <AddBrainModal onClose={handleModal} />}
      <Navbar onOpen={handleModal} />
      {/* <BrainCard /> */}
      <div>
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
