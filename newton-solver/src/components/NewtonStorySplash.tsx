"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import styles from "./NewtonStorySplash.module.css";
import newtonImg from "../assets/newton.jpg";

type NewtonStorySplashProps = {
  onScrollToCalc?: () => void;
};

export default function NewtonStorySplash({ onScrollToCalc }: NewtonStorySplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

    /**
     * gsap.context() scopes all animations to this component and
     * cleans them up automatically on unmount via ctx.revert().
     */
    const ctx = gsap.context(() => {
      const container = containerRef.current!;

      /**
       * Helper: select ONE element inside this component by its CSS-module class.
       * styles.foo resolves to the real hashed class, e.g. "NewtonStorySplash_foo__abc"
       * so the querySelector string works correctly on the DOM.
       */
      const q = (cls: string) =>
        container.querySelector<HTMLElement>(`.${cls}`);

  

      /* ─────────────────────────────────────────────
         HERO TITLE — entrance animation on load
         Sequence: line draws → label fades → title
         chars pop in → year range fades up.
      ───────────────────────────────────────────── */
      const splitHero = new SplitText(q(styles.heroTitle), { type: "words,chars" });

      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from(q(styles.heroLine), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.out",
        })
        .from(q(styles.heroLabel), {
          opacity: 0,
          y: 8,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.4")
        .from(splitHero.chars, {
          opacity: 0,
          y: 22,
          duration: 0.75,
          ease: "circ.out",
          stagger: 0.022,
          onComplete: () => splitHero.revert(),
        }, "-=0.2")
        .from(q(styles.heroSub), {
          opacity: 0,
          y: 10,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.35")
        .from(q(styles.heroDivider), {
          opacity: 0,
          duration: 0.8,
          ease: "power1.out",
        }, "-=0.5");

      /* ─────────────────────────────────────────────
         CHAPTER 01 — ISAAC NEWTON  (parallax cluster)
      ───────────────────────────────────────────── */
      const clusterNewton = q(styles.clusterNewton);

      gsap.set(q(styles.circleNewton),   { yPercent: -5 });
      gsap.set(q(styles.dotsGold),       { yPercent: 10 });
      gsap.set(q(styles.portraitNewton), { yPercent: -20 });
      gsap.set(clusterNewton,            { yPercent: 5 });

      gsap.to(q(styles.circleNewton), {
        yPercent: 5, ease: "none",
        scrollTrigger: { trigger: clusterNewton, scrub: 1 },
      });
      gsap.to(q(styles.dotsGold), {
        yPercent: -10, ease: "none",
        scrollTrigger: { trigger: clusterNewton, scrub: 1 },
      });
      gsap.to(q(styles.portraitNewton), {
        yPercent: 20, ease: "none",
        scrollTrigger: { trigger: clusterNewton, scrub: 1 },
      });
      gsap.to(q(styles.captionNewton), {
        yPercent: 100, ease: "none",
        scrollTrigger: { trigger: clusterNewton, end: "bottom center", scrub: 1 },
      });
      gsap.to(clusterNewton, {
        yPercent: -5, ease: "none",
        scrollTrigger: { trigger: clusterNewton, end: "bottom center", scrub: 1 },
      });

      /* ─────────────────────────────────────────────
         CHAPTER 02 — JOSEPH RAPHSON  (parallax cluster)
      ───────────────────────────────────────────── */
      const clusterRaphson = q(styles.clusterRaphson);

      gsap.set(q(styles.triangle),        { yPercent: 10, rotation: -90 });
      gsap.set(q(styles.dotsWhite),       { yPercent: 10 });
      gsap.set(q(styles.portraitRaphson), { yPercent: -20 });
      gsap.set(clusterRaphson,            { yPercent: 5 });

      gsap.to(q(styles.triangle), {
        yPercent: -5, rotation: 40, ease: "none",
        scrollTrigger: { trigger: clusterRaphson, scrub: 1 },
      });
      gsap.to(q(styles.dotsWhite), {
        yPercent: -10, ease: "none",
        scrollTrigger: { trigger: clusterRaphson, scrub: 1 },
      });
      gsap.to(q(styles.portraitRaphson), {
        yPercent: 20, ease: "none",
        scrollTrigger: { trigger: clusterRaphson, scrub: 1 },
      });
      gsap.to(q(styles.captionRaphson), {
        yPercent: 200, ease: "none",
        scrollTrigger: { trigger: clusterRaphson, end: "bottom center", scrub: 1 },
      });
      gsap.to(clusterRaphson, {
        yPercent: -5, ease: "none",
        scrollTrigger: { trigger: clusterRaphson, end: "bottom center", scrub: 1 },
      });

      /* ─────────────────────────────────────────────
         SPLITTEXT — Newton title (plays on load)
      ───────────────────────────────────────────── */
      const splitNewton = new SplitText(q(styles.titleNewton), { type: "words,chars" });
      gsap
        .timeline({ onComplete: () => splitNewton.revert() })
        .from(splitNewton.chars, {
          duration: 0.8,
          opacity: 0,
          y: 10,
          ease: "circ.out",
          stagger: 0.02,
        });

      /* ─────────────────────────────────────────────
         SPLITTEXT — Raphson title (scroll-triggered)
      ───────────────────────────────────────────── */
      function setupRaphsonSplit() {
        const splitRaphson = new SplitText(q(styles.titleRaphson), { type: "words,chars" });
        gsap.timeline().from(splitRaphson.chars, {
          duration: 0.8,
          opacity: 0,
          y: 10,
          ease: "circ.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: q(styles.titleRaphson),
            start: "top 75%",
            end: "bottom center",
            scrub: 1,
          },
        });
      }

      ScrollTrigger.addEventListener("refresh", setupRaphsonSplit);
      setupRaphsonSplit();

    }, containerRef); // ← scope to this component

    /* Cleanup on unmount */
    return () => ctx.revert();
  }, [onScrollToCalc]);

  /* ═══════════════════════════════════════════════
     JSX
  ═══════════════════════════════════════════════ */
  return (
    <div ref={containerRef} className={styles.storyWrapper}>

    

      {/* ────────────────────────────────────────
          STORY BODY
      ──────────────────────────────────────── */}
      <div className={styles.storyBody}>

        {/* ── HERO TITLE ── */}
        <div className={styles.heroBlock}>
          {/* Animated horizontal rule */}
          <div className={styles.heroLine} />

          {/* Small uppercase label */}
          <p className={styles.heroLabel}>A brief history</p>

          {/* Main title — SplitText targets this */}
          <h2 className={styles.heroTitle}>
            Two Minds,{" "}
            <em>One Method</em>
          </h2>

          {/* Year range */}
          <p className={styles.heroSub}>1669 &ndash; 1690</p>
        </div>

        {/* Fade-in divider between hero and first chapter */}
        <div className={styles.heroDivider} />

        {/* ── CHAPTER 01: ISAAC NEWTON ── */}
        <section className={styles.storySection}>
          <div className={`${styles.title} ${styles.titleNewton}`}>
            <span>Isaac Newton</span> laid the groundwork for the method in
            1669 in his unpublished manuscript{" "}
            <em>De analysi per aequationes numero terminorum infinitas</em>,
            where he described a geometric technique for refining roots of
            polynomial equations one step at a time.
          </div>
        </section>

        <section className={`${styles.cluster} ${styles.clusterNewton}`}>
          {/* Gold decorative circle */}
          <div className={`${styles.clusterPieces} ${styles.circleNewton}`} />

          {/* Newton portrait */}
          <div className={`${styles.clusterPieces} ${styles.portraitNewton}`}>
            <img
              src={newtonImg.src}
              alt="Portrait of Sir Isaac Newton, painted by Godfrey Kneller in 1689"
            />
            <div className={`${styles.caption} ${styles.captionNewton}`}>
              <span>/01</span>&nbsp; ISAAC NEWTON · 1669
            </div>
          </div>

          {/* Decorative dots */}
          <img
            className={`${styles.clusterPieces} ${styles.dotsGold}`}
            src="https://www.micelistudios.com/sandbox/scrolltrigger/imgs/dots_blue_494x434.svg"
            alt=""
            aria-hidden="true"
          />
        </section>

        {/* ── CHAPTER 02: JOSEPH RAPHSON ── */}
        <section className={styles.storySection}>
          <div className={`${styles.title} ${styles.titleRaphson}`}>
            <span>Joseph Raphson</span> published a simpler, independent form
            of the iteration in 1690 in{" "}
            <em>Analysis Aequationum Universalis</em>, generalising it beyond
            polynomials to any differentiable function — giving us the
            algorithm exactly as it is taught today.
          </div>
        </section>

        <section className={`${styles.cluster} ${styles.clusterRaphson}`}>
          {/* Rotating triangle decoration */}
          <img
            className={`${styles.clusterPieces} ${styles.triangle}`}
            src="https://www.micelistudios.com/sandbox/scrolltrigger/imgs/triangle_448x446.svg"
            alt=""
            aria-hidden="true"
          />

          {/* Raphson "portrait" — formula card (no known portrait exists) */}
          <div className={`${styles.clusterPieces} ${styles.portraitRaphson}`}>
            <div className={styles.raphsonPlaceholder}>
              <div className={styles.raphsonFormula}>
                x<sub>n+1</sub> = x<sub>n</sub> &minus; f(x<sub>n</sub>) /
                f&prime;(x<sub>n</sub>)
              </div>
            </div>
            <div className={`${styles.caption} ${styles.captionRaphson}`}>
              <span>/02</span>&nbsp; JOSEPH RAPHSON · 1690
            </div>
          </div>

          {/* Decorative white dots */}
          <img
            className={`${styles.clusterPieces} ${styles.dotsWhite}`}
            src="https://www.micelistudios.com/sandbox/scrolltrigger/imgs/dots_white_310x588.svg"
            alt=""
            aria-hidden="true"
          />
        </section>

        {/* ── Bottom spacer so the last cluster can finish scrolling ── */}
        <section className={styles.spacer} />
      </div>
    </div>
  );
}
