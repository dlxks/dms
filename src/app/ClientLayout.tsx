import { ReactNode } from "react";
import Navbar from "../components/shared/navbar/Navbar";
import Sidebar from "../components/shared/navbar/Sidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
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
