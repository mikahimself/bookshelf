import { Session } from "next-auth";
import SignIn from "../SignInButton";
import { SignOut } from "../SignOutButton";

type HeaderProps = {
  session: Session | null;
};

export default function Header({ session }: HeaderProps) {
  return (
    <header className="flex min-h-6 flex-row justify-end bg-blue-800 p-2">
      {session?.user ? <SignOut userName={session.user.name} /> : <SignIn />}
    </header>
  );
}
