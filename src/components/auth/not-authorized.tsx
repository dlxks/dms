"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NotAuthorizedProps {
  redirectTo: string; // Target path for redirection
  delay?: number; // Countdown duration in seconds (default = 3)
  message?: string; // Optional custom message
}

/**
 * NotAuthorized
 *
 * Displays a clear "Not Authorized" page:
 * - Shows error message + spinner
 * - Counts down before redirecting
 * - Provides a "Redirect Now" button
 */
export default function NotAuthorized({
  redirectTo,
  delay = 3,
  message = "You are not authorized to view this page.",
}: NotAuthorizedProps) {
  const [countdown, setCountdown] = useState(delay);
  const router = useRouter();

  // Countdown logic → auto-redirect after timer ends
  useEffect(() => {
    if (countdown <= 0) {
      router.replace(redirectTo);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, redirectTo, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center space-y-4">
        {/* Spinner Loader */}
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent mx-auto" />

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-red-600">Not Authorized</h1>
        <p className="text-gray-700">{message}</p>

        {/* Countdown */}
        <p className="text-gray-600">
          Redirecting in <span className="font-bold">{countdown}</span>{" "}
          seconds...
        </p>

        {/* Manual Redirect Button */}
        <button
          onClick={() => router.replace(redirectTo)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Redirect Now
        </button>
      </div>
    </div>
  );
}
