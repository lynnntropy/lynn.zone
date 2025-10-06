---
title: You Probably Don't Need a VPN
date: 2022-11-13
---

Given the nature of this blog, and where I usually share my content, chances are most of the people reading this probably already know everything I'm about to say here. That being said, I really wanted to write about this because I think it's a big problem, and I think those of us who see what's going on have a duty to call it out. If this post ends up being helpful to even one person, I'll consider the effort well worth it.

Also, a quick clarification: This is mainly going to be about _consumer_ VPN products, not business VPNs, which have very different use cases and aren't really affected by issues like predatory marketing.

## The problem

I'll get right to it -- something that's become a _huge_ issue in recent years is predatory VPN marketing, largely aimed at non-technical audiences, and misleading to the point where I'm pretty comfortable with just calling it a scam.

You've almost certainly seen examples of what I'm talking about here -- ads for VPN products, _especially_ in the form of stuff like YouTube video sponsorships, trying to convince you that your online privacy and security is in grave danger if you're not using their product. Oh no!

Before we continue, here's a _really_ quick explainer of what a VPN does: It lets you tunnel your connection through one of their servers (usually, you can pick where this server is), with the tunnel between you and their server being encrypted. That's it.

Now, keeping that in mind, let's take a quick look at the claims some of the biggest VPN vendors make on their websites:

[NordVPN](https://nordvpn.com/):

> A good VPN service provides you a secure, encrypted tunnel for online traffic to flow. Nobody can see through the tunnel, get their hands on your online data, or find your real IP address and location. NordVPN is the best VPN if you’re looking for peace of mind when on public Wi-Fi. Securely access personal information or work files, encrypt your internet connection, and keep your browsing history and online identity private.

[ExpressVPN](https://www.expressvpn.com/):

> Going online doesn’t have to mean being exposed. Whether you’re shopping from your desk or just connecting at a cafe, keep your personal information more private and secure.

[Private Internet Access](https://www.privateinternetaccess.com/):

> Keep your data encrypted for extra security. Don’t let anyone get their hands on unencrypted emails, pictures, banking details, or anything else best kept private.

[Proton VPN](https://protonvpn.com/):

> Our secure VPN sends your internet traffic through an encrypted VPN tunnel, so your passwords and confidential data stay safe, even over public or untrusted Internet connections.

Okay, so... none of these are _technically_ saying anything that's not true. However, if we read between the lines here even a tiny bit, there's several _wild_ claims being made:

- Your online activity isn't usually encrypted.
- People can "get their hands on your online data" if you're not using a VPN.
- People can "get their hands on [your] unencrypted emails, pictures, [and] banking details" if you're not using a VPN.
- Using public Wi-Fi without a VPN is unsafe.
- Shopping online without a VPN is unsafe.

All of these are patently, demonstrably untrue, and they know that, which is why they're being careful not to _explicitly_ make any of those claims.

_Why_ are these claims untrue? The answer is pretty simple -- in 2022, **basically everything you do online is already encrypted**, thanks to the near-ubiquitous presence of [HTTPS](https://www.cloudflare.com/learning/ssl/what-is-https/).

Anytime you visit a website where the little padlock shows up in your browser, and the URL begins with `https://` (which, again, is basically every website -- certainly every website you're going to be doing anything remotely sensitive on), or use an app that does the same thing under the hood, your connection to that site is already encrypted with, to borrow a phrase, "military-grade encryption". It's effectively impossible for anyone to get past this, at least not without compromising the device you're using in some way.

Now, HTTPS doesn't quite encrypt _all_ of your traffic in the way a VPN does. Even if you're using HTTPS, someone with unrestricted access to your traffic can usually still use it to see a few things, mainly:

- The IP addresses you're connecting to.
- The names of the websites you're connecting to\* (**not** full URLs).
- Any other unencrypted data you're sending over the network, even though this _should_ be quite rare in 2022, and largely limited to stuff like games that don't bother to encrypt their network packets.

It's legitimately the case that the extra layer of encryption you get with a VPN makes it so that nobody between you and the VPN server can see these anymore. That being said, it's still clear that the reality is _much_ less scary than the wild claims VPN vendors make about what can happen if you're not using their product, which is inconvenient for them, so they just lie instead.

\* There are ongoing efforts to close the remaining gaps in encryption on the web that make this possible, such as [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS), [DNS over TLS](https://en.wikipedia.org/wiki/DNS_over_TLS), and [TLS Encrypted Client Hello](https://datatracker.ietf.org/doc/html/draft-ietf-tls-esni), but industry-wide changes like this take _years_ to happen, so as of 2022, these haven't been widely deployed yet.

## What can we do here?

Honestly, I'm not sure what we can really do about this. The companies that do this are quite careful to not make these claims in a way that'd make it trivial to bag them for false advertising, and that's without even getting into the fact that many of these companies are based in jurisdictions like the British Virgin Islands (ExpressVPN) and Panama (NordVPN), where I think it's reasonable to assume consumer protections are a little weaker than in places like Europe or North America.

Perhaps the most effective thing we can do here is hold accountable the army of YouTubers and other content creators who take sponsorships from these companies and make these claims on their behalf, often even going above and beyond the companies' own marketing, as well as blurring the distinction between what they're being paid to say and what they genuinely believe.

To be clear, I don't think there's anything _inherently_ wrong with content creators taking sponsorships, but they have a duty to vet these sponsorships to make sure they're not selling snake oil to their audience, and that's clearly not happening here. I really hope we're slowly approaching a point where people wake up to how awful a lot of these YouTube sponsorships are (not even just the ones we're talking about here), because it sure doesn't feel like the situation can get much worse on that front.

## So, should you use a VPN?

So, should you use a VPN? Maybe! Even knowing that they don't do nearly as much as they claim to, there are still totally legitimate reasons you might want to use one:

- You live in an authoritarian state where being found to have engaged in "undesirable activity" comes with potentially grave consequences, and/or want to get around the sweeping internet censorship inevitably done by such states.

- You _don't_ live in an authoritarian state, but still have reason to be concerned about the possibility of a middleman (your ISP, employer, school, parents, etc.) having access to even very limited data on what you're doing online, or you want to get around filters that rely on that data.

- You want to be able to hide your real IP, or make it look like you're in a different location. This is quite useful for gaining access to region-locked content on e.g. streaming services, and probably the most common real use case for a VPN.

That being said, if you're just worried about your passwords getting stolen because you logged into your bank account while on Starbucks Wi-Fi... don't waste your money. You _do not_ need a VPN to enjoy a basic level of online security.

## Further reading

I'm definitely not the first person to have concerns about this or write about it, just one of many trying to move the needle in favor of people not getting scammed out of their money by predatory marketing. If you're interested in looking into the topic a bit more, here are some other resources you might want to have a look at:

- [Tom Scott - This Video Is Sponsored By ███ VPN](https://www.youtube.com/watch?v=WVDQEoe6ZWY)
- [VICE - You Probably Don't Need a VPN](https://www.vice.com/en/article/xgxnwk/you-probably-dont-need-a-vpn)
