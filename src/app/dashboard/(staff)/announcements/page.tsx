import { getAnnouncements } from "@/src/utils/getAnnouncements";
import AnnouncementsList from "./components/announcements-list";
import { auth } from "@/lib/auth";

const AnnouncementsPage = async () => {
  const session = await auth();
  const staffId = session?.user?.id;

  const rawData = await getAnnouncements({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="mx-auto lg:p-6 space-y-6">
      <h1 className="text-xl font-bold tracking-wide">Announcements</h1>

      <AnnouncementsList staffId={staffId} initialData={rawData} />
    </div>
  );
};

export default AnnouncementsPage;
