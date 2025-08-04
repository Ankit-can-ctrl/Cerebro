import { useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import Button from "./Button";

interface AddBrainModalProps {
  onClose: () => void;
}

interface BrainFormData {
  title: string;
  link: string;
  description: string;
  type: string;
}

type CategoryType =
  | "youtube"
  | "twitter"
  | "document"
  | "website"
  | "image"
  | "music";

const AddBrainModal = ({ onClose }: AddBrainModalProps) => {
  const [category, setCategory] = useState<string>("youtube");
  const [formData, setFormData] = useState<BrainFormData>({
    title: "",
    link: "",
    description: "",
    type: "youtube",
  });
  const [errors, setErrors] = useState<Partial<BrainFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories: { value: CategoryType; label: string }[] = [
    { value: "youtube", label: "Youtube" },
    { value: "twitter", label: "Twitter" },
    { value: "document", label: "Document" },
    { value: "website", label: "Website" },
    { value: "image", label: "Image" },
    { value: "music", label: "Music" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // clear error for the field in which user has typed
    if (errors[name as keyof BrainFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // category selection handler
  const handleCategorySelect = (category: CategoryType) => {
    setFormData({ ...formData, type: category });
  };

  // form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form submitted.");
    // validation and submission logic here
  };

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-80 transition-opacity"
      />
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-400 text-black w-[400px] h-fit rounded-lg p-4">
        {/* header */}
        <header className="flex justify-between items-center text-white font-semibold">
          <h1>Add New Brain</h1>
          <div onClick={onClose} className=" cursor-pointer">
            <CloseIcon color="primary" />
          </div>
        </header>
        {/* categories */}
        <div className="mt-2 flex flex-col gap-2">
          <h1 className="text-xs font-bold text-gray-300">Category:</h1>
          <div className="flex gap-2 flex-wrap">
            {categories.map((item) => {
              return (
                <button
                  key={item.value}
                  onClick={() => handleCategorySelect(item.value)}
                  className={`${
                    formData.type === item.value
                      ? "bg-purple-700 text-white"
                      : "bg-gray-200 text-gray-700"
                  } p-2 rounded-md text-xs font-semibold`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex flex-col gap-2 items-start text-lg"
        >
          <div className="flex gap-2 items-center justify-center">
            <label className="text-sm text-white font-semibold" htmlFor="title">
              Title :
            </label>
            <input
              className={`rounded-md py-1 px-2 text-lg outline-none ${
                errors.title ? "border-red-500" : ""
              }`}
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a title for your brain."
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="flex gap-2 items-center justify-center">
            <label className="text-sm text-white font-semibold" htmlFor="title">
              Link :
            </label>
            <input
              className={`rounded-md py-1 px-2 text-lg outline-none ${
                errors.link ? "border-red-500" : ""
              }`}
              name="link"
              typeof="url"
              id="title"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Paste link here...."
            />
          </div>
          <div className="w-full">
            <textarea
              className="w-full rounded-md py-1 px-2 text-lg outline-none"
              name="Description"
              id="description"
              placeholder="Describe your brain..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            ></textarea>
          </div>
        </form>

        {/* button */}
        <div className="mt-2 flex items-center justify-center">
          <Button
            type="submit"
            text={isSubmitting ? "Loading..." : "Add Brain"}
            variant="primary"
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default AddBrainModal;
