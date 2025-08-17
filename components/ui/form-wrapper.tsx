"use client"

import type React from "react"

import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Form } from "@/components/ui/form"

interface FormWrapperProps<T extends FieldValues> {
  schema: z.ZodSchema<T>
  defaultValues?: DefaultValues<T>
  onSubmit: (data: T) => void | Promise<void>
  children: (form: UseFormReturn<T>) => React.ReactNode
  className?: string
}

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormWrapperProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children(form)}
      </form>
    </Form>
  )
}
