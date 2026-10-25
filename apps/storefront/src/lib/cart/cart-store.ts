"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

import { calculateCartTotals } from "./totals"
import type { CartLine } from "./types"

/**
 * Client-side cart persisted to localStorage and shared across components and
 * browser tabs. It is the single place cart state lives, so moving the cart
 * to a backend later only means changing how `persist`/`load` work here.
 */

const STORAGE_KEY = "toolshop.cart.v1"

type CartState = {
  lines: CartLine[]
  isDrawerOpen: boolean
  hydrated: boolean
}

const EMPTY_STATE: CartState = { lines: [], isDrawerOpen: false, hydrated: false }

let state: CartState = EMPTY_STATE
const listeners = new Set<() => void>()

function emit(next: CartState) {
  state = next
  listeners.forEach((listener) => listener())
}

function load(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory cart still works.
  }
}

function setLines(lines: CartLine[]) {
  persist(lines)
  emit({ ...state, lines })
}

function hydrate() {
  if (state.hydrated) return
  emit({ ...state, lines: load(), hydrated: true })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  hydrate()

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) emit({ ...state, lines: load() })
  }
  window.addEventListener("storage", onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

const clampQuantity = (quantity: number, max: number) =>
  Math.max(1, Math.min(quantity, Math.max(max, 1)))

export const cartActions = {
  addItem(line: Omit<CartLine, "quantity">, quantity = 1, openDrawer = true) {
    const existing = state.lines.find((l) => l.id === line.id)
    const lines = existing
      ? state.lines.map((l) =>
          l.id === line.id
            ? {
                ...l,
                ...line,
                quantity: clampQuantity(l.quantity + quantity, line.maxQuantity),
              }
            : l
        )
      : [
          ...state.lines,
          { ...line, quantity: clampQuantity(quantity, line.maxQuantity) },
        ]

    persist(lines)
    emit({ ...state, lines, isDrawerOpen: openDrawer || state.isDrawerOpen })
  },

  updateQuantity(lineId: string, quantity: number) {
    setLines(
      state.lines.map((l) =>
        l.id === lineId
          ? { ...l, quantity: clampQuantity(quantity, l.maxQuantity) }
          : l
      )
    )
  },

  removeItem(lineId: string) {
    setLines(state.lines.filter((l) => l.id !== lineId))
  },

  clear() {
    setLines([])
  },

  openDrawer() {
    emit({ ...state, isDrawerOpen: true })
  },

  closeDrawer() {
    emit({ ...state, isDrawerOpen: false })
  },
}

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY_STATE
  )

  const totals = useMemo(
    () => calculateCartTotals(snapshot.lines),
    [snapshot.lines]
  )

  const getLine = useCallback(
    (lineId: string) => snapshot.lines.find((l) => l.id === lineId),
    [snapshot.lines]
  )

  return {
    lines: snapshot.lines,
    totals,
    isDrawerOpen: snapshot.isDrawerOpen,
    /** False during SSR and the first client render; avoid flashing "empty cart" before it is true. */
    isReady: snapshot.hydrated,
    getLine,
    ...cartActions,
  }
}
