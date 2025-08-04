import type { ReactElement } from "react";

export interface ButtonProps {
  text: String;
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  startIcon?: any | ReactElement;
  endIcon?: any | ReactElement;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 transition-all duration-300 text-white",
  secondary:
    "bg-gray-700/50 hover:bg-gray-600/50 hover:scale-105  transition-all duration-300 text-white",
};

const defaultStyle =
  "rounded-md px-4 py-2 flex items-center gap-1 font-semibold";

const sizeStyles = {
  sm: "text-sm px-4 py-2",
  md: "text-md px-6 py-3",
  lg: "text-lg px-8 py-4",
};

function Button(props: ButtonProps) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={`${variantStyles[props.variant]} ${defaultStyle} ${
        sizeStyles[props.size]
      }`}
    >
      {props.startIcon} <span>{props.text}</span> {props.endIcon}
    </button>
  );
}

export default Button;
