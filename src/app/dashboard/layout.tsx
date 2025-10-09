import { auth } from "@/lib/auth";
import UserRedirect from "@/src/components/auth/redirect";
import { AppSidebar } from "@/src/components/shared/dashboard/nav/app-sidebar";
import { SiteHeader } from "@/src/components/shared/dashboard/nav/site-header";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { Toaster } from "sonner";

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="space-y-6 p-4">
          {children}
          <Toaster position="top-right" richColors />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
