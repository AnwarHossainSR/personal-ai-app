"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { applyTheme } from "@/lib/theme/themes"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  themeId: string
  setTheme: (theme: Theme) => void
  setThemeId: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultThemeId = "default",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultThemeId?: string
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [themeId, setThemeId] = useState<string>(defaultThemeId)

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme-mode") as Theme
    const savedThemeId = localStorage.getItem("theme-id")

    if (savedTheme) setTheme(savedTheme)
    if (savedThemeId) setThemeId(savedThemeId)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let effectiveTheme: "light" | "dark"

    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      effectiveTheme = theme
    }

    root.classList.add(effectiveTheme)
    applyTheme(themeId, effectiveTheme)
  }, [theme, themeId])

  const value = {
    theme,
    themeId,
    setTheme: (theme: Theme) => {
      setTheme(theme)
      localStorage.setItem("theme-mode", theme)
    },
    setThemeId: (themeId: string) => {
      setThemeId(themeId)
      localStorage.setItem("theme-id", themeId)
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
