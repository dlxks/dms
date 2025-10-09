"use client";

import { cn } from "@/src/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const homeNavLinks = [
  { name: "Home", href: "/", icon: "" },
  { name: "About Us", href: "/about", icon: "" },
];

const Sidebar = () => {
  const pathname = usePathname();

  const renderNavLinks = (
    <>
      {homeNavLinks.map((item, index) => {
        const isActive = pathname === item.href;
        const classes = cn(
          "my-1 text-lg tracking-wider transition-colors",
          isActive ? "text-orange-500 font-semibold" : "hover:text-orange-400"
        );

        return (
          <li key={index}>
            <Link href={item.href} className={classes}>
              {item.name}
            </Link>
          </li>
        );
      })}
    </>
  );

  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer-1"
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
              htmlFor="my-drawer-1"
              aria-label="close sidebar"
              className="btn btn-circle btn-ghost text-2xl cursor-pointer"
            >
              <Icon icon="line-md:menu-fold-left" width="24" height="24" />
            </label>
          </div>
        </div>

        <ul>
          {/* Sidebar content here */}
          {renderNavLinks}
        </ul>
      </ul>
    </div>
  );
};
export default Sidebar;
