# Important Design Files

## Core Design Files
- **Theme Settings:** `theme.json` (Main color scheme and app style)
- **Global CSS:** `client/src/index.css` (Global styles, animations, fonts)
- **App Layout:** `client/src/App.tsx` (Main app structure)

## Components
- **UI Components:** `client/src/components/ui/` (Buttons, cards, inputs, etc.)
- **Layout Components:** `client/src/components/layout/` (Header, sidebar, footer)
- **Website Components:** `client/src/components/website/` (Landing page elements)

## Pages
- **Main Pages:** `client/src/pages/` (All application pages)
- **Auth Pages:** `client/src/pages/auth/` (Login, signup screens)

## Color Reference
- Primary: Adjust in `theme.json`
- Background, text, and accent colors: Adjust in CSS files

## How To Customize
1. For quick theme changes: Edit `theme.json`
2. For specific component styling: Find the component in the directories above
3. For custom CSS: Add your styles to `client/src/index.css`

## Theme Options
- **variant:** "professional" | "vibrant" | "tint"
- **primary:** any color value (hex, RGB, OKLCH)
- **appearance:** "light" | "dark" | "system"
- **radius:** 0-1 (corner roundness, 0=square, 1=very rounded)