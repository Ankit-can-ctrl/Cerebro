import BrainCard from "./components/BrainCard";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden font-secondary">
      <Navbar />
      <BrainCard />
    </div>
  );
};

export default App;
