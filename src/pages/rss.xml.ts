import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { z, getCollection } from "astro:content";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog");

  const site = context.site;

  if (!site) {
    throw new Error("`context.site` must be set.");
  }

  return rss({
    title: "Buzz’s Blog",
    description: "A humble Astronaut’s guide to the stars",
    site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      //   description: post.data.description,
      // Compute RSS link from post `id`
      // This example assumes all posts are rendered as `/blog/[id]` routes
      link: `/blog/${post.id}`,
    })),
  });
};
