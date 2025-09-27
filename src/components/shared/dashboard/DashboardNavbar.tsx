import { Icon } from "@iconify/react/dist/iconify.js";
import { SignOut } from "../../auth/auth-components";
import { auth } from "@/lib/auth";
import Image from "next/image";

const DashboardNavbar = async () => {
  const session = await auth();

  const profileImg = session?.user?.image;
  console.log(profileImg);

  return (
    <div className="navbar bg-base-300 w-full">
      {/* Left - Sidebar toggle button (hidden on lg) */}
      <div className="flex-none lg:hidden">
        <label
          htmlFor="dashboard-drawer"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <Icon icon="line-md:menu-fold-right" width="24" height="24" />
        </label>
      </div>

      {/* Middle - Navbar Title (hidden on lg, but keeps flex-1 for spacing) */}
      <div className="mx-2 flex-1 px-2">
        <span className="lg:hidden">Navbar Title</span>
      </div>

      {/* Right - Profile dropdown (always aligned right) */}
      <div className="flex-none">
        <ul className="menu menu-horizontal flex items-center">
          <li>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    src={profileImg as string}
                    alt="User Profile"
                    height={740}
                    width={740}
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a>Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <SignOut />
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardNavbar;
