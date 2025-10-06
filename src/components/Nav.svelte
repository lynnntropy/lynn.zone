<script lang="ts">
  import type { Action } from "svelte/action";

  const { style = "default" } = $props();

  const links = [
    { href: "/", text: "Home" },
    { href: "/blog", text: "Blog" },
  ];

  let prefersReducedMotion: boolean;

  $effect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion = mediaQuery.matches;

    const handler = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  });

  const rotate: Action = (node) => {
    $effect(() => {
      let handle: number | null = null;

      const refreshAngle = () => {
        if (prefersReducedMotion) {
          node.style.transform = "";
        } else {
          node.style.transform = `rotate(${(0.25 * window.scrollY) % 360}deg`;
        }
        handle = requestAnimationFrame(refreshAngle);
      };

      refreshAngle();

      return () => {
        if (handle !== null) cancelAnimationFrame(handle);
      };
    });
  };
</script>

<nav
  class={[
    "mb-12 w-full self-center flex items-center gap-8 sm:mb-24 2xl:fixed 2xl:left-8 2xl:flex-col 2xl:items-stretch 2xl:w-48",
    style === "default" && "max-w-3xl",
    style === "blog-post" && "max-w-2xl",
  ]}
>
  <a href="/">
    <img
      use:rotate
      alt="Go to homepage"
      src="/images/avatar.png"
      class="size-12 rounded-full 2xl:size-16 2xl:mx-0 2xl:mb-4"
    />
  </a>
  <ul class="flex gap-4 text-lg 2xl:flex-col 2xl:text-xl">
    {#each links as { href, text }}
      <li>
        <a {href} class="hover:underline">
          {text}
        </a>
      </li>
    {/each}
  </ul>
</nav>
