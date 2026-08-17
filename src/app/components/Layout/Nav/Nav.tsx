import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import { useKpIndex, getKpColor } from "../../../hooks/useKpIndex";
import { useManualKp } from "../../../hooks/KpContext";
import { usePageTransition } from "../../../hooks/usePageTransition";
import { useHeroIntro } from "../../../hooks/HeroIntroContext";
import { useI18n } from "../../../hooks/useI18n";
import styles from "./Nav.module.scss";
import AnimatedLink from "../../UI/AnimatedLink/AnimatedLink";

const Nav = () => {
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [kpOpen, setKpOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [navIntroStarted, setNavIntroStarted] = useState(false);
  const { data } = useKpIndex();
  const { manualKp } = useManualKp();
  const { locale, t, toggleLocale } = useI18n();
  const { transitionTo } = usePageTransition();
  const { homeHeroIntroReady } = useHeroIntro();
  const kp = manualKp ?? data?.latest ?? 0;
  const kpDescription =
    locale === "nb"
      ? "KP måler global geomagnetisk aktivitet fra 0–9. Høyere tall betyr sterkere nordlys og større sjanse for synlighet lenger sør."
      : "KP measures global geomagnetic activity from 0–9. A higher reading means a stronger aurora with a better chance of visibility farther south.";

  useEffect(() => {
    let previousScrollY = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
    const updateHeaderState = () => {
      const scrollY = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
      const scrollingDown = scrollY > previousScrollY + 1;
      const scrollingUp = scrollY < previousScrollY - 1;
      previousScrollY = scrollY;

      setPastHero((current) => {
        const next = scrollY > window.innerHeight * 0.8;
        return current === next ? current : next;
      });

      setNavHidden((current) => {
        if (open) return false;
        if (scrollY <= window.innerHeight * 0.8) return false;
        if (scrollingDown) return true;
        if (scrollingUp) return false;
        return current;
      });
    };

    const onScroll = () => updateHeaderState();
    updateHeaderState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "") {
      setActiveSection("page");
      return;
    }

    const sectionIds = ["about", "work", "expertise", "signal", "contact"];
    let frame = 0;
    const updateActiveSection = () => {
      const line = window.innerHeight * 0.5;
      const active = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null)
        .find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= line && rect.bottom > line;
        });
      setActiveSection(active?.id ?? null);
      frame = window.requestAnimationFrame(updateActiveSection);
    };
    frame = window.requestAnimationFrame(updateActiveSection);
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.inert = !open;
    if (!open) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
      return;
    }

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>("a, button"),
    );
    focusable[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useGSAP(
    () => {
      if (!navRef.current) return;
      if (!homeHeroIntroReady) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(navRef.current, { autoAlpha: 1, y: 0 });
        } else {
          gsap.set(navRef.current, { autoAlpha: 0, y: -12 });
        }
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(navRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(navRef.current, {
          clearProps: "opacity,visibility,transform",
        });
        setNavIntroStarted(true);
        return;
      }
      gsap.set(navRef.current, { autoAlpha: 0, y: -12 });
      gsap.fromTo(
        navRef.current,
        { autoAlpha: 0, y: -12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () =>
            gsap.set(navRef.current, {
              clearProps: "opacity,visibility,transform",
            }),
        },
      );
      setNavIntroStarted(true);
    },
    { dependencies: [homeHeroIntroReady], scope: navRef },
  );

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const links = panel.querySelectorAll<HTMLElement>(
        `.${styles.menuLinks} a`,
      );
      if (open) {
        gsap.set(panel, { pointerEvents: "auto" });
        gsap.fromTo(
          panel,
          { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.8,
            ease: "shiftReveal",
          },
        );
        gsap.fromTo(
          links,
          {
            autoAlpha: 1,
            yPercent: 110,
            rotationX: -72,
            skewY: 3,
            clipPath: "inset(0 0 100% 0)",
            transformPerspective: 1100,
            transformOrigin: "50% 100%",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationX: 0,
            skewY: 0,
            clipPath: "inset(0 0 0% 0)",
            transformPerspective: 1100,
            transformOrigin: "50% 100%",
            duration: 1.2,
            stagger: 0.1,
            ease: "shiftTitle",
            delay: 0.08,
          },
        );
      } else {
        gsap
          .timeline({
            onComplete: () => gsap.set(panel, { pointerEvents: "none" }),
          })
          .to(links, {
            autoAlpha: 0,
            yPercent: 110,
            rotationX: -72,
            skewY: 3,
            clipPath: "inset(0 0 100% 0)",
            transformPerspective: 1100,
            transformOrigin: "50% 100%",
            duration: 0.52,
            ease: "shiftTitle",
          })
          .to(
            panel,
            {
              autoAlpha: 0,
              clipPath: "inset(0 0 100% 0)",
              duration: 0.52,
              ease: "shiftReveal",
            },
            "-=.12",
          );
      }
    },
    { dependencies: [open], scope: panelRef },
  );

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setOpen(false);
    window.setTimeout(() => transitionTo(href), 180);
  };

  const toggleMenu = () => {
    if (!open) previousFocusRef.current = document.activeElement as HTMLElement;
    setOpen((value) => !value);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.nav} ${navHidden ? styles.navHidden : ""} ${!homeHeroIntroReady || !navIntroStarted ? styles.navIntroPending : ""}`}
        aria-label={locale === "nb" ? "Hovednavigasjon" : "Main navigation"}
      >
        <AnimatedLink
          href="/"
          onClick={(event) => go(event, "/")}
          className={styles.identity}
        >
          <img src="/kj-logo.svg" alt="Kenneth Jørgensen" />
        </AnimatedLink>
        <div className={styles.topLinks}>
          <AnimatedLink
            href="/#work"
            onClick={(event) => go(event, "/#work")}
            className={activeSection === "work" ? styles.active : undefined}
          >
            {locale === "nb" ? "Prosjekter" : "Work"}
          </AnimatedLink>
          <AnimatedLink
            href="/#about"
            onClick={(event) => go(event, "/#about")}
            className={activeSection === "about" ? styles.active : undefined}
          >
            {t.navAbout}
          </AnimatedLink>
          <AnimatedLink
            href="/#contact"
            onClick={(event) => go(event, "/#contact")}
            className={activeSection === "contact" ? styles.active : undefined}
          >
            {t.navContact}
          </AnimatedLink>
        </div>
        <AnimatedLink
          href="mailto:hei@kennethjorgensen.no"
          className={styles.contactAction}
        >
          <span className={styles.contactIdentity} aria-hidden="true">
            <img src="/images/haio.webp" alt="" />
          </span>
          <span>{locale === "nb" ? "Ta kontakt" : "Get in touch"}</span>
        </AnimatedLink>
        <div className={styles.navMeta} aria-hidden={!pastHero && !open}>
          <div
            className={styles.kpWrap}
            onMouseEnter={() => setKpOpen(true)}
            onMouseLeave={() => setKpOpen(false)}
            onFocusCapture={() => setKpOpen(true)}
            onBlurCapture={(event) =>
              !event.currentTarget.contains(event.relatedTarget) &&
              setKpOpen(false)
            }
          >
            <button
              type="button"
              className={styles.kp}
              onClick={() => setKpOpen((value) => !value)}
              onKeyDown={(event) => event.key === "Escape" && setKpOpen(false)}
              aria-expanded={kpOpen}
              aria-describedby="kp-explainer"
            >
              <i style={{ background: getKpColor(kp) }} />
              KP {kp.toFixed(1)}
            </button>
            <div
              id="kp-explainer"
              role="tooltip"
              className={`${styles.kpPopover} ${kpOpen ? styles.kpPopoverOpen : ""}`}
            >
              <span>
                {manualKp !== null
                  ? locale === "nb"
                    ? "Simulert verdi"
                    : "Simulated reading"
                  : locale === "nb"
                    ? "Direkte avlesning"
                    : "Live reading"}
              </span>
              <strong>KP {kp.toFixed(1)}</strong>
              <p>{kpDescription}</p>
              <small>
                {locale === "nb"
                  ? "Skydekke og mørke avgjør lokal synlighet."
                  : "Cloud cover and darkness still determine local visibility."}
              </small>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={`${t.languageSwitchLabel}: ${locale === "nb" ? "English" : "Norsk"}`}
            lang={locale === "nb" ? "en" : "nb"}
          >
            {locale === "nb" ? "EN" : "NO"}
          </button>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            {open ? t.menuClose : t.menuOpen}
          </button>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          {open ? t.menuClose : locale === "nb" ? "Meny" : "Menu"}
        </button>
      </nav>

      <div
        ref={panelRef}
        id="site-menu"
        className={styles.menuPanel}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label={t.menuOpen}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className={styles.menuInner}>
          <div className={styles.menuLinks}>
            <AnimatedLink
              href="/#about"
              onClick={(event) => go(event, "/#about")}
              className={activeSection === "about" ? styles.active : undefined}
            >
              <span>00 /</span>
              {locale === "nb" ? "Om" : "About"}
            </AnimatedLink>
            <AnimatedLink
              href="/#work"
              onClick={(event) => go(event, "/#work")}
              className={activeSection === "work" ? styles.active : undefined}
            >
              <span>01 /</span>
              {locale === "nb" ? "Prosjekter" : "Work"}
            </AnimatedLink>
            <AnimatedLink
              href="/#expertise"
              onClick={(event) => go(event, "/#expertise")}
              className={
                activeSection === "expertise" ? styles.active : undefined
              }
            >
              <span>02 /</span>
              {locale === "nb" ? "Ekspertise" : "Expertise"}
            </AnimatedLink>
            <AnimatedLink
              href="/#signal"
              onClick={(event) => go(event, "/#signal")}
              className={activeSection === "signal" ? styles.active : undefined}
            >
              <span>03 /</span>
              {locale === "nb" ? "Levende signal" : "Live signal"}
            </AnimatedLink>
            <AnimatedLink
              href="/#contact"
              onClick={(event) => go(event, "/#contact")}
              className={
                activeSection === "contact" ? styles.active : undefined
              }
            >
              <span>04 /</span>
              {t.navContact}
            </AnimatedLink>
          </div>
          {/* <div className={styles.menuFooter}>
            <AnimatedLink
              href="mailto:hei@kennethjorgensen.no"
              className={styles.menuContact}
            >
              {locale === "nb" ? "Ta kontakt" : "Get in touch"}
            </AnimatedLink>
            <span>Bodø / 67° N 14° E</span>
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={`${t.languageSwitchLabel}: ${locale === "nb" ? "English" : "Norsk"}`}
            >
              {locale === "nb" ? "English" : "Norsk"}
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Nav;
