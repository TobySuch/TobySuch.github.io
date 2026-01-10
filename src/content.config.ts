import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const about = defineCollection({
  // Load Markdown and MDX files in the `src/content/about/` directory.
  loader: glob({ base: "./src/content", pattern: "about.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

const projects = defineCollection({
  // Load Markdown files in the `src/content/projects/` directory.
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Used for ordering only, not displayed
      pubDate: z.coerce.date(),
      heroImage: image().optional(),
    }),
});

export const collections = { about, blog, projects };
