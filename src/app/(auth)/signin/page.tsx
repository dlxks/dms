import { auth } from "@/lib/auth";
import SignInForm from "./SigninForm";
import { SignIn } from "@/src/components/auth/auth-components";
import UserRedirect from "@/src/components/auth/redirect";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

const SignInPage = async () => {
  const session = await auth();

  if (session?.user) {
    const redirectTarget = "/dashboard";

    return (
      <UserRedirect
        redirectTo={redirectTarget}
        delay={3}
        message="Redirecting to dashboard"
      />
    );
  }

  // Not signed in → show login form
  return (
    <section className="container mx-auto py-12 px-4 lg:px-0">
      <Link href="/" className="flex items-center link link-hover">
        <Icon
          icon="material-symbols:chevron-left-rounded"
          width="24"
          height="24"
        />
        Return to home
      </Link>
      <div className="flex min-h-[60vh] items-center justify-center mt-16">
        <div className="bg-slate-500/80 glass w-full max-w-md rounded-xl p-8 shadow-md/20">
          <h1 className="mb-6 text-center text-2xl text-white font-semibold tracking-wide">
            Sign in to your account
          </h1>

          {/* Credentials form */}
          {/* <SignInForm /> */}

          {/* <div className="divider py-4">OR</div> */}

          {/* Google OAuth */}
          <div className="w-full flex items-center justify-center">
            <SignIn provider="google" />
          </div>

          {/* <p className="text-center text-sm mt-4">
            Don&apos;t have an account yet?{" "}
            <a href="/signup" className="link link-primary">
              Sign up
            </a>
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
