import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAuthUser } from "@/lib/auth/clerk-helpers"

export interface RouteContext {
  user?: {
    id: string
    email: string
    role: "user" | "admin"
    is_blocked: boolean
  }
  params?: Record<string, string>
}

export interface RouteOptions {
  requireAuth?: boolean
  requireRole?: "user" | "admin"
  rateLimit?: number
}

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function createRouteHandler<TInput = any, TOutput = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  handler: (input: TInput, context: RouteContext) => Promise<TOutput>,
  options: RouteOptions & {
    inputSchema?: z.ZodSchema<TInput>
    outputSchema?: z.ZodSchema<TOutput>
  } = {},
) {
  return async (request: NextRequest, { params }: { params?: Record<string, string> } = {}) => {
    try {
      const authUser = await getAuthUser()
      const context: RouteContext = {
        user: authUser
          ? {
              id: authUser.userId,
              email: authUser.email,
              role: authUser.role,
              is_blocked: false, // TODO: Check database for actual status
            }
          : undefined,
        params,
      }

      // Check auth requirements
      if (options.requireAuth && !context.user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      if (context.user?.is_blocked) {
        return NextResponse.json({ error: "Account is blocked" }, { status: 403 })
      }

      if (options.requireRole && context.user?.role !== options.requireRole) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      // Parse input
      let input: TInput
      if (method === "GET") {
        const url = new URL(request.url)
        const searchParams = Object.fromEntries(url.searchParams.entries())
        input = options.inputSchema ? options.inputSchema.parse(searchParams) : (searchParams as TInput)
      } else {
        const body = await request.json()
        input = options.inputSchema ? options.inputSchema.parse(body) : body
      }

      // Execute handler
      const result = await handler(input, context)

      // Validate output if schema provided
      const output = options.outputSchema ? options.outputSchema.parse(result) : result

      return NextResponse.json(output)
    } catch (error) {
      console.error("Route error:", error)

      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Internal server error" },
        { status: 500 },
      )
    }
  }
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: Math.max(1, Number.parseInt(searchParams.get("page") || "1")),
    limit: Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10"))),
    sort: searchParams.get("sort") || undefined,
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
  }
}

export function createPaginatedResponse<T>(data: T[], total: number, params: PaginationParams): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / params.limit)

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  }
}
