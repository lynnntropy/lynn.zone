---
title: Simple, Privacy-Friendly, and Free Analytics Using Serverless Functions
date: 2021-04-15
---

Whether it's for work or play, most of us usually want _some_ analytics on our websites, but the available options typically come with one or more pretty major downsides:

**Massive JavaScript payload** -- Most of the big analytics products have this problem. `gtag.js` is ~35kB minzipped, ~90kB uncompressed (at time of writing); some others are even worse. Yes, these days this is loaded asynchronously and doesn't directly hold up your page while it gets loaded and parsed, but that's still an absolutely indefensible amount of overhead just to get some super basic data on how your site is being used.

**Privacy implications** -- Again, this is one you're almost certainly going to hit if you're looking at a free, hosted analytics product, like Google Analytics or Yandex.Metrica. Third-party cookies may thankfully be going the way of the dodo, but tools like Google Analytics -- if you use the tracking code they give you -- will still insist on giving your users at least first-party cookies they can use to identify them across multiple requests (and visits), regardless of whether you want that feature or not.

From a practical perspective, this means you now need to ask your users to consent to these tracking cookies, and from an ethical perspective, you may just want to avoid tracking your users like this altogether, especially if it means doing it through someone like Google.

**Inaccuracy due to people blocking analytics** -- Whether it's through privacy-enhancing browser features, browser extensions like [uBlock Origin](https://github.com/gorhill/uBlock) or even something like [Pi-hole](https://github.com/pi-hole/pi-hole), lots of people these days are running something that blocks obvious analytics requests. Depending on how privacy-conscious your audience is, as many as [~45%](https://blog.wesleyac.com/posts/google-analytics) of your visitors could be blocking analytics entirely.

Serverside analytics naturally don't suffer from this problem, and some privacy-focused analytics products like [Fathom Analytics](https://usefathom.com/support/custom-domains) and [Plausible Analytics](https://plausible.io/docs/custom-domain) give you ways to use your own domain for analytics to avoid being caught by this, but if you're using a typical big-name analytics product (unless you're being particularly clever about it, which we'll get to), this is a huge drawback you're kind of just stuck with.

**Cost** -- If you're looking to add analytics to something like a personal site, this is probably your biggest problem. Modern, privacy-focused analytics products like [Fathom Analytics](https://usefathom.com/), [Plausible Analytics](https://plausible.io/) and [Netlify Analytics](https://www.netlify.com/products/analytics/) give you ways to avoid many or even all of the other problems on this list, but they're not free -- and there's nothing wrong with that, but I can't justify paying a monthly subscription just to see how many people read my blog posts, and you probably can't either.

One way to get around this could be self-hosting an open-source analytics product like [Matomo Analytics](https://matomo.org/), but unless you already have somewhere you can put that without incurring any extra costs, that costs money, too.

That being said, if you're looking for an analytics solution for your business or something else that actually makes money, I think you should strongly consider just paying for one of these products and being done with it.

## Enter Serverless

Okay, so what can we do about this? Well, we can be smart about the way we use analytics, and take control of how our analytics are collected while still leaving the bulk of the work to a third-party analytics product (if we want to).

How do we do that? With a serverless function.

More specifically, here's what this approach entails:

- Write a serverless function that takes an analytics event -- whatever that means to you -- and pipes it wherever you want. This gives you complete control over what and how much data you send, what you do with it before sending it to a third party, and where it ends up.

  The most immediately useful thing you could do here is pipe the event to a traditional analytics product like Google Analytics (giving you the benefits of a proper analytics product without many of the downsides we talked about), and I imagine this is what most people will want to do, but the place you store your events can be literally anything -- a log file, a database you can later build your own analytics tools on top of, hell, it could even be a spreadsheet.

  You could also do stuff like pipe events to your own database while still sending them to Google Analytics, so you still own all of your data if you ever want to do something with it that Google Analytics doesn't let you do.

- Write a tiny bit of clientside code (which, again, you now have complete control over) to send events to your analytics function.

If we go over those downsides we mentioned at the start of this post again, we can see that this approach allows us to pretty much completely sidestep them:

- **Massive JavaScript payload** -- There is none, our clientside code can be as simple as a single `fetch()` call.
- **Privacy implications** -- More-or-less none, we don't have to track anything we don't want to. Google will still have your data if that's where you choose to pipe it, but there's not a lot they can do with it if it's all anonymized and not tied to a specific user in any way (though you can still do that if you want to, of course).
- **Inaccuracy due to people blocking analytics** -- Our analytics requests won't be blocked because they're not tied to a known analytics product. As long as we don't do something like use the word `analytics` in the name of our endpoint, they'll just look like any other request.
- **Cost** -- On the analytics side this allows us to use free products like Google Analytics without many of the downsides they usually come with, and as for our serverless function, chances are you won't ever have to pay a dime to run it with how generous pretty much every platform's free tier is. For instance, AWS Lambda gives you [one million free requests](https://aws.amazon.com/lambda/pricing/) every month (at time of writing).

## What This Looks Like in Practice

I have to stress that this post is much more about the general concept than it is about a specific implementation -- you don't _have_ to do anything here the same way I did it. That being said, I'm including an example of how I implemented this pattern for my own website ([veselin.dev](https://veselin.dev)) because I think it'll be helpful, and because I think my usecase is common enough that many people should be able to take what I did here and carry it over to their own website(s) with few or no changes.

Here's my analytics function. It's a Netlify Functions function that mostly just proxies events to Google Analytics using the [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1) (note: I'm using Universal Analytics here because the Measurement Protocol for GA4 is [still in alpha](https://developers.google.com/analytics/devguides/collection/protocol/ga4)). It anonymizes IP addresses before sending them to Google (though it also enables Google Analytics' [IP anonymization](https://support.google.com/analytics/answer/2763052?hl=en) feature that does the same thing, because why not), and sidesteps Google's requirement of a user identifier (a `cid` or `uid`) by just generating a new one for every event.

```typescript
import { Handler, APIGatewayEvent } from "aws-lambda";
import axios from "axios";
import { URLSearchParams } from "url";
import * as uuid from "uuid";
import anonymizeIP from "ip-anonymize";

interface RequestBody {
  type: "pageview" | "event";
  params: any;
}

interface Response {
  statusCode: number;
}

const handler: Handler<APIGatewayEvent, Response> = async (event) => {
  const body: RequestBody = JSON.parse(event.body);

  const analyticsRequestBody = new URLSearchParams();
  analyticsRequestBody.append("v", "1");

  // enable IP anonymization, even though we're doing it here anyway
  analyticsRequestBody.append("aip", "1");

  // GA makes us send a cid parameter, so we send a new UUID every time
  // because we don't actually want to track users across requests
  analyticsRequestBody.append("cid", uuid.v4());

  // Override user agent
  analyticsRequestBody.append("ua", event.headers["user-agent"]);

  // Override user IP (but anonymize it first)
  analyticsRequestBody.append("uip", anonymizeIP(event.headers["client-ip"]));

  // Set event data

  analyticsRequestBody.append("tid", process.env.GOOGLE_ANALYTICS_TRACKING_ID);
  analyticsRequestBody.append("t", body.type);

  for (const paramName in body.params) {
    analyticsRequestBody.append(paramName, body.params[paramName]);
  }

  // Send event to Google Analytics

  await axios.post(
    "https://www.google-analytics.com/collect",
    analyticsRequestBody.toString()
  );

  return { statusCode: 200 };
};

export { handler };
```

For the time being I'm happy with this solution, but you could expand on this by implementing something like Plausible's daily identifier method (described [here](https://plausible.io/data-policy#how-we-count-unique-users-without-cookies)) to anonymously identify unique users, and sending that to Google as your `uid`. (**Update:** I've since published [anonymous-user-id](https://github.com/omegavesko/anonymous-user-id), an npm package that helps you do this!)

My clientside code is basically a single `fetch()` call that sends the same data Google Analytics usually sends for a `pageview` event. You'll want to put this code somewhere it'll be called both on the initial pageload and whenever the user navigates to a different page -- in my case, that's Gatsby's [onRouteUpdate](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#onRouteUpdate) hook.

```javascript
if (process.env.NODE_ENV !== `production`) {
  return null;
}

const sendPageView = () => {
  const pagePath = location
    ? location.pathname + location.search + location.hash
    : undefined;

  fetch("/.netlify/functions/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "pageview",
      params: {
        dh: window.location.hostname,
        dp: pagePath,
        dt: document.title,
        dr: document.referrer,
      },
    }),
  });
};

// wrap inside a rAF to make sure react-helmet is done with its changes
// (https://github.com/gatsbyjs/gatsby/issues/11592)

if (`requestAnimationFrame` in window) {
  requestAnimationFrame(() => {
    requestAnimationFrame(sendPageView);
  });
} else {
  // simulate 2 rAF calls
  setTimeout(sendPageView, 32);
}
```

I'm not sending any custom events on my site right now, but those would be handled similarly. If you use analytics heavily on your site, you'll probably want to extract this code into a utility function rather than duplicating it every time you want to send an event.

## Why Serverless?

You wouldn't be wrong to notice that everything we're doing here could be implemented just fine in a traditional backend architecture. So, why am I focusing on serverless specifically? Well, there's a few reasons:

- More and more sites (like the one I talk about in my example!) are being built on [Jamstack](https://jamstack.org/) or serverless architectures without a traditional backend. Using a serverless function for this works equally well regardless of what your existing stack is.
- Even if you have an existing backend you could integrate this functionality into, using a serverless function has the benefit of ensuring that you don't have to worry about the performance impact of handling all these extra requests that would typically be handled directly by a third-party service.
- While this isn't a usecase I talk about a lot in this post, a serverless function not tied to an existing backend is easier to use to collect events from a bunch of different places at once.
- Circling back to the Jamstack point again, serverless functions are inherently infinitely scalable. If you have a site deployed to something like a CDN -- where your site will never get hugged to death -- the last thing you want to have to worry about is whether your analytics can keep up with your traffic.

That being said, of course you could apply all of these ideas to a traditional backend, too. I just focus on serverless as a solution in this post because I think it's a great fit for this usecase.

## The Ethics of Circumventing Blockers

To address a bit of an elephant in the room, yes, a significant part of why this pattern is useful is that it allows you to do analytics for users running browser extensions or other tools that would typically block them.

My opinion on this overlaps significantly with [Fathom's answer to this question](https://usefathom.com/blog/bypass-adblockers) in their post announcing their custom domain feature (which is explicitly designed to do this) -- I don't believe this is unethical because the reason people block analytics is that they're traditionally extremely invasive, and if you're doing what I've described here, you're doing everything possible to protect your users' privacy.

Or, to put it a different way -- you're not collecting any more data than serverside analytics would be, and nobody thinks serverside analytics are unethical because they can't be blocked by a browser extension, right?

That being said, it's possible to use the techniques I've talked about here in an unethical way, for example by proxying requests to Google Analytics through your own domain, but not doing anything to mitigate the privacy concerns of using Google Analytics. All I can do there is ask that you please don't do that.

## Conclusion

That's pretty much it! I'm very curious to see how many other people have stumbled their way into similar solutions before (I know I've seen stuff like people `proxy_pass`ing requests to Google Analytics with nginx to make them less obvious), and I'm also curious to see if anyone comes up with more creative ways of building on top of this concept than just piping events to Google Analytics.
