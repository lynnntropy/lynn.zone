---
title: "Haxe + Flambe: An adventure"
date: 2015-03-27
---

I recently built and released a small project, a web-based (HTML5 + Flash) game built using Haxe and Flambe.

With the project as complete as it’ll ever be, I feel like sharing my experiences with the framework. For many reasons, it was an interesting framework to work with, and it brings some really fresh ideas to the table, but I don’t think I’ll be starting up another Flambe project soon. I outline why below.

## What is Flambe?

Flambe is a cross-platform (but mainly web focused) gamedev framework built on top of Haxe, a language that compiles to everything under the sun.

Now, Flambe is somewhat different in the world of Haxe-based frameworks in that it doesn’t use OpenFL (a Haxe framework that allows you to build Flash applications in Haxe and deploy them as native builds to pretty much anything) as part of the build process — rather, it rolls its own solution, limiting itself to only Flash and HTML5 as export options.

I didn’t particularly care about this limitation, as I was building a web game anyway. However, those wanting to build a desktop or mobile game using the framework will probably want to look elsewhere, as you’ll be limited to AIR’s relatively poor performance on mobile (using the Flash target), as opposed to full native performance using OpenFL (which generates C++/SDL code).

## Haxe: The first hurdle

I have a love-hate relationship with Haxe. On one hand, I love that it lets me use a language structure I’m fairly familiar with (as a C#/Java dev) to write software for more-or-less anything with a processor. The whole concept is very intriguing to me. On the other hand, Haxe has one big problem: A lack of ecosystem, brought on by not being a very well known language.

You see this problem manifest itself in many ways. Probably the biggest is the lack of a truly _good_ development environment. The only ‘real’ IDE Haxe has is FlashDevelop, which is Windows-only and simply isn’t very good. Contrast this to the IDEs available for C# (Visual Studio), Java (IntelliJ IDEA), Python (a number of IDEs, _including_ Visual Studio), JavaScript/CoffeeScript/TypeScript (WebStorm, among many others), and you see why I feel like a proper IDE is kind of a must in 2015.

Now, this is a bit unfair to the Haxe mantainers — it isn’t their fault nobody has properly integrated a modern IDE with Haxe. But I do think it’s something people ought to consider, especially going into remotely complex projects.

The second problem Haxe has is a lack of large community, and as such a lack of general-purpose libraries and ‘knowledge base’. Libraries I can do without, since I’m only doing gamedev anyway, and the basics are there — but if you find yourself stuck on some language quirk, the Haxe documentation itself is very barebones, and there’s no guarantee you’ll find your answer somewhere on the Web, like there usually is with popular languages. You may simply be left hanging to figure it out on your own, even if the problem is extremely simple.

Someone once said that the only way to truly learn Haxe is to find someone who knows Haxe well and pester them until they’ve told you everything they know. I understand now how true this is.

## What Flambe does well

There are a few features in Flambe that truly surprised me, especially in the context of an otherwise fairly barebones framework.

**Live asset reloading.** Change a file in an external editor and it updates in-game as soon as you hit save. This is incredibly useful for art, as you can see how it looks in the game without pressing a single button — It just works.

**Animations/tweening as a function of the framework itself.** Flambe makes a big deal out of most values being instances of Flambe’s ‘AnimatedFloat’ class, and it should. Any value that’s an AnimatedFloat (most properties of the Sprite class, for instance) can be tweened — with easing — by calling a single function.

On the other hand, this isn’t _that_ big of a deal. You can get more or less the same functionality in other frameworks by using a third party tweening library, like LeanTween for Unity.

**Scenes are incredibly versatile and are very easy to transition between. **Flambe’s scene transition framework blows other systems, like Unity’s, out of the water. In Unity, you might be able to replicate what Flambe does now that asynchronous loading no longer requires Unity Pro, but it would be a large undertaking to achieve a relatively minor effect.

Want to make a scene that overlays the scene below it, and slide it in from off-screen? Flambe can do that in two lines of code. Want to keep the state of the last scene saved so you can transition back seamlessly? Flambe does that _by default_.

## Where Flambe falls short

Despite being an interesting framework, I probably won’t be using it again in the foreseeable future, and I’d find it difficult to recommend to someone else — For a serious project, anyway. Here’s why.

**Apparent disinterest in following industry standards. **Flambe packages both Flash and HTML5 builds as thin clients that grab assets from your server at runtime. This is great if you plan on hosting the games yourself, but the issue arises when you realize that it _doesn’t_ let you package a Flash build as a single SWF, which is how every single Flash portal expects you to package your game.

I managed to work around this by using a fork of an older version of Flambe (4.0 if I remember correctly) that supports exporting a single SWF with an included preloader. But this obviously isn’t an ideal solution, and I’d be high and dry if that developer hadn’t been generous enough to release his fork.

**Lack of support for fairly common features, while supporting more advanced features in their stead. **For instance, Flambe comes with [Flump](http://threerings.github.io/flump/) support out of the box, which is great! However, it leaves out support for traditional spritesheet and frame-based animations, which are much more standard and used by many, many more developers.

Granted, frame-based animations are fairly trivial to implement — I implemented them into my game in less than an hour. But if anything, this only raises the question of why Flambe hasn’t done them from the beginning, let alone now.

## Conclusion

So, is Flambe an _objectively bad_ framework? Of course not, no. There’s a reason it’s been used by companies like Nickelodeon and Disney, even over much more popular Haxe/web frameworks.

However, should I find myself doing a similar project in the future, I’ll likely be using an OpenFL-based framework with a longer history and larger community like HaxeFlixel, or simply OpenFL itself (the API is fairly simple to work with, or so I’ve heard).

If you’re planning on building a game for the purposes of a gamejam, or to publish on your own website, or for a client that doesn’t mind the limitations, I still encourage you to give Flambe a whirl. You may find that it’s exactly what you’re looking for.
