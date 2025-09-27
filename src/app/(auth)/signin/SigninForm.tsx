"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";

// ✅ Schema with Zod
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const SignInForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ RHF setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { remember: false },
  });

  // ✅ On submit handler
  async function onSubmit(values: FormData) {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      remember: values.remember ? "true" : "false",
    });

    if (res?.ok) {
      // Fetch session to inspect role
      const s = await (await fetch("/api/auth/session")).json();
      const role = s?.user?.role ?? "STUDENT";

      // Role-based redirect
      switch (role) {
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "FACULTY":
          router.replace("/dashboard/faculty");
          break;
        case "STAFF":
          router.replace("/dashboard/staff");
          break;
        case "STUDENT":
        default:
          router.replace("/dashboard/student");
          break;
      }
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Email address</legend>
        <input
          type="email"
          placeholder="name@company.com"
          className="input input-bordered w-full"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </fieldset>

      {/* Password with show/hide */}
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Password</legend>
        <label className="input w-full flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="flex-1 outline-none"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:cursor-pointer text-xl"
          >
            {showPassword ? (
              <Icon icon="heroicons:eye-slash-16-solid" />
            ) : (
              <Icon icon="heroicons:eye-16-solid" />
            )}
          </button>
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </fieldset>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between text-sm py-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            {...register("remember")}
          />
          Remember me
        </label>
        <a href="/auth/forget-password" className="link link-primary text-sm">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
