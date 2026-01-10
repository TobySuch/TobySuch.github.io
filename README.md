# Toby Such - Personal Website

A personal website built with [Astro](https://astro.build), featuring a blog, projects showcase, and about page.

## Site Structure

- **Blog** (`/blog`) - Blog posts written in Markdown/MDX
- **Projects** (`/projects`) - Project showcase pages in Markdown
- **About** (`/about`) - About page

### Content Collections

Content is managed through Astro's content collections in `src/content/`:

- `src/content/blog/` - Blog posts with frontmatter for title, description, pubDate, and optional heroImage
- `src/content/projects/` - Project pages with the same frontmatter schema
- `src/content/about.md` - About page content

### Layouts

- `src/layouts/BlogPost.astro` - Layout for individual blog posts
- `src/layouts/ProjectPost.astro` - Layout for individual project pages
- `src/layouts/AboutPage.astro` - Layout for the about page

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## CI/CD

The site is automatically deployed to GitHub Pages using GitHub Actions.

### Deployment Workflow

Located in `.github/workflows/deploy.yml`:

- **Trigger**: Pushes to the `main` branch, or manual trigger via Actions tab
- **Build**: Uses the official `withastro/action@v3` to build the site
- **Deploy**: Deploys to GitHub Pages using `actions/deploy-pages@v4`

Pushing to `main` will automatically build and deploy the site.
