export interface ThemeConfig {
  id: string
  name: string
  description: string
  colors: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

export const themes: ThemeConfig[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and professional theme",
    colors: {
      light: {
        "--primary": "oklch(0.205 0 0)",
        "--primary-foreground": "oklch(0.985 0 0)",
        "--secondary": "oklch(0.97 0 0)",
        "--secondary-foreground": "oklch(0.205 0 0)",
        "--accent": "oklch(0.97 0 0)",
        "--accent-foreground": "oklch(0.205 0 0)",
      },
      dark: {
        "--primary": "oklch(0.985 0 0)",
        "--primary-foreground": "oklch(0.205 0 0)",
        "--secondary": "oklch(0.269 0 0)",
        "--secondary-foreground": "oklch(0.985 0 0)",
        "--accent": "oklch(0.269 0 0)",
        "--accent-foreground": "oklch(0.985 0 0)",
      },
    },
  },
  {
    id: "blue",
    name: "Ocean Blue",
    description: "Professional blue theme",
    colors: {
      light: {
        "--primary": "oklch(0.5 0.2 240)",
        "--primary-foreground": "oklch(0.98 0 0)",
        "--secondary": "oklch(0.95 0.02 240)",
        "--secondary-foreground": "oklch(0.2 0.1 240)",
        "--accent": "oklch(0.92 0.05 240)",
        "--accent-foreground": "oklch(0.25 0.1 240)",
      },
      dark: {
        "--primary": "oklch(0.65 0.2 240)",
        "--primary-foreground": "oklch(0.1 0.05 240)",
        "--secondary": "oklch(0.25 0.05 240)",
        "--secondary-foreground": "oklch(0.9 0.02 240)",
        "--accent": "oklch(0.3 0.08 240)",
        "--accent-foreground": "oklch(0.85 0.03 240)",
      },
    },
  },
  {
    id: "green",
    name: "Forest Green",
    description: "Natural green theme",
    colors: {
      light: {
        "--primary": "oklch(0.45 0.15 140)",
        "--primary-foreground": "oklch(0.98 0 0)",
        "--secondary": "oklch(0.95 0.02 140)",
        "--secondary-foreground": "oklch(0.2 0.1 140)",
        "--accent": "oklch(0.92 0.05 140)",
        "--accent-foreground": "oklch(0.25 0.1 140)",
      },
      dark: {
        "--primary": "oklch(0.6 0.15 140)",
        "--primary-foreground": "oklch(0.1 0.05 140)",
        "--secondary": "oklch(0.25 0.05 140)",
        "--secondary-foreground": "oklch(0.9 0.02 140)",
        "--accent": "oklch(0.3 0.08 140)",
        "--accent-foreground": "oklch(0.85 0.03 140)",
      },
    },
  },
]

export function getTheme(id: string): ThemeConfig | undefined {
  return themes.find((theme) => theme.id === id)
}

export function applyTheme(themeId: string, mode: "light" | "dark") {
  const theme = getTheme(themeId)
  if (!theme) return

  const colors = theme.colors[mode]
  const root = document.documentElement

  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })

  // Store theme preference
  localStorage.setItem("theme-id", themeId)
  localStorage.setItem("theme-mode", mode)
}
