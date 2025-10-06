import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updatedDate: z.optional(z.coerce.date()),
  }),
});

export const collections = {
  blog,
};
