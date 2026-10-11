# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start dev server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally

## Architecture

This is an Astro static site with three content collections: blog, projects, and about.

### Content Collections

Defined in `src/content.config.ts` with Zod schema validation:

- **blog** (`src/content/blog/`) - Blog posts in Markdown/MDX with frontmatter: title, description, pubDate, updatedDate (optional), heroImage (optional)
- **projects** (`src/content/projects/`) - Project pages in Markdown only (no MDX), same frontmatter schema as blog
- **about** (`src/content/about.md`) - Single about page content

### Routing

File-based routing in `src/pages/`:
- Dynamic routes use `[...slug].astro` pattern with `getStaticPaths()` to generate pages from collections
- Each collection has a listing page (`index.astro`) and individual page route

### Layouts

- `BlogPost.astro` - Used by blog posts
- `ProjectPost.astro` - Used by project pages
- `AboutPage.astro` - Used by about page

### Global Configuration

- `src/consts.ts` - Site title and description constants
- `astro.config.mjs` - Site URL (tobysuch.uk), MDX and sitemap integrations

### Assets

- Images stored in `src/assets/` organized by content type (e.g., `src/assets/blog/[post-name]/`)
- Hero images referenced via relative paths in frontmatter

### Arcade / Games

`/arcade/` is a small, intentionally hidden section of games. It is never linked from `Header.astro` or any other main-site page — discoverable only via `/arcade/` or a direct URL to a game. It's still crawlable (no sitemap exclusion), consistent with the rest of the site.

Arcade pages don't use the main site's `BaseHead.astro` / `Header.astro` / `Footer.astro`, so they're visually and structurally independent of the blog/projects/about design. Game pages instead share `src/layouts/ArcadeGameLayout.astro`, which provides the full `<html>`/`<head>` document (favicon, canonical, title/description, OG/Twitter tags, the Plausible script — the site-wide copy in `BaseHead.astro` isn't used here) and the fixed "← Arcade" footer. To add a new game:

1. Create `src/pages/arcade/<slug>.astro` that wraps the game's React `App` in `<ArcadeGameLayout title="…" description="…">` (see `chess.astro`).
2. Put supporting components/logic under `src/components/arcade/<slug>/`.
3. Import the game's `game.css` (a one-line `@import "tailwindcss";`) in the page rather than the site's `global.css`, so the game can be styled with Tailwind utility classes independent of the main site's design system.
4. Register the game in `src/data/arcadeGames.ts` (slug, title, description, emoji icon) so it appears as a card on `/arcade/`.

#### Chess engine feature flag

Chess's "vs Computer" mode talks to a separate engine API and is gated by `PUBLIC_CHESS_ENGINE_URL` (see `src/components/arcade/chess/engine/`). Set it in a local `.env` (gitignored) to enable the mode; CI doesn't set it, so production shows "coming soon" and the engine client is tree-shaken out of the bundle. The API contract assumed by the client lives entirely in `engineClient.ts`.

## Conventions

- Every clickable `<button>` (and any other clickable non-link element) must have a pointer cursor — `cursor-pointer` in Tailwind, or `cursor: pointer` in plain CSS. Tailwind v4's preflight no longer sets it on buttons, so it's easy to miss on text-style buttons like "← Menu". Pair it with `disabled:cursor-not-allowed` on buttons that can be disabled.
