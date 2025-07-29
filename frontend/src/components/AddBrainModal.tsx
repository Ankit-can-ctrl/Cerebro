import CloseIcon from "../icons/CloseIcon";

interface AddBrainModalProps {
  onClose: () => void;
}

const AddBrainModal = ({ onClose }: AddBrainModalProps) => {
  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-80 transition-opacity"
      />
      <div className="relative bg-white text-black w-[400px] h-[400px] rounded-lg p-4">
        {/* header */}
        <header className="flex justify-between items-center">
          <h1>Add New Brain</h1>
          <div onClick={onClose} className=" cursor-pointer">
            <CloseIcon />
          </div>
        </header>
      </div>
    </div>
  );
};

export default AddBrainModal;
