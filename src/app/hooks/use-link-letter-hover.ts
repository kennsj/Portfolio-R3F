import { useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import styles from "./link-letter-hover.module.css";

gsap.registerPlugin(SplitText);

const LINK_SELECTOR = "a[href]";

function getTextNodes(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest("svg, [aria-hidden='true']")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

export function useLinkLetterHover() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const activeAnimations = new Map<
      HTMLAnchorElement,
      { timeline: gsap.core.Timeline; cleanup: () => void }
    >();

    const animate = (link: HTMLAnchorElement) => {
      if (reducedMotion.matches) return;
      const activeAnimation = activeAnimations.get(link);
      if (activeAnimation) {
        activeAnimation.timeline.play();
        return;
      }

      const projectName = link.closest("[data-project-list]")
        ? link.querySelector<HTMLElement>("strong")
        : null;
      const textRoot = projectName ?? link;
      const wrappers = getTextNodes(textRoot).map((textNode) => {
        const wrapper = document.createElement("span");
        wrapper.className = styles["text-wrapper"];
        textNode.replaceWith(wrapper);
        wrapper.append(textNode);
        return wrapper;
      });
      if (!wrappers.length) return;

      const splits = wrappers.map((wrapper) =>
        SplitText.create(wrapper, {
          type: "words,chars",
          charsClass: styles.character,
        }),
      );
      const characters = splits.flatMap((split) => split.chars);
      if (!characters.length) {
        splits.forEach((split) => split.revert());
        wrappers.forEach((wrapper) =>
          wrapper.replaceWith(...wrapper.childNodes),
        );
        return;
      }

      const exitOrder = gsap.utils.shuffle([...characters]);
      const enterOrder = gsap.utils.shuffle([...characters]);
      const lengthFactor = gsap.utils.clamp(
        0.42,
        1,
        1 - Math.max(0, characters.length - 8) * 0.06,
      );
      const staggerAmount =
        Math.min(0.48, characters.length * 0.026) * lengthFactor;
      let cleaned = false;
      const timeline = gsap.timeline({ paused: true });

      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        timeline.kill();
        splits.forEach((split) => split.revert());
        wrappers.forEach((wrapper) => {
          if (wrapper.isConnected) wrapper.replaceWith(...wrapper.childNodes);
        });
        if (activeAnimations.get(link)?.cleanup === cleanup) {
          activeAnimations.delete(link);
        }
      };

      activeAnimations.set(link, { timeline, cleanup });
      timeline
        .to(exitOrder, {
          autoAlpha: 0,
          filter: "blur(9px)",
          duration: 0.58 * lengthFactor,
          stagger: { amount: staggerAmount },
          ease: "power2.in",
        })
        .to(
          enterOrder,
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.82 * lengthFactor,
            stagger: { amount: staggerAmount },
            ease: "power2.out",
          },
          ">-0.02",
        )
        // Once the reveal has finished, restore the original markup. This also
        // removes the active animation so leaving the link cannot replay it in
        // reverse; a later hover starts a fresh reveal instead.
        .eventCallback("onComplete", cleanup)
        .eventCallback("onReverseComplete", cleanup)
        .play();
    };

    const reverse = (link: HTMLAnchorElement) => {
      const activeAnimation = activeAnimations.get(link);
      if (!activeAnimation) return;
      if (activeAnimation.timeline.progress() === 0) {
        activeAnimation.cleanup();
        return;
      }
      activeAnimation.timeline.reverse();
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(LINK_SELECTOR);
      if (!link || link.contains(event.relatedTarget as Node | null)) return;
      animate(link);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(LINK_SELECTOR);
      if (!link || link.contains(event.relatedTarget as Node | null)) return;
      reverse(link);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(LINK_SELECTOR);
      if (link) animate(link);
    };

    const onFocusOut = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(LINK_SELECTOR);
      if (!link || link.contains(event.relatedTarget as Node | null)) return;
      reverse(link);
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      Array.from(activeAnimations.values()).forEach(({ cleanup }) => cleanup());
    };
  }, []);
}
