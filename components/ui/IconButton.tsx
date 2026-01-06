interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
  color?: string;
  variant?: "primary" | "secondary";
}

export default function IconButton({
  variant,
  color,
  icon: Icon,
  ...props
}: IconButtonProps) {
  const hover =
    variant === "primary"
      ? "hover:bg-blue-600 active:bg-blue-800"
      : "hover:bg-gray-300 active:bg-gray-400";
  return (
    <button
      className={`flex h-8 w-8 justify-center rounded-full hover:cursor-pointer ${hover}`}
      onClick={props.onClick}
    >
      <Icon className={`h-6 w-6 self-center ${color ?? "text-gray-600"}`} />
      {}
    </button>
  );
}
