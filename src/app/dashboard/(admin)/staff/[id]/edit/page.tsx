export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updateUserAction } from "../../actions";
import EditForm from "./edit-form";

async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { accounts: true, sessions: true },
  });
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) return notFound();

  return (
    <div className="p-6 space-y-4">
      <Link
        href="/dashboard/staff"
        className="flex items-center link link-hover"
      >
        <Icon
          icon="material-symbols:chevron-left-rounded"
          width="24"
          height="24"
        />
        Return to list
      </Link>

      <div className="w-full mx-auto max-w-2xl">
        <h1 className="text-xl font-bold mb-6">Edit Staff Information</h1>
        <EditForm user={user} updateUserAction={updateUserAction} id={id} />
      </div>
    </div>
  );
}
