"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/src/lib/utils";
import { Icon } from "@iconify/react";

function SignOutOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 rounded-lg bg-white px-6 py-8 shadow-lg">
        <Icon
          icon="line-md:loading-twotone-loop"
          width={40}
          height={40}
          className="animate-spin text-gray-700"
        />
        <p className="text-lg font-semibold text-gray-800">Signing out...</p>
      </div>
    </div>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="submit"
        className={cn(
          "w-full justify-start text-left flex items-center gap-2",
          className
        )}
        disabled={pending}
      >
        <Icon
          icon="heroicons:arrow-left-start-on-rectangle-16-solid"
          width={16}
          height={16}
        />
        Sign Out
      </button>

      {pending && <SignOutOverlay />}
    </>
  );
}
