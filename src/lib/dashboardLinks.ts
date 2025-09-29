const dashboardLinks = [
  {
    header: "Main",
    links: [{ name: "Dashboard", href: "/dashboard", authorization: "" }],
    allowed: "",
  },
  {
    header: "Schedule",
    links: [
      {
        name: "Thesis Defense Schedule",
        href: "/dashboard/defense-schedules",
        authorization: "STAFF",
      },
      {
        name: "Defense Schedule",
        href: "/dashboard/schedules",
        authorization: ["FACULTY", "STUDENT"],
      },
      {
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
        name: "Advisees",
        href: "/dashboard/advisees",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY"],
  },
  {
    header: "Documents Management",
    links: [
      {
        name: "Defense Requirements",
        href: "/dashboard/defense-requirements",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY"],
  },
  {
    header: "Account Management",
    links: [
      { name: "Staff", href: "/dashboard/staff", authorization: "ADMIN" },
      { name: "Faculty", href: "/dashboard/faculty", authorization: "ADMIN" },
      { name: "Students", href: "/dashboard/students", authorization: "ADMIN" },
    ],
    allowed: ["ADMIN"],
  },

  {
    header: "Personal Information",
    links: [
      { name: "My Information", href: "/dashboard/myinformation", authorization: "" },
    ],
    allowed: [""],
  }
];

export default dashboardLinks