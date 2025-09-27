import { auth } from "@/lib/auth";
import UserRedirect from "@/src/components/auth/redirect";
import DashboardNavbar from "@/src/components/shared/dashboard/DashboardNavbar";
import DashboardSidebar from "@/src/components/shared/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return (
      <UserRedirect redirectTo="/signin" message="You must sign in first..." />
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <DashboardNavbar />
        {children}
      </div>
      <DashboardSidebar />
    </div>
  );
}
