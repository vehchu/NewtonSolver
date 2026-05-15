"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import styles from "./NewtonStorySplash.module.css";
import newtonImg from "../assets/newton.jpg";

/**
 * Manual SplitText fallback: wraps characters/words in spans for animation.
 * This avoids the dependency on the premium GSAP SplitText plugin.
 */
function manualSplit(element: HTMLElement, type: "chars" | "words") {
  const text = element.innerText;
  element.innerHTML = "";
  
  if (type === "chars") {
    return text.split("").map(char => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      element.appendChild(span);
      return span;
    });
  } else {
    return text.split(" ").map(word => {
      const span = document.createElement("span");
      span.innerText = word + "\u00A0";
      span.style.display = "inline-block";
      element.appendChild(span);
      return span;
    });
  }
}

type NewtonStorySplashProps = {
  /** Called once the user has scrolled to the end of the story. */
  onDone: () => void;
};

export default function NewtonStorySplash({ onDone }: NewtonStorySplashProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const overlay = overlayRef.current!;
    const container = containerRef.current!;

    /**
     * Helper: select ONE element inside this component by its CSS-module class.
     */
    const q = (cls: string) =>
      container.querySelector<HTMLElement>(`.${cls}`);

    /**
     * Dismiss the overlay with a smooth fade-out, then call onDone.
     */
    function dismiss() {
      // Kill all scroll-related triggers so the page doesn't lock
      ScrollTrigger.getAll().forEach((t) => t.kill());

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          overlay.style.display = "none";
          document.body.style.overflow = "";
          onDone();
        },
      });
    }

    /**
     * gsap.context() scopes all animations and cleans them up on unmount.
     */
    const ctx = gsap.context(() => {
      /* ─────────────────────────────────────────────
         Lock body scroll while splash is active.
      ───────────────────────────────────────────── */
      document.body.style.overflow = "hidden";

      /* ─────────────────────────────────────────────
         HERO TITLE — entrance animation on load.
      ───────────────────────────────────────────── */
      const heroTitleEl = q(styles.heroTitle);
      let heroChars: HTMLElement[] = [];

      if (heroTitleEl) {
        heroChars = manualSplit(heroTitleEl, "chars");
      }

      const heroTl = gsap.timeline({ delay: 0.3 });

      if (q(styles.heroLine)) {
        heroTl.from(q(styles.heroLine), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.out",
        });
      }

      if (q(styles.heroLabel)) {
        heroTl.from(
          q(styles.heroLabel),
          { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" },
          "-=0.4"
        );
      }

      if (heroChars.length > 0) {
        heroTl.from(
          heroChars,
          {
            opacity: 0,
            y: 22,
            duration: 0.75,
            ease: "circ.out",
            stagger: 0.022,
          },
          "-=0.2"
        );
      }

      if (q(styles.heroSub)) {
        heroTl.from(
          q(styles.heroSub),
          { opacity: 0, y: 10, duration: 0.6, ease: "power2.out" },
          "-=0.35"
        );
      }

      if (q(styles.heroDivider)) {
        heroTl.from(
          q(styles.heroDivider),
          { opacity: 0, duration: 0.8, ease: "power1.out" },
          "-=0.5"
        );
      }

      /* ─────────────────────────────────────────────
         SCROLL INDICATOR — fade out after first scroll
      ───────────────────────────────────────────── */
      const indicator = scrollIndicatorRef.current;
      if (indicator) {
        container.addEventListener(
          "scroll",
          () => {
            gsap.to(indicator, { opacity: 0, duration: 0.4, ease: "power1.out" });
          },
          { once: true }
        );
      }

      /* ─────────────────────────────────────────────
         NEWTON SECTION TITLE
      ───────────────────────────────────────────── */
      const newtonTitleEl = q(styles.titleNewton);
      if (newtonTitleEl) {
        const chars = manualSplit(newtonTitleEl, "chars");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: newtonTitleEl,
              scroller: container,
              start: "top 80%",
              end: "bottom center",
            },
          })
          .from(chars, {
            duration: 0.8,
            opacity: 0,
            y: 14,
            ease: "circ.out",
            stagger: 0.02,
          });
      }

      /* ─────────────────────────────────────────────
         CHAPTER 01 — ISAAC NEWTON (parallax)
      ───────────────────────────────────────────── */
      const clusterNewton = q(styles.clusterNewton);
      if (clusterNewton) {
        const circleEl = q(styles.circleNewton);
        const dotsGoldEl = q(styles.dotsGold);
        const portraitNewtonEl = q(styles.portraitNewton);
        const captionNewtonEl = q(styles.captionNewton);

        if (circleEl) gsap.set(circleEl, { yPercent: -5 });
        if (dotsGoldEl) gsap.set(dotsGoldEl, { yPercent: 10 });
        if (portraitNewtonEl) gsap.set(portraitNewtonEl, { yPercent: -20 });

        const stConfig = { trigger: clusterNewton, scroller: container, scrub: 1 };
        if (circleEl) gsap.to(circleEl, { yPercent: 5, ease: "none", scrollTrigger: stConfig });
        if (dotsGoldEl) gsap.to(dotsGoldEl, { yPercent: -10, ease: "none", scrollTrigger: stConfig });
        if (portraitNewtonEl) gsap.to(portraitNewtonEl, { yPercent: 20, ease: "none", scrollTrigger: stConfig });
        if (captionNewtonEl) {
          gsap.to(captionNewtonEl, {
            yPercent: 100,
            ease: "none",
            scrollTrigger: { ...stConfig, end: "bottom center" },
          });
        }
      }

      /* ─────────────────────────────────────────────
         RAPHSON SECTION TITLE
      ───────────────────────────────────────────── */
      const raphsonTitleEl = q(styles.titleRaphson);
      if (raphsonTitleEl) {
        const chars = manualSplit(raphsonTitleEl, "chars");
        gsap
          .timeline({
            scrollTrigger: {
              trigger: raphsonTitleEl,
              scroller: container,
              start: "top 80%",
              end: "bottom center",
              scrub: 1,
            },
          })
          .from(chars, {
            duration: 0.8,
            opacity: 0,
            y: 14,
            ease: "circ.out",
            stagger: 0.02,
          });
      }

      /* ─────────────────────────────────────────────
         CHAPTER 02 — JOSEPH RAPHSON (parallax)
      ───────────────────────────────────────────── */
      const clusterRaphson = q(styles.clusterRaphson);
      if (clusterRaphson) {
        const triangleEl = q(styles.triangle);
        const dotsWhiteEl = q(styles.dotsWhite);
        const portraitRaphsonEl = q(styles.portraitRaphson);
        const captionRaphsonEl = q(styles.captionRaphson);

        if (triangleEl) gsap.set(triangleEl, { yPercent: 10, rotation: -90 });
        if (dotsWhiteEl) gsap.set(dotsWhiteEl, { yPercent: 10 });
        if (portraitRaphsonEl) gsap.set(portraitRaphsonEl, { yPercent: -20 });

        const stConfigR = { trigger: clusterRaphson, scroller: container, scrub: 1 };
        if (triangleEl) gsap.to(triangleEl, { yPercent: -5, rotation: 40, ease: "none", scrollTrigger: stConfigR });
        if (dotsWhiteEl) gsap.to(dotsWhiteEl, { yPercent: -10, ease: "none", scrollTrigger: stConfigR });
        if (portraitRaphsonEl) gsap.to(portraitRaphsonEl, { yPercent: 20, ease: "none", scrollTrigger: stConfigR });
        if (captionRaphsonEl) {
          gsap.to(captionRaphsonEl, {
            yPercent: 200,
            ease: "none",
            scrollTrigger: { ...stConfigR, end: "bottom center" },
          });
        }
      }

      /* ─────────────────────────────────────────────
         END TRIGGER — dismiss when reached
      ───────────────────────────────────────────── */
      const spacerEl = q(styles.spacer);
      if (spacerEl) {
        ScrollTrigger.create({
          trigger: spacerEl,
          scroller: container,
          start: "top bottom", // Trigger as soon as the spacer enters the viewport
          onEnter: () => dismiss(),
        });
      }

    }, containerRef);

    /* Wire skip button click */
    const skipBtn = skipBtnRef.current;
    const handleSkip = () => dismiss();
    skipBtn?.addEventListener("click", handleSkip);

    /* Cleanup on unmount */
    return () => {
      ctx.revert();
      skipBtn?.removeEventListener("click", handleSkip);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div ref={overlayRef} className={styles.splashOverlay}>
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <div className={styles.scrollDot} />
        <span>scroll</span>
      </div>

      <button ref={skipBtnRef} className={styles.skipBtn} aria-label="Skip intro">
        Skip intro <span className={styles.skipArrow}>↓</span>
      </button>

      <div ref={containerRef} className={styles.storyWrapper}>
        <div className={styles.storyBody}>
          <div className={styles.heroBlock}>
            <div className={styles.heroLine} />
            <p className={styles.heroLabel}>A brief history</p>
            <h2 className={styles.heroTitle}>Two Minds, <em>One Method</em></h2>
            <p className={styles.heroSub}>1669 &ndash; 1690</p>
          </div>

          <div className={styles.heroDivider} />

          <section className={styles.storySection}>
            <div className={`${styles.title} ${styles.titleNewton}`}>
              <span>Isaac Newton</span> laid the groundwork for the method in
              1669 in his unpublished manuscript <em>De analysi...</em>,
              describing a geometric technique for refining roots.
            </div>
          </section>

          <section className={`${styles.cluster} ${styles.clusterNewton}`}>
            <div className={`${styles.clusterPieces} ${styles.circleNewton}`} />
            <div className={`${styles.clusterPieces} ${styles.portraitNewton}`}>
              <img src={(newtonImg as { src: string }).src} alt="Isaac Newton" />
              <div className={`${styles.caption} ${styles.captionNewton}`}>
                <span>/01</span>&nbsp; ISAAC NEWTON · 1669
              </div>
            </div>
            <img className={`${styles.clusterPieces} ${styles.dotsGold}`} 
                 src="https://www.micelistudios.com/sandbox/scrolltrigger/imgs/dots_blue_494x434.svg" alt="" />
          </section>

          <section className={styles.storySection}>
            <div className={`${styles.title} ${styles.titleRaphson}`}>
              <span>Joseph Raphson</span> published a simpler form in 1690,
              generalising it beyond polynomials to any differentiable function.
            </div>
          </section>

          <section className={`${styles.cluster} ${styles.clusterRaphson}`}>
            <img className={`${styles.clusterPieces} ${styles.triangle}`} 
                 src="https://www.micelistudios.com/sandbox/scrolltrigger/imgs/triangle_448x446.svg" alt="" />
            <div className={`${styles.clusterPieces} ${styles.portraitRaphson}`}>
              <div className={styles.raphsonPlaceholder}>
                <div className={styles.raphsonFormula}>
                  x<sub>n+1</sub> = x<sub>n</sub> &minus; f(x<sub>n</sub>) / f&prime;(x<sub>n</sub>)
                </div>
              </div>
              <div className={`${styles.caption} ${styles.captionRaphson}`}>
                <span>/02</span>&nbsp; JOSEPH RAPHSON · 1690
              </div>
            </div>
            <img className={`${styles.clusterPieces} ${styles.dotsWhite}`} 
                 src="https://www.micelistudios.com/sandbox/scrolltrigger/imgs/dots_white_310x588.svg" alt="" />
          </section>

          {/* Tall spacer to ensure the ScrollTrigger fires reliably */}
          <section className={styles.spacer} />
        </div>
      </div>
    </div>
  );
}
