import { signOut } from "@/auth";
import Button from "./Button";

type SignOutButtonProps = {
  userName: string | undefined | null;
};

export function SignOut({ userName }: SignOutButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="primary" type="submit">
        Sign out {userName ?? ""}
      </Button>
    </form>
  );
}
