interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary",
}

export default function IconButton({ variant, ...props}: IconButtonProps) {
  return (
    <button className="rounded-full w-8 h-8 hover:bg-gray-300 hover:cursor-pointer active:bg-gray-400" onClick={props.onClick}>
      {}
    </button>
  )
}