import { type IconProps, sizeStyles, colorStyles } from "../types/IconProps";

function CloseIcon(props: IconProps) {
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
      className={`lucide lucide-x-icon lucide-x ${
        sizeStyles[props.size || "md"]
      } ${colorStyles[props.color || "secondary"]}`}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default CloseIcon;
