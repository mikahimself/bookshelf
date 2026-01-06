import { Session } from "next-auth";
import Link from "next/link";

type SidebarProps = {
  session: Session | null;
};
export default function Sidebar({ session }: SidebarProps) {
  return (
    <nav className="w-40 bg-blue-200 p-3 text-black">
      <Link href="/add-book" scroll={false}>
        Lisää kirja
      </Link>
    </nav>
  );
}
