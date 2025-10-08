// See https://github.com/delucis/astro-blog-full-text-rss/blob/62608d3eb5d5de7b55d271d41b1fe93b72574540/src/pages/rss.xml.ts

import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

export const GET: APIRoute = async (context) => {
  let baseUrl = context.site?.href;

  if (!baseUrl) {
    throw new Error("`site` must be set in the Astro config.`");
  }

  if (baseUrl.at(-1) === "/") baseUrl = baseUrl.slice(0, -1);

  // See https://docs.astro.build/en/reference/container-reference/
  const container = await AstroContainer.create();

  const posts = (await getCollection("blog")).sort((a, b) =>
    a.data.date > b.data.date ? -1 : 1
  );

  const feedItems: RSSFeedItem[] = [];

  for (const post of posts) {
    const { Content } = await render(post);
    const rawContent = await container.renderToString(Content);

    // Process and sanitize the raw content:
    // - Removes `<!DOCTYPE html>` preamble
    // - Makes link `href` and image `src` attributes absolute instead of relative
    // - Strips any `<script>` and `<style>` tags
    const content = await transform(
      rawContent.replace(/^<!DOCTYPE html>/, ""),
      [
        async (node) => {
          await walk(node, (node) => {
            if (node.name === "a" && node.attributes.href?.startsWith("/")) {
              node.attributes.href = baseUrl + node.attributes.href;
            }
            if (node.name === "img" && node.attributes.src?.startsWith("/")) {
              node.attributes.src = baseUrl + node.attributes.src;
            }
          });

          return node;
        },
        sanitize({ dropElements: ["script", "style"] }),
      ]
    );

    feedItems.push({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      content,
    });
  }

  return rss({
    title: "lynn.zone (blog)",
    description: "Lynn's blog.",
    site: baseUrl,
    items: feedItems,
    trailingSlash: false,
  });
};
