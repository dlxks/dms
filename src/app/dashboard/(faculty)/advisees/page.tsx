import LoadingState from "@/src/components/shared/LoadingState";
import { getAdvisees } from "@/src/utils/getAdvisees";
import { auth } from "@/lib/auth";
import AdviseesTable from "./components/advisees-table";

const AdviseesPage = async () => {
  const session = await auth();
  const adviserId = session?.user?.id;

  const rawData = await getAdvisees({
    page: 1,
    pageSize: 10,
    adviserId,
  });

  const initialData = {
    ...rawData,
    items: rawData.items.map((item: any) => ({
      ...item,
      student: {
        ...item.student,
        firstName: item.student?.firstName ?? "",
        lastName: item.student?.lastName ?? "",
        email: item.student?.email ?? "",
        phoneNumber: item.student?.phoneNumber ?? "",
      },
    })),
  };

  console.log("Initial data for table:", initialData);

  return (
    <div className="lg:p-6 space-y-6">
      <h1 className="text-xl font-bold tracking-wide">My Advisees</h1>
      <AdviseesTable initialData={initialData} adviserId={adviserId ?? ""} />
    </div>
  );
};

export default AdviseesPage;
