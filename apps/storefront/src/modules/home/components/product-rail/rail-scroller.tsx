"use client"

import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { clx } from "@modules/common/components/ui"

/**
 * Horizontal, scroll-snapping list. Touch users swipe; pointer users on wide
 * screens get previous/next buttons that appear only when there is more to see.
 */
const RailScroller = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [canScroll, setCanScroll] = useState({ back: false, forward: false })

  const updateScrollState = useCallback(() => {
    const list = listRef.current
    if (!list) return
    setCanScroll({
      back: list.scrollLeft > 4,
      forward: list.scrollLeft + list.clientWidth < list.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(list)
    return () => observer.disconnect()
  }, [updateScrollState])

  const scrollByPage = (direction: 1 | -1) => {
    const list = listRef.current
    list?.scrollBy({
      left: direction * list.clientWidth * 0.9,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      <ul
        ref={listRef}
        onScroll={updateScrollState}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 xsmall:gap-4 small:mx-0 small:scroll-px-0 small:gap-5 small:px-0"
      >
        {children}
      </ul>
      <ScrollButton
        direction="back"
        visible={canScroll.back}
        onClick={() => scrollByPage(-1)}
      />
      <ScrollButton
        direction="forward"
        visible={canScroll.forward}
        onClick={() => scrollByPage(1)}
      />
    </div>
  )
}

const ScrollButton = ({
  direction,
  visible,
  onClick,
}: {
  direction: "back" | "forward"
  visible: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === "back" ? "Scroll back" : "Scroll forward"}
    tabIndex={visible ? 0 : -1}
    aria-hidden={!visible}
    className={clx(
      "absolute top-[30%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-grey-10 bg-white text-navy-900 shadow-card-hover transition-opacity hover:text-brand-700 small:flex",
      direction === "back" ? "-left-5" : "-right-5",
      visible ? "opacity-100" : "pointer-events-none opacity-0"
    )}
  >
    {direction === "back" ? <ChevronLeft /> : <ChevronRight />}
  </button>
)

export default RailScroller
