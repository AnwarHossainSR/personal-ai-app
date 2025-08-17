import { createAction } from "@/lib/server/actionFactory"
import { AuthService } from "./service"
import { setAuthCookie, clearAuthCookie } from "./jwt"
import { signUpSchema, signInSchema, passwordResetRequestSchema, passwordResetSchema } from "./validators"
import z from "zod" // Import zod for z.object

export const signUpAction = createAction(signUpSchema, async (input) => {
  const result = await AuthService.signUp({
    email: input.email,
    password: input.password,
    full_name: input.full_name,
  })

  if (result.success && result.token) {
    setAuthCookie(result.token)
    return {
      success: true,
      data: result.user,
      redirect: "/dashboard",
    }
  }

  return {
    success: false,
    error: result.message || "Failed to create account",
  }
})

export const signInAction = createAction(signInSchema, async (input) => {
  const result = await AuthService.signIn(input)

  if (result.success && result.token) {
    setAuthCookie(result.token)
    return {
      success: true,
      data: result.user,
      redirect: "/dashboard",
    }
  }

  return {
    success: false,
    error: result.message || "Failed to sign in",
  }
})

export const signOutAction = createAction(
  z.object({}), // Use z.object from zod
  async () => {
    clearAuthCookie()
    return {
      success: true,
      redirect: "/sign-in",
    }
  },
)

export const requestPasswordResetAction = createAction(passwordResetRequestSchema, async (input) => {
  const result = await AuthService.requestPasswordReset(input.email)
  return {
    success: result.success,
    error: result.success ? undefined : result.message,
  }
})

export const resetPasswordAction = createAction(passwordResetSchema, async (input) => {
  const result = await AuthService.resetPassword(input.token, input.password)

  if (result.success) {
    return {
      success: true,
      redirect: "/sign-in",
    }
  }

  return {
    success: false,
    error: result.message,
  }
})
