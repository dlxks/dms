"use client";

import { Button } from "@/src/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface BackButtonProps {
  label?: string;
  className?: string;
}

const BackButton = ({ label = "Go Back", className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      <IconChevronLeft size={16} />
      {label}
    </Button>
  );
};

export default BackButton;
