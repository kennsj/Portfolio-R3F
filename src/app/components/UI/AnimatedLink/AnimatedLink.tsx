import {
  useRef,
  useEffect,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useI18n } from "../../../hooks/useI18n";
import { localizePath } from "../../../utils/locale-path";
import styles from "./animated-link.module.css";

gsap.registerPlugin(SplitText);

type TypographyProperties = CSSProperties & {
  "--animated-link-font-family": string;
  "--animated-link-font-size": string;
  "--animated-link-font-style": string;
  "--animated-link-font-weight": string;
  "--animated-link-line-height": string;
  "--animated-link-letter-spacing": string;
  "--animated-link-text-transform": string;
};

type ActiveAnimation = {
  timeline: gsap.core.Timeline;
  cleanup: () => void;
};

type AnimatedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  animationTarget?: string;
  animateText?: boolean;
  animationSpeed?: number;
  blurReveal?: "characters" | "whole";
};

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

function getTypography(element: HTMLElement): TypographyProperties {
  const computed = window.getComputedStyle(element);
  return {
    "--animated-link-font-family": computed.fontFamily,
    "--animated-link-font-size": computed.fontSize,
    "--animated-link-font-style": computed.fontStyle,
    "--animated-link-font-weight": computed.fontWeight,
    "--animated-link-line-height": computed.lineHeight,
    "--animated-link-letter-spacing": computed.letterSpacing,
    "--animated-link-text-transform": computed.textTransform,
  };
}

const AnimatedLink = ({
  animationTarget,
  animateText = true,
  animationSpeed = 1,
  blurReveal = "characters",
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  children,
  href,
  ...props
}: AnimatedLinkProps) => {
  const { locale } = useI18n();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const activeAnimationRef = useRef<ActiveAnimation | null>(null);
  const localizedHref = href?.startsWith("/")
    ? localizePath(href, locale)
    : href;

  useEffect(() => () => activeAnimationRef.current?.cleanup(), []);

  const animate = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (activeAnimationRef.current) {
      activeAnimationRef.current.timeline.timeScale(1).play();
      return;
    }

    const link = linkRef.current;
    if (!link) return;
    const textRoot = animationTarget
      ? link.querySelector<HTMLElement>(animationTarget)
      : link;
    if (!textRoot) return;

    if (blurReveal === "whole") {
      let cleaned = false;
      const timeline = gsap.timeline({ paused: true });
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        timeline.kill();
        gsap.set(textRoot, {
          opacity: 1,
          yPercent: 0,
          clipPath: "inset(0 0 0% 0)",
        });
        activeAnimationRef.current = null;
      };

      activeAnimationRef.current = { timeline, cleanup };
      timeline
        .fromTo(
          textRoot,
          { opacity: 1, filter: "blur(6px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7 * animationSpeed,
            ease: "power2.out",
            immediateRender: false,
          },
        )
        .eventCallback("onReverseComplete", cleanup)
        .play();
      return;
    }

    const wrappers = getTextNodes(textRoot).map((textNode) => {
      const parent = textNode.parentElement ?? textRoot;
      const wrapper = document.createElement("span");
      wrapper.className = styles["text-wrapper"];
      Object.assign(wrapper.style, getTypography(parent));
      textNode.replaceWith(wrapper);
      wrapper.append(textNode);
      return wrapper;
    });
    if (!wrappers.length) return;

    const splits = wrappers.map((wrapper) =>
      SplitText.create(wrapper, {
        type: "words,chars",
        charsClass: "animated-link-character",
      }),
    );
    const characters = splits.flatMap((split) => split.chars);
    if (!characters.length) {
      splits.forEach((split) => split.revert());
      wrappers.forEach((wrapper) => wrapper.replaceWith(...wrapper.childNodes));
      return;
    }
    const isLongLink = characters.length > 16;
    const enterOrder = gsap.utils.shuffle([...characters]);
    const revealGroups = isLongLink
      ? enterOrder.reduce<HTMLElement[][]>((groups, character, index) => {
          const groupIndex = Math.floor(index / 3);
          (groups[groupIndex] ??= []).push(character);
          return groups;
        }, [])
      : [];
    const shortLinkSpeedFactor = gsap.utils.clamp(
      0.8,
      1,
      0.8 + Math.max(0, characters.length - 4) * 0.05,
    );
    const longLinkDurationFactor =
      1 + Math.min(0.45, Math.max(0, characters.length - 8) * 0.04);
    const staggerAmount = isLongLink
      ? Math.min(0.34, characters.length * 0.014)
      : Math.min(0.72, characters.length * 0.026);
    const revealDuration =
      (isLongLink ? 0.38 : 1.2) *
      shortLinkSpeedFactor *
      longLinkDurationFactor *
      animationSpeed;
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
      activeAnimationRef.current = null;
    };

    activeAnimationRef.current = { timeline, cleanup };
    if (isLongLink) {
      revealGroups.forEach((group, index) => {
        timeline.fromTo(
          group,
          // Keep every character present while it resolves. Driving grouped
          // characters to autoAlpha: 0 made long links look like they were
          // losing letters instead of getting a blur reveal.
          { opacity: 0.72, filter: "blur(4px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: revealDuration,
            ease: "power2.out",
            immediateRender: false,
          },
          index * revealDuration * 0.09,
        );
      });
    } else {
      timeline.fromTo(
        enterOrder,
        { autoAlpha: 0, filter: "blur(9px)" },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: revealDuration,
          stagger: { amount: staggerAmount },
          ease: "power2.out",
          immediateRender: false,
        },
      );
    }
    timeline.eventCallback("onReverseComplete", cleanup).play();
  };

  const reverse = () => {
    const activeAnimation = activeAnimationRef.current;
    if (!activeAnimation) return;
    if (activeAnimation.timeline.progress() < 1) {
      activeAnimation.timeline.timeScale(1.8).reverse();
      return;
    }
    activeAnimation.cleanup();
  };

  return (
    <a
      {...props}
      href={localizedHref}
      ref={linkRef}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerEnter?.(event);
        if (animateText && event.pointerType !== "touch") animate();
      }}
      onPointerLeave={(event: PointerEvent<HTMLAnchorElement>) => {
        onPointerLeave?.(event);
        if (animateText) reverse();
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        if (animateText) animate();
      }}
      onBlur={(event: FocusEvent<HTMLAnchorElement>) => {
        onBlur?.(event);
        if (animateText) reverse();
      }}
    >
      {children}
    </a>
  );
};

export default AnimatedLink;
