---
title: PHP Debugging With Xdebug 3 Inside a Docker Container
date: 2021-04-13
---

I recently spent a good few hours getting Xdebug to work with my development setup (which is [PhpStorm](https://www.jetbrains.com/phpstorm/) running [inside WSL 2](https://susi.dev/dev-env-2020) on Windows 10, and PHP/Xdebug running inside a Docker container, inside WSL 2, with [Docker Desktop](https://docs.docker.com/docker-for-windows/install/)), so here I am writing up the surprisingly simple solution I ended up with -- partially for my own future reference, but also to help out anyone who finds themselves in a similar situation.

(Don't get discouraged by my ultra-convoluted setup -- this configuration _should_ actually theoretically work for pretty much any environment, for reasons I'll get into a little later on.)

## Preamble

Xdebug can be tricky to configure, because it works in reverse from the way you're probably used to interacting with your PHP application -- instead of sending requests _to_ your PHP code, Xdebug needs to know how to send requests _from_ where your code is running _to_ your client application (i.e. probably your editor or IDE), in order to establish a debugging connection.

This is fine if your setup is relatively simple (i.e. Xdebug can just go to `localhost:9003` and hit your client), but if your setup is a little more complicated than that -- i.e. if PHP/Xdebug is running on a different physical machine, in a VM, in a container, or similar -- it won't work out of the box.

Xdebug 3 makes this whole exercise a little easier for us by generally overhauling the way Xdebug is configured to make it simpler, but if your setup is a little convoluted (like mine), it can still be finicky to get right, hence this post.

## The Meat and Potatoes

Okay, so here's what I ended up with.

This is the bit you need to put somewhere in your PHP configuration (i.e. your `php.ini`, or wherever you usually configure your PHP extensions):

```ini
[Xdebug]
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.discover_client_host=true
xdebug.client_host=host.docker.internal
```

Let's go over this line-by-line:

`xdebug.mode=debug` enables [step debugging](https://xdebug.org/docs/step_debug) (which is probably what you want to use Xdebug for.)

`xdebug.start_with_request=yes` tells Xdebug that we want to activate step debugging at the start of every request, for simplicity's sake. I recommend setting this to `yes` and forgetting about it, but if you've done this before and you know you prefer to activate step debugging only for specific requests, leave this line out and Xdebug will default to `trigger`.

The last two lines are where it gets interesting. `xdebug.discover_client_host=true` tells Xdebug to attempt to extract the IP of the client from the HTTP request, and `xdebug.client_host` tells it what to try if that doesn't work.

With all of these set the way we've set them, here's what happens every time you send a request to your PHP application:

- Xdebug activates step debugging (because our `xdebug.mode` is `debug`, and `xdebug.start_with_request` is set to `yes`).
- Xdebug attempts to automatically connect to the host the HTTP request came from (using `$_SERVER['REMOTE_ADDR']`, `$_SERVER['HTTP_X_FORWARDED_FOR']`, or a custom HTTP header you've configured).
- If the above didn't work, it falls back to trying to connect to our `xdebug.client_host`, which is `host.docker.internal`, a DNS name for the host helpfully set for us by Docker Desktop on Windows or macOS (though unfortunately not on Linux).

The fact that Xdebug lets us set both `xdebug.discover_client_host` and `xdebug.client_host` as a fallback is the key to making this configuration work for just about any setup, whether you're on Linux, macOS or Windows, and even whether you're using Docker or not.

If you're using Docker Desktop, having `host.docker.internal` set as a fallback host means Xdebug will always be able to find its way to the host, and on most other setups, client discovery (via `xdebug.discover_client_host`) should just work. Theoretically, the only scenario this config should break in is if you're using something that breaks client discovery that _isn't_ Docker (e.g. a Vagrant virtual machine), in which case there's probably something else you can set `xdebug.client_host` to to fix it.

## Installing Xdebug in Your Docker Image

If you're using Docker (and if you're not, I highly recommend thinking about it!), the below is an example of what I do to install and enable Xdebug in development without carrying it over to the production image, using [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/):

```docker
# (or your base image)
FROM php:8.0-fpm-alpine as base

# whatever you do to set up your image
# for example:
#   - copying your source code
#   - installing extensions
#   - doing a `composer install`

FROM base as development

RUN pecl install xdebug && docker-php-ext-enable xdebug

FROM base as production

# whatever you do to prepare your image for production
# for example: removing packages you don't need in production
```

## Conclusion

That's it! You should now have an Xdebug config that works for everything from Docker Desktop to just running PHP on the same Linux machine as your editor.

If you're using this config and you've found a setup it doesn't work for, please yell at me and I'll probably add a note to this post!
