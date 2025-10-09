export type DashboardLink = {
  icon: string;
  name: string;
  href: string;
  authorization: string[]; // always an array
};

export type DashboardSection = {
  header: string;
  links: DashboardLink[];
  allowed: string[]; // always an array
};

const dashboardLinks: DashboardSection[] = [
  {
    header: "Main",
    links: [
      {
        icon: "heroicons:home-20-solid",
        name: "Dashboard",
        href: "/dashboard",
        authorization: [""],
      },
    ],
    allowed: [""],
  },
  {
    header: "Schedule",
    links: [
      {
        icon: "heroicons:calendar-days-solid",
        name: "Thesis Defense Schedule",
        href: "/dashboard/defense-schedules",
        authorization: ["STAFF", "ADMIN"],
      },
      {
        icon: "heroicons:clock-solid",
        name: "Defense Schedule",
        href: "/dashboard/schedules",
        authorization: ["FACULTY", "STUDENT", "ADMIN"],
      },
      {
        icon: "heroicons:megaphone-solid",
        name: "Announcements",
        href: "/dashboard/announcements",
        authorization: [""],
      },
    ],
    allowed: ["ADMIN", "STAFF", "FACULTY"],
  },
  {
    header: "Thesis",
    links: [
      {
        icon: "heroicons:user-group-solid",
        name: "Advisees",
        href: "/dashboard/advisees",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY", "ADMIN"],
  },
  {
    header: "Documents Management",
    links: [
      {
        icon: "heroicons:document-text-solid",
        name: "Defense Requirements",
        href: "/dashboard/defense-requirements",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY", "ADMIN"],
  },
  {
    header: "Account Management",
    links: [
      {
        icon: "heroicons:users-solid",
        name: "Staff",
        href: "/dashboard/staff",
        authorization: ["ADMIN"],
      },
      {
        icon: "heroicons:academic-cap-solid",
        name: "Faculty",
        href: "/dashboard/faculty",
        authorization: ["ADMIN"],
      },
      {
        icon: "heroicons:identification-solid",
        name: "Students",
        href: "/dashboard/students",
        authorization: ["ADMIN"],
      },
    ],
    allowed: ["ADMIN"],
  },
];

export default dashboardLinks;
