import Navbar from "@/src/components/shared/navbar/Navbar";
import Sidebar from "@/src/components/shared/navbar/Sidebar";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="drawer">
      <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        {children}
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
