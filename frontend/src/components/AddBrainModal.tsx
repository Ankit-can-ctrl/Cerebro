import { useEffect, useRef, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import Button from "./Button";
import { useContent } from "../hooks/useContent";
import { api } from "../lib/axios";
import Loader from "./Loader";

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
  const [formData, setFormData] = useState<BrainFormData>({
    title: "",
    link: "",
    description: "",
    type: "youtube",
  });
  const [errors, setErrors] = useState<Partial<BrainFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [isFetchingMeta, setIsFetchingMeta] = useState<boolean>(false);
  const [websiteMeta, setWebsiteMeta] = useState<{
    title: string | null;
    description: string | null;
    iconUrl: string | null;
    siteName: string | null;
    image: string | null;
    canonicalUrl: string | null;
  } | null>(null);
  const debounceTimer = useRef<number | undefined>(undefined);

  const { addContent } = useContent();

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

  // Debounced website metadata fetching
  useEffect(() => {
    if (formData.type !== "website") return;
    const url = formData.link?.trim();
    if (!url) {
      setWebsiteMeta(null);
      return;
    }
    window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(async () => {
      try {
        setIsFetchingMeta(true);
        const res = await api.get("/link/metadata/fetch", {
          params: { url },
        });
        const meta = res.data as typeof websiteMeta extends infer T ? T : any;
        setWebsiteMeta(meta as any);
        // Prefill title/description if empty
        setFormData((prev) => ({
          ...prev,
          title: prev.title || (meta as any)?.title || prev.title,
          description:
            prev.description || (meta as any)?.description || prev.description,
        }));
      } catch (err) {
        // Ignore errors; user can still submit
        setWebsiteMeta(null);
      } finally {
        setIsFetchingMeta(false);
      }
    }, 500);
    return () => window.clearTimeout(debounceTimer.current);
  }, [formData.type, formData.link]);

  // category selection handler
  const handleCategorySelect = (category: CategoryType) => {
    setFormData({ ...formData, type: category });
  };

  // form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validation and submission logic here
    try {
      setIsSubmitting(true);
      let payload = { ...formData } as any;

      if (formData.type === "image") {
        setIsUploadingImage(true);
        let secureUrl: string | null = null;

        if (imageSource === "file") {
          if (!imageFile) {
            setErrors((prev) => ({
              ...prev,
              link: "Please choose an image file.",
            }));
            setIsUploadingImage(false);
            return;
          }
          const fd = new FormData();
          fd.append("image", imageFile);
          const uploadRes = await api.post("/content/upload/image", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          secureUrl = uploadRes.data.secure_url as string;
        } else {
          const url = imageUrlInput.trim();
          if (!url) {
            setErrors((prev) => ({
              ...prev,
              link: "Please paste an image URL.",
            }));
            setIsUploadingImage(false);
            return;
          }
          const uploadRes = await api.post("/content/upload/image-by-url", {
            imageUrl: url,
          });
          secureUrl = uploadRes.data.secure_url as string;
        }

        payload.link = secureUrl;
        setIsUploadingImage(false);
      }

      await addContent.mutateAsync(payload);
      alert("Brain added successfully");
      onClose();
    } catch (error) {
      alert("Error adding brain:" + error);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" fixed inset-0 z-[9999999] flex items-center justify-center">
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
        {isSubmitting ? (
          <div className="mt-4 flex items-center justify-center h-[300px] gap-3">
            <Loader />
            <span className="text-white font-semibold">Saving...</span>
          </div>
        ) : (
          <>
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
              className="mt-2 flex flex-col gap-3 items-start text-lg"
            >
              <div className="w-full">
                <label
                  className="text-sm text-white font-semibold block mb-1"
                  htmlFor="title"
                >
                  Title:
                </label>
                <input
                  className={`w-full rounded-md py-2 px-3 text-sm outline-none ${
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
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  className="text-sm text-white font-semibold block mb-1"
                  htmlFor="link"
                >
                  {formData.type === "image"
                    ? imageSource === "file"
                      ? "Upload Image:"
                      : "Image URL:"
                    : "Link:"}
                </label>
                {formData.type === "image" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        className={`${
                          imageSource === "file"
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 text-gray-700"
                        } px-2 py-1 rounded`}
                        onClick={() => setImageSource("file")}
                      >
                        Upload file
                      </button>
                      <button
                        type="button"
                        className={`${
                          imageSource === "url"
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 text-gray-700"
                        } px-2 py-1 rounded`}
                        onClick={() => setImageSource("url")}
                      >
                        Use URL
                      </button>
                    </div>
                    {imageSource === "file" ? (
                      <div className="flex flex-col gap-2">
                        <input
                          className={`w-full rounded-md py-2 px-3 text-sm outline-none ${
                            errors.link ? "border-red-500" : ""
                          }`}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(e.target.files?.[0] || null)
                          }
                        />
                        {imageFile ? (
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt="preview"
                            className="max-h-32 rounded"
                          />
                        ) : null}
                      </div>
                    ) : (
                      <input
                        className={`w-full rounded-md py-2 px-3 text-sm outline-none ${
                          errors.link ? "border-red-500" : ""
                        }`}
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    )}
                    {isUploadingImage && (
                      <div className="text-white text-xs opacity-80">
                        Uploading image…
                      </div>
                    )}
                    {errors.link && (
                      <p className="text-red-500 text-sm mt-1">{errors.link}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      className={`w-full rounded-md py-2 px-3 text-sm outline-none ${
                        errors.link ? "border-red-500" : ""
                      }`}
                      name="link"
                      type="text"
                      id="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="Paste link here...."
                    />
                    {errors.link && (
                      <p className="text-red-500 text-sm mt-1">{errors.link}</p>
                    )}
                  </>
                )}
                {formData.type === "website" && (
                  <div className="mt-2 bg-white/20 rounded-md p-2 text-white">
                    {isFetchingMeta ? (
                      <div className="text-xs opacity-80">
                        Fetching preview…
                      </div>
                    ) : websiteMeta ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {websiteMeta.iconUrl ? (
                            <img
                              src={websiteMeta.iconUrl}
                              alt="icon"
                              className="w-6 h-6"
                            />
                          ) : (
                            <span className="text-gray-700 text-sm font-bold">
                              {(
                                new URL(
                                  (websiteMeta.canonicalUrl ||
                                    formData.link) as string
                                ).hostname[0] || "?"
                              ).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold line-clamp-1">
                            {websiteMeta.title || "Untitled"}
                          </div>
                          <div className="text-[11px] opacity-80 line-clamp-2">
                            {websiteMeta.description || "No description"}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              {formData.type !== "youtube" && formData.type !== "twitter" && (
                <div className="w-full">
                  <label
                    className="text-sm text-white font-semibold block mb-1"
                    htmlFor="description"
                  >
                    Description:
                  </label>
                  <textarea
                    className="w-full rounded-md py-2 px-3 text-sm outline-none"
                    name="description"
                    id="description"
                    placeholder="Describe your brain..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              )}

              {/* button */}
              <div className="mt-2 flex items-center justify-center">
                <Button
                  type="submit"
                  text={isSubmitting ? "Loading..." : "Add Brain"}
                  variant="primary"
                  size="md"
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddBrainModal;
