import { type IconProps, sizeStyles, colorStyles } from "../types/IconProps";

function LinkIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-link2-icon lucide-link-2 ${
        colorStyles[props.color || "primary"]
      } ${sizeStyles[props.size || "md"]} text-purple-500`}
    >
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </svg>
  );
}
export default LinkIcon;
