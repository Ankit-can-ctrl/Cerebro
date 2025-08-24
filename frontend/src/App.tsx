import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Account from "./components/Account";
import ShareView from "./pages/ShareView";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/accounts" element={<Account />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/share/:hash" element={<ShareView />} />
      </Routes>
    </>
  );
};

export default App;
