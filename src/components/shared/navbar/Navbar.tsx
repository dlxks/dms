"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { homeNavLinks } from "./Sidebar";
import { cn } from "@/src/lib/utils";

const Navbar = () => {
  const pathname = usePathname();

  const renderNavLinks = (
    <>
      {homeNavLinks.map((item, index) => {
        const isActive = pathname === item.href;
        const classes = cn(
          "my-1 tracking-wider transition-colors",
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
    <header>
      <div className="navbar w-full shadow-sm/20">
        <div className="container mx-auto flex items-center">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-1"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <Icon icon="line-md:menu-fold-right" width="24" height="24" />
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">
            <Link href="/">Graduate School and Open Learning College</Link>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              {renderNavLinks}
            </ul>
          </div>
          <div className="">
            <ul className="menu menu-horizontal px-1 flex items-center justify-center gap-2">
              <li className="">
                <Link href="/signin" className="btn btn-primary">
                  Sign In
                </Link>
              </li>
              {/* <li>
                <Link href="/signup" className="btn btn-primary">
                  Create Account
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
