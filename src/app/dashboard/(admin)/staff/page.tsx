import LoadingState from "@/src/components/shared/LoadingState";
import { getUsers } from "@/src/utils/getUsers";
import { Suspense } from "react";
import StaffTable from "./components/staff-table";
import { requireRole } from "@/src/lib/requireRole";

const UsersPage = async () => {
  await requireRole("ADMIN");

  const rawData = await getUsers({
    filters: { role: "STAFF" },
    page: 1,
    pageSize: 10,
  });

  // Ensure firstName is always a string
  const initialData = {
    ...rawData,
    items: rawData.items.map((user: any) => ({
      ...user,
      firstName: user.firstName ?? "",
    })),
  };

  return (
    <div className="lg:p-6 space-y-6">
      <h1 className="text-xl font-bold tracking-wide">Staff List</h1>
      <Suspense fallback={<LoadingState rows={10} />}>
        <StaffTable role="STAFF" initialData={initialData} />
      </Suspense>
    </div>
  );
};

export default UsersPage;
