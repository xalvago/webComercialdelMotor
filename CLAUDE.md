# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**cdm-web is a redesign of [comercialdelmotor.com](https://www.comercialdelmotor.com)** — the old site is the source of truth for content, copy, and structure.

### Repository
- **GitHub Repo:** `webComercialdelMotor`
- **URL:** `https://github.com/xalvago/webComercialdelMotor.git`
- **Deployment:** Vercel

### Company facts (use exact figures in copy)
- Founded 1951, origins in Motor Tarabusi factory
- 130,000+ active references ("referencias vivas")
- 11 warehouses across Península Ibérica + Canary Islands (Lean Logistics)
- 1,200,000+ annual material requests
- Vehicle categories: **Turismo · Industrial · Agrícola · Vehículo Pesado**

### Content source
Images from old site live at `https://www.comercialdelmotor.com/images/`. When adding new content, check that URL pattern first. Static assets for the new site go in `/public/`.

### Pages to replicate
| Old URL | New route | Status |
|---------|-----------|--------|
| `/` | `/` | In progress |
| `/productos/` | `/productos` | In progress |
| `/noticias/` | `/noticias` | In progress |
| `/videos/` | `/videos` | In progress |
| `/delegaciones/` | `/delegaciones` | In progress |
| `/calidad/` | `/calidad` | In progress |
| `/contacto/` | `/contacto` | In progress |

Old site news slugs follow pattern `/noticias/slug.html` — no dynamic routing needed in new site (static data in JSON).

---

## Development Standards

- **Post-Change Verification**: After applying any code changes, it is MANDATORY to verify that the application still starts and runs without server-side errors.
- **Pre-Completion Check**: Before finalizing any coding task, review the development logs to ensure no new runtime or hydration errors were introduced.
- **Server Stability**: Ensure the application builds and starts without legacy or new runtime errors.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server
```

---

## Architecture

**Next.js 14 App Router** — presentation-layer site for Comercial del Motor (motor parts distributor). No backend, no API routes, no database.

### Data

All data lives in `src/lib/data/*.json`:
- `productos.json` — 25+ product lines with `id, nombre, descripcion, tipos, pdf, destacado`
- `noticias.json` — news articles
- `delegaciones.json` — branch offices with lat/lng for map
- `videos.json` — video metadata

Data is imported directly in components (no API layer, no SWR/React Query).

### Routing

File-based via `src/app/`: `/`, `/productos`, `/noticias`, `/videos`, `/calidad`, `/delegaciones`, `/contacto`. No dynamic routes.

### Component Structure

```
src/components/
├── layout/       # Navbar, Footer, ThemeProvider
├── sections/     # Home page section components
├── animations/   # Framer Motion variants (FadeInUp, Stagger, etc.)
└── ui/           # Generic UI atoms
```

Home page (`src/app/page.tsx`) composes 6 sections: HeroVideo → StatsBar → ProductosDestacados → NoticiasRecientes → CtaBanner → DelegacionesPreview.

### Client vs Server

Mark components `"use client"` when they use: hooks, event handlers, Framer Motion, Leaflet, or theme toggle. Layout and metadata generation stay server components.

### Styling

- Tailwind CSS (utility-first) + `globals.css` for custom CSS variables and component utilities
- Dark mode: class-based toggle (`darkMode: "class"` in tailwind.config.ts), persisted to localStorage via `next-themes`
- Brand color: `#EF0029` (red primary)
- Custom fonts: Space Grotesk (headings), Inter (body), JetBrains Mono
- CSS component utilities defined in `globals.css`: `.btn-primary`, `.btn-outline`, `.card-light`, `.section-title`, `.section-label`, `.red-line`

### Animations

Framer Motion. Reusable variants in `src/components/animations/index.tsx`. Use `FadeInUp`, `Stagger` wrappers for entrance animations on sections.

### Maps

Leaflet + React Leaflet in `DelegacionesMap.tsx`. Leaflet requires `"use client"` and its CSS is imported in `globals.css`.

## Path Alias

`@/*` resolves to `src/*` (configured in tsconfig.json).

---

## Design Language

### Mood & Filosofía

**Industrial claridad** — no dark mode por defecto. El site vive en fondos blancos y grises muy claros, con el rojo CDM como acento de alto impacto. El movimiento y las animaciones aportan la sensación de potencia y precisión técnica, no el color oscuro.

Referentes visuales: catálogo técnico de automoción premium (Bosch, Mahle), no warehouse gótico. Claridad, estructura, velocidad.

**Lo que NO hacer:**
- Fondos negros o muy oscuros como base
- Estética dark industrial pesada
- Gradientes morados/azules genéricos de IA
- Tipografías decorativas sin relación con el sector

### Color System

```css
/* Tokens principales — definir en globals.css */
--color-bg:           #FFFFFF;        /* Fondo base */
--color-surface:      #F7F7F5;        /* Cards, paneles, secciones alternas */
--color-surface-2:    #EFEFEC;        /* Bordes, separadores suaves */
--color-primary:      #EF0029;        /* Rojo CDM — CTAs, acentos, líneas decorativas */
--color-primary-dark: #B30825;        /* Hover states, links */
--color-secondary:    #34495E;        /* Azul pizarra — texto secundario, iconos */
--color-text:         #1A1A1A;        /* Texto principal */
--color-text-muted:   #6B7280;        /* Texto secundario, labels */
--color-contrast-bg:  #1C1C1C;        /* SOLO para secciones de alto contraste (stats, CTA) */
--color-line:         rgba(239,0,41,0.12); /* Líneas decorativas sutiles */
```

**Regla de uso:** El rojo `#EF0029` aparece con intención, no como fondo de sección. Úsalo en: bordes activos, líneas bajo títulos (`.red-line`), iconos de acento, botones primarios, separadores. Las secciones oscuras (`--color-contrast-bg`) se reservan para la barra de stats y el CTA banner — máximo 2 secciones por página.

### Tipografía

```
Headlines grandes:  Space Grotesk 700–800, tracking -0.02em
Subheadlines:       Space Grotesk 500–600
Body text:          Inter 400, line-height 1.6
Datos técnicos:     JetBrains Mono 500 — números, referencias, códigos, eyebrow labels
```

**Escala tipográfica hero:**
- Eyebrow (`.section-label`): JetBrains Mono 11px uppercase, `--color-primary`, letter-spacing 0.15em
- H1 hero: 72–96px desktop, Space Grotesk 800
- H2 sección: 40–52px, Space Grotesk 700
- Body: 16–18px Inter

### Animaciones (Framer Motion)

**Principio:** Las animaciones refuerzan la sensación de maquinaria precisa. Entradas limpias, sin rebotes excesivos.

```ts
// Easing estándar — ease out expo
const ease = [0.22, 1, 0.36, 1]

// FadeInUp base
{ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease } }

// Stagger entre hijos
{ staggerChildren: 0.08 }

// Línea roja animada bajo título
{ initial: { scaleX: 0, originX: 0 }, animate: { scaleX: 1 }, transition: { duration: 0.6, delay: 0.3, ease } }

// Counter animado (stats)
// Usar useMotionValue + useTransform o librería react-countup
```

**Hover en cards:**
```ts
whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(239,0,41,0.12)" }}
transition={{ duration: 0.2 }}
```

**Split text en hero headline:**
- Dividir el texto en líneas/palabras con `motion.span`
- Stagger 0.06s entre líneas
- Entrada: `opacity: 0, y: 16` → `opacity: 1, y: 0`

**Scroll triggers:**
- Usar `whileInView` con `viewport={{ once: true, margin: "-80px" }}`
- Todas las secciones tienen entrance animation al entrar en viewport

### Hero Section

```
Layout: fullscreen (100vh mínimo)
Fondo: imagen de taller/motor con overlay blanco semitransparente (rgba(255,255,255,0.65))
       — esto mantiene el mood industrial SIN oscurecer
Eyebrow: "// DESDE 1951" en JetBrains Mono, color primary
Headline: Space Grotesk 800, color #1A1A1A, entrada split-text
Red-line: barra roja 3px bajo headline, animada scaleX 0→1
Subheadline: Inter 18px, color text-muted
CTAs: "Ver catálogo" (btn-primary rojo) + "Nuestras delegaciones" (btn-outline)
Elemento decorativo: líneas de grid técnico SVG, opacity 0.04, color secondary
```

### Stats Bar

```
Fondo: --color-contrast-bg (#1C1C1C) — sección oscura de contraste
Padding: py-16
Layout: grid 4 columnas
Número: JetBrains Mono 700, 52px, color white
Label: Inter 13px uppercase, color rgba(255,255,255,0.5), letter-spacing 0.1em
Separadores: borde derecho rgba(255,255,255,0.1)
Animación: counter animado al entrar en viewport
Stats: 130.000+ Referencias · 11 Almacenes · +1.200.000 Peticiones/año · 1951 Fundación
```

### Product Cards

```
Fondo: --color-surface (#F7F7F5)
Borde: 1px solid --color-surface-2
Border-radius: 0px (consistente con branding — spacing.borderRadius: "0px")
Hover: border-color → rgba(239,0,41,0.4), sombra roja suave, translateY(-4px)
Imagen: aspect-ratio 4/3, object-fit cover, filter grayscale(15%) → grayscale(0) en hover
Tag categoría: JetBrains Mono 10px uppercase, fondo primary, color white
```

### Secciones alternas

Alternar entre `--color-bg` (blanco) y `--color-surface` (#F7F7F5) para crear ritmo visual sin usar colores de acento como fondos de sección.

### Elementos decorativos

- `.red-line`: `height: 3px, background: var(--color-primary), width: 48px` — aparece bajo títulos de sección
- Líneas de velocidad / grid técnico: SVG inline, `stroke: var(--color-secondary)`, opacity 0.04
- Iconos: stroke-based (Lucide), nunca filled genéricos — `color: var(--color-primary)` en iconos destacados
- NO usar partículas aleatorias. Si hay elemento decorativo animado, que tenga forma de engranaje, pistón o línea técnica.

### CTA Banner

```
Fondo: --color-primary (#EF0029)
Texto: blanco
Headline: Space Grotesk 700, 36px
Botón: variante blanco sobre rojo (fondo white, texto primary)
Animación: background con ligero movimiento de gradiente o shimmer sutil
```

### Navbar

```
Fondo: white con border-bottom 1px solid --color-surface-2
Logo: imagen original del branding
Links: Inter 14px 500, color text, hover color primary
CTA nav: "Contactar" como btn-primary compacto
Scroll behavior: sticky, sombra suave aparece al hacer scroll (box-shadow transition)
```
