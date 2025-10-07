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
      let rAFHandle: number | null = null;

      const refreshAngle = () => {
        if (prefersReducedMotion) {
          if (node.style.transform !== "") {
            node.style.transform = "";
          }
        } else {
          const angle = Number(((0.25 * window.scrollY) % 360).toPrecision(5));
          const transform = `rotate(${angle}deg)`;
          if (node.style.transform !== transform) {
            node.style.transform = transform;
          }
        }

        rAFHandle = requestAnimationFrame(refreshAngle);
      };

      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          rAFHandle = requestAnimationFrame(refreshAngle);
        } else if (rAFHandle) {
          cancelAnimationFrame(rAFHandle);
          rAFHandle = null;
        }
      });

      observer.observe(node);

      return () => {
        observer.disconnect();

        if (rAFHandle) {
          cancelAnimationFrame(rAFHandle);
        }
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
