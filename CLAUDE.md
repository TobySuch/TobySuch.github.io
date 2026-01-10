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
