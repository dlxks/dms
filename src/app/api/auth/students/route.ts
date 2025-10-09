import { getUsers } from "@/src/utils/getUsers"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)
  const search = searchParams.get("search") || ""
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortDir = searchParams.get("sortDir") as "asc" || "desc"
  const role = searchParams.get("role") || undefined

  const result = await getUsers({
    page,
    pageSize,
    search,
    filters: role ? { role } : {},
    sortBy,
    sortDir
  })

  return NextResponse.json(result)
}