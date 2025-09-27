"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-base-200 text-center">
      <h1 className="text-4xl font-bold text-error mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="flex gap-4">
        <button onClick={() => router.back()} className="btn btn-primary">
          Go Back
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="btn btn-secondary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
