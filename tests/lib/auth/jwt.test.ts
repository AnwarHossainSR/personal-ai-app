import { describe, it, expect, vi, beforeEach } from "vitest"
import { signToken, verifyToken } from "@/lib/auth/jwt"

describe("JWT Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("signToken", () => {
    it("should create a valid JWT token", () => {
      const payload = {
        userId: "123",
        email: "test@example.com",
        role: "user" as const,
      }

      const token = signToken(payload)
      expect(token).toBeDefined()
      expect(typeof token).toBe("string")
      expect(token.split(".")).toHaveLength(3) // JWT has 3 parts
    })
  })

  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const payload = {
        userId: "123",
        email: "test@example.com",
        role: "user" as const,
      }

      const token = signToken(payload)
      const verified = verifyToken(token)

      expect(verified).toBeDefined()
      expect(verified?.userId).toBe(payload.userId)
      expect(verified?.email).toBe(payload.email)
      expect(verified?.role).toBe(payload.role)
    })

    it("should return null for invalid token", () => {
      const result = verifyToken("invalid-token")
      expect(result).toBeNull()
    })
  })
})
