import { User, type IUser } from "./models"
import { signToken } from "./jwt"
import dbConnect from "@/lib/db/connection"
import crypto from "crypto"

export interface SignUpData {
  email: string
  password: string
  full_name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: Partial<IUser>
  token?: string
  message?: string
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      await dbConnect()

      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email })
      if (existingUser) {
        return {
          success: false,
          message: "User with this email already exists",
        }
      }

      // Create verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex")

      // Create user
      const user = new User({
        ...data,
        email_verification_token: emailVerificationToken,
      })

      await user.save()

      // Generate JWT token
      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })

      return {
        success: true,
        user: user.toJSON(),
        token,
        message: "Account created successfully. Please verify your email.",
      }
    } catch (error) {
      console.error("SignUp error:", error)
      return {
        success: false,
        message: "Failed to create account",
      }
    }
  }

  static async signIn(data: SignInData): Promise<AuthResult> {
    try {
      await dbConnect()

      // Find user by email
      const user = await User.findOne({ email: data.email })
      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        }
      }

      // Check if user is blocked
      if (user.is_blocked) {
        return {
          success: false,
          message: "Your account has been blocked. Please contact support.",
        }
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(data.password)
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        }
      }

      // Generate JWT token
      const token = signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })

      return {
        success: true,
        user: user.toJSON(),
        token,
        message: "Signed in successfully",
      }
    } catch (error) {
      console.error("SignIn error:", error)
      return {
        success: false,
        message: "Failed to sign in",
      }
    }
  }

  static async verifyEmail(token: string): Promise<AuthResult> {
    try {
      await dbConnect()

      const user = await User.findOne({ email_verification_token: token })
      if (!user) {
        return {
          success: false,
          message: "Invalid verification token",
        }
      }

      user.email_verified = true
      user.email_verification_token = undefined
      await user.save()

      return {
        success: true,
        message: "Email verified successfully",
      }
    } catch (error) {
      console.error("Email verification error:", error)
      return {
        success: false,
        message: "Failed to verify email",
      }
    }
  }

  static async requestPasswordReset(email: string): Promise<AuthResult> {
    try {
      await dbConnect()

      const user = await User.findOne({ email })
      if (!user) {
        // Don't reveal if email exists
        return {
          success: true,
          message: "If an account with that email exists, a password reset link has been sent.",
        }
      }

      const resetToken = crypto.randomBytes(32).toString("hex")
      const resetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      user.password_reset_token = resetToken
      user.password_reset_expires = resetExpires
      await user.save()

      return {
        success: true,
        message: "Password reset link has been sent to your email.",
      }
    } catch (error) {
      console.error("Password reset request error:", error)
      return {
        success: false,
        message: "Failed to process password reset request",
      }
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      await dbConnect()

      const user = await User.findOne({
        password_reset_token: token,
        password_reset_expires: { $gt: new Date() },
      })

      if (!user) {
        return {
          success: false,
          message: "Invalid or expired reset token",
        }
      }

      user.password = newPassword
      user.password_reset_token = undefined
      user.password_reset_expires = undefined
      await user.save()

      return {
        success: true,
        message: "Password reset successfully",
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return {
        success: false,
        message: "Failed to reset password",
      }
    }
  }
}
