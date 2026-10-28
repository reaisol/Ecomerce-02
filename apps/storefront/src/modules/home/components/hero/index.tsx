"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "./hero.module.css"

const slides = [
  {
    id: "festive",
    label: "The festive edit",
    detail: "A little extra joy",
    kicker: "COLOUR. CULTURE. CELEBRATION.",
    title: "A little festive.",
    highlight: "A lot of fabulous.",
    description:
      "Bring a little more colour to every celebration. Discover your next favourite with trushop.",
    cta: "Explore the store",
    href: "/store",
    image: "/images/home/banner-festive.png",
    alt: "Festive Indian fashion with blue silk drapes, golden lanterns and colourful gifts",
    accent: "#ffda79",
    colour: "#063d61",
  },
  {
    id: "suiting",
    label: "Suitings & shirtings",
    detail: "Make an impression",
    kicker: "THE WELL-DRESSED EDIT",
    title: "Own the room.",
    highlight: "Wear your style.",
    description:
      "Sharp silhouettes. Effortless confidence. Find inspiration for your next standout look.",
    cta: "Discover the collection",
    href: "/store",
    image: "/images/home/suitings-shirtings.jpeg",
    alt: "Man wearing a tailored navy jacket and crisp white shirt",
    accent: "#a6e6ff",
    colour: "#083b70",
  },
  {
    id: "devotional",
    label: "Devotional",
    detail: "Moments that matter",
    kicker: "A LITTLE LIGHT. A LITTLE PEACE.",
    title: "Light up",
    highlight: "the everyday.",
    description:
      "A space for faith, tradition and meaningful moments. Explore our Devotional category.",
    cta: "Explore Devotional",
    href: "/categories/devotional",
    image: "/images/home/banner-devotional.png",
    alt: "Glowing brass diyas, a puja thali and marigolds against a rich teal backdrop",
    accent: "#ffdb91",
    colour: "#064d50",
  },
  {
    id: "style",
    label: "Everyday style",
    detail: "Fresh perspective",
    kicker: "FRESH COLOUR. FRESH PERSPECTIVE.",
    title: "Everyday looks.",
    highlight: "Extraordinary you.",
    description:
      "Give your wardrobe a fresh point of view. Explore shirts and easy-to-wear favourites.",
    cta: "Explore fashion",
    href: "/categories/fashion",
    image: "/images/home/banner-style.png",
    alt: "Linen shirt styling with bright cobalt and coral studio architecture",
    accent: "#ffc9a4",
    colour: "#193d85",
  },
]

export default function Hero() {
  const [position, setPosition] = useState(0)
  const active = position % slides.length
  const [animate, setAnimate] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotion = () => setReducedMotion(media.matches)
    const syncVisibility = () => setVisible(!document.hidden)
    syncMotion()
    syncVisibility()
    media.addEventListener("change", syncMotion)
    document.addEventListener("visibilitychange", syncVisibility)
    return () => {
      media.removeEventListener("change", syncMotion)
      document.removeEventListener("visibilitychange", syncVisibility)
    }
  }, [])

  useEffect(() => {
    if (!playing || focused || reducedMotion || !visible) return
    const timer = window.setInterval(
      () => setPosition((n) => Math.min(n + 1, slides.length)),
      3000,
    )
    return () => window.clearInterval(timer)
  }, [playing, focused, reducedMotion, visible])

  useEffect(() => {
    if (animate) return
    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setAnimate(true))
    })
    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [animate])

  // If motion preferences change during the wrap, no transition event may fire.
  useEffect(() => {
    if (reducedMotion && position === slides.length) setPosition(0)
  }, [reducedMotion, position])

  const select = (index: number) => {
    setPosition((index + slides.length) % slides.length)
  }

  return (
    <section
      className={`content-container ${styles.section}`}
      aria-label="Featured collections"
    >
      <div className={styles.ribbon}>
        <span className={styles.ribbonBrand}>THE TRUSHOP EDIT</span>
        <span>Discover a little more extraordinary</span>
        <span className={styles.ribbonEnd}>
          Made for your everyday <span aria-hidden="true">✦</span>
        </span>
      </div>
      <div
        className={styles.carousel}
        role="region"
        aria-roledescription="carousel"
        aria-label="Shopping inspiration"
        onFocusCapture={(event) =>
          setFocused((event.target as HTMLElement).closest("a") !== null)
        }
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setFocused(false)
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault()
            select(active + 1)
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault()
            select(active - 1)
          }
        }}
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          }
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return
          const dx = event.changedTouches[0].clientX - touchStart.current.x
          const dy = event.changedTouches[0].clientY - touchStart.current.y
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy))
            select(active + (dx < 0 ? 1 : -1))
          touchStart.current = null
        }}
      >
        <div className={styles.stage}>
          <div
            className={styles.track}
            style={{
              transform: `translateX(-${position * 100}%)`,
              transition: animate && !reducedMotion ? undefined : "none",
            }}
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.propertyName === "transform" &&
                position === slides.length
              ) {
                setAnimate(false)
                setPosition(0)
              }
            }}
          >
            {[...slides, slides[0]].map((slide, index) => (
              <article
                key={`${slide.id}-${index}`}
                id={`hero-slide-${index}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(index % slides.length) + 1} of ${slides.length}: ${slide.label}`}
                aria-hidden={index !== active || index === slides.length}
                className={`${styles.slide} ${index === active ? styles.active : ""} ${slide.id === "suiting" ? styles.suiting : ""}`}
                style={
                  {
                    "--accent": slide.accent,
                    "--base": slide.colour,
                  } as React.CSSProperties
                }
              >
                <div className={styles.art}>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 90vw"
                    priority={index === 0}
                    className={styles.photo}
                  />
                </div>
                <div className={styles.shade} aria-hidden="true" />
                <div className={styles.content}>
                  <span className={styles.kicker}>
                    <span aria-hidden="true">✦</span> {slide.kicker}
                  </span>
                  {index === 0 ? (
                    <h1 className={styles.title}>
                      {slide.title}
                      <em>{slide.highlight}</em>
                    </h1>
                  ) : (
                    <h2 className={styles.title}>
                      {slide.title}
                      <em>{slide.highlight}</em>
                    </h2>
                  )}
                  <p className={styles.description}>{slide.description}</p>
                  <LocalizedClientLink
                    href={slide.href}
                    className={styles.cta}
                    tabIndex={
                      index === active && index < slides.length ? 0 : -1
                    }
                  >
                    {slide.cta} <span aria-hidden="true">↗</span>
                  </LocalizedClientLink>
                  <span className={styles.signature}>
                    A fresh find. A little delight. <strong>trushop.</strong>
                  </span>
                </div>
                <span className={styles.edition} aria-hidden="true">
                  0{(index % slides.length) + 1} / THE TRUSHOP EDIT
                </span>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.dots} aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              aria-controls={`hero-slide-${index}`}
              aria-current={index === active ? "true" : undefined}
              aria-label={`Show slide ${index + 1}: ${slide.label}`}
              onClick={() => select(index)}
              className={styles.dotButton}
            >
              <span
                className={`${styles.dot} ${index === active ? styles.selectedDot : ""}`}
              />
            </button>
          ))}
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className={styles.play}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>
          )}
        </div>
        <span className={styles.srOnly} aria-live={playing ? "off" : "polite"}>
          {slides[active].label}, slide {active + 1} of 4
        </span>
      </div>
    </section>
  )
}
