import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { auth } from "@/lib/auth";
import { NavUser } from "./nav-user";
import Link from "next/link";

export async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  const role = session?.user?.role ?? "";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <IconInnerShadowTop className="size-5" />
                <span className="text-base font-semibold">CvSU-GSOLC</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavMain role={role} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {session?.user && <NavUser session={session} />}
      </SidebarFooter>
    </Sidebar>
  );
}
