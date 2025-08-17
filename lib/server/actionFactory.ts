import { getAuthUser } from "@/lib/auth/clerk-helpers";
import { redirect } from "next/navigation";
import { z } from "zod";

export interface ActionContext {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
    is_blocked: boolean;
  };
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  redirect?: string;
}

export interface ActionOptions {
  requireAuth?: boolean;
  requireRole?: "user" | "admin";
  auditLog?: boolean;
}

export function createAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (
    input: TInput,
    context: ActionContext
  ) => Promise<ActionResult<TOutput>>,
  options: ActionOptions = {}
) {
  return async (
    formData: FormData | TInput
  ): Promise<ActionResult<TOutput>> => {
    try {
      // Parse input
      let input: TInput;
      if (formData instanceof FormData) {
        const data = Object.fromEntries(formData.entries());
        input = schema.parse(data);
      } else {
        input = schema.parse(formData);
      }

      const authUser = await getAuthUser();
      const context: ActionContext = {
        user: authUser
          ? {
              id: authUser.userId,
              email: authUser.email,
              role: authUser.role,
              is_blocked: false, // TODO: Check database for actual status
            }
          : undefined,
      };

      // Check auth requirements
      if (options.requireAuth && !context.user) {
        return { success: false, error: "Authentication required" };
      }

      if (context.user?.is_blocked) {
        return { success: false, error: "Account is blocked" };
      }

      if (options.requireRole && context.user?.role !== options.requireRole) {
        return { success: false, error: "Insufficient permissions" };
      }

      // Execute handler
      const result = await handler(input, context);

      // Handle redirect
      if (result.redirect) {
        redirect(result.redirect);
      }

      return result;
    } catch (error) {
      console.error("Action error:", error);

      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        };
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };
}
