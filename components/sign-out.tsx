import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async() => {
        "use server"
        await signOut()
      }}>
        <button>Sign out</button>
    </form>
  )
}