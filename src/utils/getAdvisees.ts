import prisma from "@/lib/prisma";

/* -------------------------------------------------
   Types
---------------------------------------------------*/

/**
 * Possible filter values for advisee queries.
 */
export type AdviseeFilterValue =
  | string
  | boolean
  | null
  | { gte?: Date; lte?: Date }
  | Array<string | boolean | null>;

/**
 * Mapping of filter field names to their values.
 */
export type AdviseeFilters = Partial<Record<string, AdviseeFilterValue>>;

/**
 * Parameters for fetching advisees with pagination, filtering, and sorting.
 */
export type GetAdviseesParams = {
  adviserId?: string; // Only fetch advisees belonging to this adviser
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: AdviseeFilters;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

/* -------------------------------------------------
   Main Query: getAdvisees
---------------------------------------------------*/

/**
 * Retrieves advisee records from the database with pagination, filtering,
 * and adviser-based scoping.
 *
 * Strictly enforces adviser-level access: if no adviserId is provided,
 * the function returns an empty result set.
 */
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

  // Enforce adviser-level access
  if (!adviserId) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      pages: 0,
    };
  }

  // Enforce safe pagination boundaries
  const take = Math.max(1, Math.min(100, pageSize));
  const skip = Math.max(0, (Math.max(1, page) - 1) * take);

  // Base query conditions
  const where: any = { adviserId };

  // Optional search by student name or email
  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { student: { firstName: { contains: q, mode: "insensitive" } } },
      { student: { lastName: { contains: q, mode: "insensitive" } } },
      { student: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  // Apply additional filters dynamically
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined) continue;

    if (key === "createdAt" && typeof value === "object" && value !== null) {
      const range: any = {};
      if ("gte" in value && value.gte) range.gte = value.gte;
      if ("lte" in value && value.lte) range.lte = value.lte;
      if (Object.keys(range).length > 0) where.createdAt = range;
      continue;
    }

    if (value === null) where[key] = null;
    else if (Array.isArray(value)) where[key] = { in: value };
    else where[key] = value;
  }

  // Count total advisees for pagination
  const total = await prisma.advisee.count({ where });

  // Fetch paginated records with related adviser and student data
  const items = await prisma.advisee.findMany({
    where,
    orderBy: { [sortBy]: sortDir },
    skip,
    take,
    include: {
      adviser: true,
      student: true,
    },
  });

  return {
    items,
    total,
    page,
    pageSize: take,
    pages: Math.ceil(total / take) || 1,
  };
}
