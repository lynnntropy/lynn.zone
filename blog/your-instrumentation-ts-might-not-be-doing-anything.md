---
title: You Might Have Misplaced Your `instrumentation.ts`
date: 2025-12-27
---

If you have an `instrumentation.(ts|js)` in your Next.js app(s), you might want to double-check that it's actually being used.

**tl;dr:** In Next.js, your `instrumentation.(ts|js)` **has** to be in the same directory as your `app`/`pages` directories. From [the docs](https://nextjs.org/docs/app/guides/instrumentation#convention):

> The `instrumentation` file should be in the root of your project and not inside the `app` or `pages` directory. If you're using the `src` folder, then place the file inside `src` alongside `pages` and `app`.

Now, you might be wondering why I'm writing this if the docs already tell you about this, but this is easy to get wrong for multiple reasons:

- The way the docs communicate this is confusing.
- Next.js doesn't warn you if your `instrumentation.(ts|js)` isn't in the right place.
- At the time of writing, there seems to be a bug in `next dev` that makes it less strict about where you can put the `instrumentation.(ts|js)` than `next build`, so it may work as expected when you test it locally, but not get included in a production build.

That last bullet was the reason I had to figure this out the hard way. Hopefully, this post will save at least a few people the same headache.
