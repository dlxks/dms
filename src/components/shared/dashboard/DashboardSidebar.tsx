import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import dashboardLinks from "../../../app/lib/dashboardLinks";
import { auth } from "@/lib/auth";

const DashboardSidebar = async () => {
  const session = await auth();

  const role = session?.user.role;

  const renderDashboardLinks = (
    <>
      {dashboardLinks.map((section, index) => (
        <li key={index} className="mb-2">
          <h4 className="px-4 py-2 text-sm font-bold text-primary uppercase tracking-wide">
            {section.header}
          </h4>
          <ul>
            {section.links.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </>
  );
  return (
    <div className="drawer-side">
      <label
        htmlFor="dashboard-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <ul className="menu bg-base-200 min-h-full w-80">
        <div className="menu-title class">
          <div className="flex justify-between items-center border-b border-b-gray-200 pb-4">
            <h3 className="text-neutral text-lg">
              Graduate School and Open Learning College
            </h3>

            <label
              htmlFor="dashboard-drawer"
              aria-label="close sidebar"
              className="btn btn-circle btn-ghost text-2xl cursor-pointer lg:hidden"
            >
              <Icon icon="line-md:menu-fold-left" width="24" height="24" />
            </label>
          </div>
        </div>

        <ul>
          {/* Sidebar content here */}
          {renderDashboardLinks}
        </ul>
      </ul>
    </div>
  );
};
export default DashboardSidebar;
