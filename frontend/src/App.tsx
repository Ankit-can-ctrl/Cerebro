import Button from "./components/ui/Button";
import { PlusIcon } from "./icons/PlusIcon";

const App = () => {
  return (
    <div className=" w-full h-[100vh] flex items-center justify-center gap-5">
      <Button
        startIcon={<PlusIcon size="sm" />}
        text="Add"
        variant="primary"
        size="sm"
      />
    </div>
  );
};

export default App;
