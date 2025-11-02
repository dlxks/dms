// src/src/utils/getAdvisees.ts
import prisma from "@/lib/prisma";

/* -------------------------------------------------
   Types
---------------------------------------------------*/

export type AdviseeFilterValue =
  | string
  | boolean
  | null
  | { gte?: Date; lte?: Date }
  | Array<string | boolean | null>;

export type AdviseeFilters = Partial<Record<string, AdviseeFilterValue>>;

export type GetAdviseesParams = {
  adviserId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: AdviseeFilters;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

/* -------------------------------------------------
   getAdvisees: paginated, filtered, scoped to adviser
---------------------------------------------------*/
export async function getAdvisees(params: GetAdviseesParams) {
  const {
    adviserId,
    page = 1,
    pageSize = 10,
    search = "",
    filters = {},
    sortBy = "createdAt",
    sortDir = "desc",
  } = params;

  // Enforce adviser-level access: if no adviserId, return empty result
  if (!adviserId) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      pages: 0,
    };
  }

  const take = Math.max(1, Math.min(100, pageSize));
  const skip = Math.max(0, (Math.max(1, page) - 1) * take);

  // Base where
  const where: any = { adviserId };

  // Search across student name/email
  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { student: { firstName: { contains: q, mode: "insensitive" } } },
      { student: { lastName: { contains: q, mode: "insensitive" } } },
      { student: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  // Apply filters (simple dynamic mapping)
  for (const [key, value] of Object.entries(filters || {})) {
    if (value === undefined) continue;
    if (key === "createdAt" && typeof value === "object" && value !== null) {
      const range: any = {};
      if ("gte" in value && value.gte) range.gte = value.gte;
      if ("lte" in value && value.lte) range.lte = value.lte;
      if (Object.keys(range).length) where.createdAt = range;
      continue;
    }
    if (value === null) where[key] = null;
    else if (Array.isArray(value)) where[key] = { in: value };
    else where[key] = value;
  }

  const total = await prisma.advisee.count({ where });

  const items = await prisma.advisee.findMany({
    where,
    orderBy: { [sortBy]: sortDir },
    skip,
    take,
    include: {
      adviser: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      student: {
        select: { id: true, studentId: true, firstName: true, lastName: true, email: true, phoneNumber: true },
      },
      // Because your schema has members: User[] via relation "AdviseeMembers"
      members: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  return {
    items,
    total,
    page,
    pageSize: take,
    pages: Math.max(1, Math.ceil(total / take) || 1),
  };
}
