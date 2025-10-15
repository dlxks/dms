"use client";

import { ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar";

import dashboardLinks from "@/src/constants/dashboardLinks";

interface NavMainProps {
  role: string;
}

export function NavMain({ role }: NavMainProps) {
  // Filter sections by allowed roles
  const filteredSections = dashboardLinks.filter(
    (section) => section.allowed.includes(role) || section.allowed.includes("")
  );

  return (
    <>
      {filteredSections.map((section) => (
        <SidebarGroup key={section.header}>
          <SidebarMenu>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                {/* CollapsibleTrigger wraps the main header of links */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={section.header}>
                    <span>{section.header}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* CollapsibleContent holds the sub-links */}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {section.links
                      .filter(
                        (link) =>
                          link.authorization.includes(role) ||
                          link.authorization.includes("")
                      )
                      .map((link) => (
                        <SidebarMenuSubItem key={link.href}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={link.href}
                              className="flex items-center gap-2"
                            >
                              <Icon
                                icon={link.icon}
                                width={20}
                                height={20}
                                className="text-blue-500"
                              />
                              <span>{link.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
