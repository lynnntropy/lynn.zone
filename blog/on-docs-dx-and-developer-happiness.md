---
title: On Docs, DX, and Developer Happiness
date: 2019-09-01
---

One thing I've increasingly taken notice of recently is that a lot of developers, especially in corporate environments, seem to tend to put a very low priority on the DX of their projects. Documentation is poor or non-existent; setting up a working development environment is like pulling teeth. You've got tickets to close and you're sure they'll figure it out, so who cares, right?

To be clear -- I totally understand why this happens, and I'm not here to judge anyone who might've recognized some of their own projects in that description. I do, however, strongly believe that you _should_ care, and I'm here to tell you why.

## A Little Work Now = A Lot Less Work Later

Think about how many times in your life you're going to find yourself setting up a local dev environment for a given project. At the very least, you're probably going to do it every time you get a new dev machine and `git clone` all the stuff you're working on, right? You're also going to do it every time you help someone do the same, e.g. a new person on your team.

If your project is a pain to set up, that quickly adds up to a _lot_ of unnecessary frustration and wasted time. Doing this by hand is also bound to breed subtle inconsistencies in each environment, potentially leading to bugs.

On top of that, if _running_ your app involves more than a single command (e.g. you need to run a web server _and_ something like a module bundler), you have to remember to do this every single time you work on it.

## Automate, Automate, Automate

Okay, so we're aware that some of our processes may be inefficient. How do we fix it?

The absolute best way you can choose to deal with this issue is by codifying your app's environment and other setup into some sort of automated tooling that can do all of this for you. Luckily, we live in the age of [Docker](https://www.docker.com) and [containerization](https://www.docker.com/resources/what-container), which means the tools for this we have at our disposal today are immensely more powerful than they were barely a few years ago.

This post isn't really the place for a deep dive into using Docker as a development environment, but the gist of what you want to do is:

- Use a `Dockerfile` to codify as much as you can about the _immediate_ environment your app needs to run -- this should include things like your language runtime, any binaries it needs (e.g. `imagemagick`), config files, and so on.
- Use a `docker-compose.yml` to codify as much as you can about your app's _external_ dependencies, such as cache servers, database servers, mail servers, and so on.

This will undoubtedly take some time, especially so if you first have to take the time to understand what this Docker thing is all about. Once everything's said and done, however, if you did everything right, you'll have reduced the process to set up a working instance of your app to this:

```bash
git clone <your-repo> .
docker-compose up
```

On top of that, if you've already done this once, it'll take you a lot less time to do it in the future -- especially if your apps share a common stack. It takes me maybe an hour to set all this stuff up for a typical new project these days.

## Learning by Example

If the above seems a little too abstract, let's look at a simple example of a `docker-compose.yml` you could use for a WordPress project.

```yaml
version: "3"

services:
  wp:
    image: wordpress:latest
    ports:
      - 8080:80
    volumes:
      - ./wordpress:/var/www/html:rw
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: password
    depends_on:
      - db
    links:
      - db

  db:
    image: mysql:latest
    ports:
      - 3306:3306
    command:
      [
        "--default_authentication_plugin=mysql_native_password",
        "--character-set-server=utf8mb4",
        "--collation-server=utf8mb4_unicode_ci",
      ]
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_ROOT_PASSWORD: password
```

It's self-explanatory enough -- The `wp` service is the actual WordPress site, and the `db` service is a MySQL database (what we called an "external" dependency above). For the purposes of this example, this is all we need to get us to a point where you can just do a `docker-compose up` to run the project.

Now, you'll notice that I didn't provide a `Dockerfile` -- That's because, in this instance, the official `wordpress` image does all we need. For a more complex project, however (or if you wanted to deploy a Docker image to production, too), you'd probably want to write a Dockerfile that extends the official image.

## A Word of Warning

This is a bit of a tangent in the context of this article, but one thing about Docker that I _really_ need to mention, but nobody ever seems to talk about, is that the way you want to use Docker differs pretty significantly depending on whether you're using it for development, or deploying Docker images to production.

The main thing it comes down to is where your code is. Take the volume mounted onto the WordPress container in the example above:

```yaml
volumes:
  - ./wordpress:/var/www/html:rw
```

The WordPress code on your host machine is mounted onto the container -- Any changes you make to it will immediately be reflected in your running app.

On the other hand, if you're building an image to deploy to production, you _have_ to copy your code into your image at build time, so that it's self-contained, and so that it can do anything it needs to do with your code at build time (building binaries, module bundling, etc.).

I find it really important to point out this distinction whenever I get the chance to, because for some reason, a lot of high-profile tutorials out there will have you make a "development" Docker setup that has you rebuild your image every time you want it to reflect the changes in your code, even though this is totally impractical if you're actually using Docker as your dev environment. I dread to think how many people have given up on using Docker for development because they found the idea of constantly rebuilding your app ridiculous (and rightfully so).

Another thing worth mentioning is that, depending on your stack, you may need to have separate images for development and production (you can use [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) to do this without having to maintain multiple Dockerfiles). PHP, for instance, doesn't care -- you're using the exact same code and runtime in every environment. On the other hand, if you're using something like a static site generator, or a language like Go that doesn't have an external runtime, your production image is going to need to be much more lean than the one you use for development.

## Automation Isn't Everything

We've just spent a bunch of time talking about Docker and Docker Compose, and while containerizing your app absolutely makes a huge difference and is probably the single most helpful thing you can do to improve the onboarding experience, we should take a moment to remember that reducing your setup to a `docker-compose up` isn't the be-all and end-all of making your app friendly to work with.

Here are a few other things to keep in mind.

- If your app or library has any sort of public API, you **must** make it easy for people to see what it actually is; expecting people to dive into your code doesn't count. For HTTP APIs, tools like [the OpenAPI spec](https://swagger.io/docs/specification/about/) and [Swagger UI](https://swagger.io/tools/swagger-ui/) make it easy to automatically generate API docs and expose them in a friendly way; use them.
- Even if you've simplified your dev environment setup and documented any public APIs you may have, there's probably still a bunch of stuff you could put in your README. What is this app? Who's it for? What standards/protocols does it implement? Is it a monorepo, or are there other projects one should look at to get the full picture? Hell, take a screenshot (if applicable) and put it at the top of the README. The more context people can glean from your docs, the better.
- If you can't go the full-on containerization route for whatever reason (please make the effort to try, though!), make sure _all_ the steps one needs to go through to set up a dev environment for your app are well-documented. Don't assume people will just know what to do with your code, even if your app uses a similar stack to other projects in your team or company.

## Think Like a FOSS Maintainer

To conclude this post, I think the single most important piece of advice I can give on this topic is -- **Think like a FOSS maintainer**. Pretend for a second that you're not developing an internal project that people are obligated to use, but a personal open-source project nobody will ever use if the DX is poor and the extent of your docs is a near-blank README.

To an extent, you don't even have to pretend -- Yeah, of course you don't have to sell people on your project if they're obligated to work with it, but that doesn't mean the atittude you take towards the stuff in this post doesn't matter. Making the effort to make your coworkers' jobs easier makes a huge difference in how they see you, your project, your team, and even affects the culture of the company as a whole.

To be blunt, animosity between teams can grow from the most trivial of things; we have to make the extra effort to extend that olive branch when we can.

The way I personally see this (with the disclaimer that this is absolutely my personal opinion -- I can hardly pretend to speak for everyone) is that making sure your projects are well-documented is just a sign of basic respect towards your fellow devs. I wouldn't dream of making someone bang their head against a wall trying to work on a project of mine just because I couldn't be bothered to write proper docs.

## Recap

Let's go over the important stuff one more time:

- [Do your best to automate your dev environments.](#automate-automate-automate) This makes as much of a difference for you as it does for everyone else, especially if you switch between projects a lot.
- [Document your APIs.](#automation-isnt-everything) If you maintain an API other people are supposed to use, you can't expect them to dive into your code to understand it.
- [Put _everything_ in your READMEs.](#automation-isnt-everything) The more comprehensive your docs are, the less often you'll have people tapping you on your shoulder to ask you things.
- [Think like a FOSS maintainer.](#think-like-a-foss-maintainer) Sell people on using your project, even if you don't have to.

And, of course: Be excellent to each other.
