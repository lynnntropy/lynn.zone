<script lang="ts">
  import type { Action } from "svelte/action";
  import rinImage from "@/assets/images/rin.png";

  let prefersReducedMotion: boolean = true;

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

<img
  use:rotate
  alt="Go to homepage"
  src={rinImage.src}
  class="size-12 rounded-full 2xl:size-16 2xl:mx-0 2xl:mb-4"
/>
