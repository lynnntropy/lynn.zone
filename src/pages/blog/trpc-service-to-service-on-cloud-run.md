---
title: Service-to-Service Communication on Google Cloud Run with tRPC
date: 2022-08-04

layout: ../../layouts/BlogPostLayout.astro
---

[tRPC](https://trpc.io/) is a TypeScript library that’s usually used to enable boilerplate-free and typesafe API calls between backend and frontend code in the same app, but it works great for service-to-service communication, too.

I recently needed to implement service-to-service communication with tRPC (while building [Konbini](https://usekonbini.com/)!) on [Google Cloud Run](https://cloud.google.com/run), which makes this just a touch harder to do than usual, because unless you configure the service you’re calling to allow unauthenticated requests from anyone on the internet (which, if it’s an internal service, you probably don’t want to do), requests to it need to include authentication headers for a service account that’s allowed to make calls to that service.

(You may be used to solving this problem by just putting your services on a private network that isn’t reachable from the internet, but Cloud Run doesn’t let you do that.)

Thankfully, tRPC lets us set those headers, and the [Google Auth Library](https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest) helps us generate them. (Note that this library only supports Node.js, so if you’re running a different JS runtime on Cloud Run, you’ll need to [fetch a token from the metadata server](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances#applications) yourself.)

Anyway, here’s the gist of what I ended up doing:

```ts
import type { AppRouter } from "../../../other-service/src/trpc";

import { createTRPCClient } from "@trpc/client";
import { auth as googleAuth } from "google-auth-library";

export const client = createTRPCClient<AppRouter>({
  url: `${process.env.OTHER_SERVICE_URL}/trpc`,
  headers: async () => {
    if (process.env.NODE_ENV === `production`) {
      const tokenClient = await googleAuth.getIdTokenClient(
        process.env.OTHER_SERVICE_URL
      );

      return await tokenClient.getRequestHeaders();
    }

    return {};
  },
});
```

This is very similar to the code you'd normally write to [create a tRPC client](https://trpc.io/docs/vanilla), but with a bit of additional code to set the headers we need on each request.

If this seems suspiciously simple, it’s because the Google Auth Library automatically pulls the credentials it needs from the Cloud Run environment, so you don’t need to configure anything -- it just gives you the headers.

Note that your requests will still fail if the service account assigned to the client service isn’t allowed to call the other service. All Cloud Run services use the default Compute Engine service account by default, though, so it should work out of the box.

Feel free to reach out if you run into problems with this approach, or if you just have other thoughts about it!
