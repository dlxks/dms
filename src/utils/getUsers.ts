// src/lib/getUsers.ts
import prisma from "@/lib/prisma";

export type UserFilterValue =
  | string
  | boolean
  | null
  | { gte?: Date; lte?: Date }
  | Array<string | boolean | null>;

export type UserFilters = Partial<Record<string, UserFilterValue>>;

export type GetUsersParams = {
  page?: number; // 1-indexed
  pageSize?: number;
  search?: string; // search name, email, id
  filters?: UserFilters;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export async function getUsers(params: GetUsersParams) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    filters = {},
    sortBy = "createdAt",
    sortDir = "desc",
  } = params;

  const take = Math.max(1, Math.min(100, pageSize));
  const skip = Math.max(0, (Math.max(1, page) - 1) * take);

  const where: any = {};

  // search by id, name, email
  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { studentId: { contains: q, mode: "insensitive" } },
      { staffId: { contains: q, mode: "insensitive" } },
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  // filters
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

  const total = await prisma.user.count({ where });

  const items = await prisma.user.findMany({
    where,
    orderBy: { [sortBy]: sortDir },
    skip,
    take,
    include: {
      accounts: true,
      sessions: true,
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
