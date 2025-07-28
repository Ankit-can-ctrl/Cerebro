// icon props types
export interface IconProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary";
}

export const colorStyles = {
  primary: "text-white",
  secondary: "text-gray-500",
};

export const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};
