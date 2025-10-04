Color & Theming Guardrails (STRICT)

You MUST use only the colors, radii, shadows, and fonts defined below.
Do not introduce any new colors, hex codes, HSL/HSB values, or library theme tokens outside of these. When a color is needed, reference the exact CSS custom property or its @theme alias.

Available tokens

Light (:root) and Dark (.dark) modes are defined. Use the appropriate variable for the current mode.

Base

--background, --foreground

--card, --card-foreground

--popover, --popover-foreground

Brand & accents

--primary, --primary-foreground

--secondary, --secondary-foreground

--accent, --accent-foreground

--destructive, --destructive-foreground

UI

--border, --input, --ring

Charts: --chart-1 … --chart-5

Sidebar: --sidebar, --sidebar-foreground,
--sidebar-primary, --sidebar-primary-foreground,
--sidebar-accent, --sidebar-accent-foreground,
--sidebar-border, --sidebar-ring

Typography & radius

Fonts: --font-sans, --font-serif, --font-mono

Radius: --radius (plus derived --radius-sm/md/lg/xl)

Shadows

--shadow-2xs, --shadow-xs, --shadow-sm, --shadow,
--shadow-md, --shadow-lg, --shadow-xl, --shadow-2xl

@theme inline exposes the same tokens as Tailwind-style color/semantic aliases (e.g., --color-primary) — you may use either the raw CSS variables or the @theme aliases, but nothing else.

Hard rules

Only these tokens — never raw color literals (no new #hex, rgb(), hsl()), and never library defaults.

Mode awareness — respect light/dark values; don’t swap semantics between modes.

States — borders/inputs use --border/--input; focus rings use --ring.

Charts — series colors must be --chart-1 … --chart-5 in order.

Gradients — allowed only by blending existing tokens (e.g., --primary → --chart-2). No new stops.

Opacity — if a tint/shade is required, apply opacity to an existing token (e.g., color: var(--foreground); opacity: .7). Do not create new colors.

Text contrast — pair each surface token with its *-foreground counterpart.

Shadows & radius — use only the provided shadow and radius tokens.

Icons/graphics — map fills/strokes to tokens; no arbitrary colors.

Exports — if a library demands hex, convert the existing token’s rgb to hex but keep the mapping and show the source token in comments.

Acceptance checklist (the agent must self-verify)

 No color literals outside the provided tokens.

 Light/dark variants wired correctly.

 Borders/inputs/rings use the correct tokens.

 Charts use --chart-* only.

 Gradients/opacity derive strictly from allowed tokens.

 Shadows/radii/fonts use only provided tokens.

 Comments or docs include the token name next to any computed hex handed to third-party APIs.

Example references (non-exhaustive)

Button (primary): background var(--primary), text var(--primary-foreground), ring var(--ring).

Card: bg var(--card), text var(--card-foreground), border var(--border), shadow var(--shadow-sm).

Sidebar: surface var(--sidebar), text var(--sidebar-foreground), active item bg var(--sidebar-primary), text var(--sidebar-primary-foreground).

If a requirement would violate these guardrails, state the constraint and propose a compliant alternative using the closest token(s).