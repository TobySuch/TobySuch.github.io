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

Arcade pages don't use the main site's `BaseHead.astro` / `Header.astro` / `Footer.astro`, so they're visually and structurally independent of the blog/projects/about design. To add a new game:

1. Create `src/pages/arcade/<slug>.astro` as a standalone Astro page — its own full `<html>`/`<head>` document (see `ultimate-tic-tac-toe.astro` for the template: favicon, canonical, title/description, OG/Twitter tags).
2. Put supporting components/logic under `src/components/arcade/<slug>/`.
3. Import `src/styles/arcade.css` (a one-line `@import "tailwindcss";`) rather than the site's `global.css`, so the game can be styled with Tailwind utility classes independent of the main site's design system.
4. Manually include the Plausible script tag in the page `<head>` (the site-wide copy in `BaseHead.astro` isn't used here): `<script defer data-domain="tobysuch.uk" src="https://plausible.tobysuch.uk/js/script.js"></script>`.
5. Register the game in `src/data/arcadeGames.ts` (slug, title, description, emoji icon) so it appears as a card on `/arcade/`.
6. Add a link back to `/arcade/` somewhere on the page (see the footer pattern in `ultimate-tic-tac-toe.astro`).
