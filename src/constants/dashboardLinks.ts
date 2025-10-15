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
        icon: "heroicons-outline:home", // outline home
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
        icon: "heroicons-outline:calendar", // outline calendar
        name: "Thesis Defense Schedule",
        href: "/dashboard/defense-schedules",
        authorization: ["STAFF", "ADMIN"],
      },
      {
        icon: "heroicons-outline:clock", // outline clock
        name: "Defense Schedule",
        href: "/dashboard/schedules",
        authorization: ["FACULTY", "STUDENT", "ADMIN"],
      },
      {
        icon: "heroicons-outline:megaphone", // outline megaphone
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
        icon: "heroicons-outline:user-group", // outline user group
        name: "Advisees",
        href: "/dashboard/advisees",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY", "ADMIN"],
  },
  {
    header: "Documents",
    links: [
      {
        icon: "heroicons-outline:clipboard-check", // Defense Requirements → checklist outline
        name: "Defense Requirements",
        href: "/dashboard/defense-requirements",
        authorization: [""],
      },
      {
        icon: "heroicons-outline:book-open", // Syllabus → open book outline
        name: "Syllabus",
        href: "/dashboard/syllabus",
        authorization: [""],
      },
      {
        icon: "heroicons-outline:document-check", // Acceptance Forms → document with check outline
        name: "Acceptance Forms",
        href: "/dashboard/acceptance-forms",
        authorization: [""],
      },
      {
        icon: "heroicons-outline:academic-cap", // Grades → graduation cap outline
        name: "Grades",
        href: "/dashboard/grades",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY", "ADMIN"],
  },
  {
    header: "Account Management",
    links: [
      {
        icon: "heroicons-outline:users", // outline users
        name: "Staff",
        href: "/dashboard/staff",
        authorization: ["ADMIN"],
      },
      {
        icon: "heroicons-outline:academic-cap", // outline graduation cap for Faculty
        name: "Faculty",
        href: "/dashboard/faculty",
        authorization: ["ADMIN"],
      },
      {
        icon: "heroicons-outline:identification", // outline ID for Students
        name: "Students",
        href: "/dashboard/students",
        authorization: ["ADMIN"],
      },
    ],
    allowed: ["ADMIN"],
  },
];

export default dashboardLinks;
