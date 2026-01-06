interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType;
  variant?: "primary" | "secondary";
}

export default function Button({ icon: Icon, variant, ...props }: ButtonProps) {
  const buttonColor =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-500 text-white"
      : "hover:bg-gray-300 active:bg-gray-400 text-gray-950";
  const padding = Icon ? "pr-2.5 pl-2.5" : "pr-3 pl-3";

  return (
    <button
      className={`flex h-fit cursor-pointer rounded-sm p-1.25 text-sm ${padding} ${buttonColor}`}
      onClick={props.onClick}
    >
      {Icon && <Icon className={`mr-1 h-4 w-4 self-center`} />}
      {props.children}
    </button>
  );
}
