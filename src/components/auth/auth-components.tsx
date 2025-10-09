import { signIn, signOut } from "@/lib/auth";
import { cn } from "@/src/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SignOutButton } from "./signout-button";

interface SignOutProps {
  className?: string;
}

export function SignIn({ provider }: { provider?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        // Always go to /dashboard after login
        return await signIn(provider, { callbackUrl: "/dashboard" });
      }}
    >
      <button className="btn p-2 rounded-md flex items-center gap-2">
        <Icon icon="material-icon-theme:google" />
        Sign in with<span className="capitalize">{provider}</span>
      </button>
    </form>
  );
}

export function SignOut({ className }: SignOutProps) {
  const signOutClass = cn("w-full justify-start text-left", className);

  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
      className="w-full block"
    >
      <SignOutButton className={signOutClass} />
    </form>
  );
}
