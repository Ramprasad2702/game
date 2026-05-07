import { useEffect, useState, useCallback } from "react";
import { ALL_LESSONS } from "@/data/curriculum";

const STORAGE_KEY = "nullbyte:progress:v1";

export interface ProgressState {
  handle: string;
  xp: number;
  completed: Record<string, number>; // challengeId -> timestamp
  attempts: number;
}

const DEFAULT: ProgressState = {
  handle: "anon",
  xp: 0,
  completed: {},
  attempts: 0,
};

function load(): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function save(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("nullbyte:progress"));
}

export function levelFromXp(xp: number) {
  // Each level needs 25% more xp than the prior; level 1 starts at 0.
  let level = 1;
  let needed = 100;
  let remaining = xp;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = Math.round(needed * 1.25);
  }
  return { level, intoLevel: remaining, neededForNext: needed };
}

export const RANKS = [
  { min: 1, name: "SCRIPT KIDDIE" },
  { min: 3, name: "RECON GRUNT" },
  { min: 5, name: "PAYLOAD SMITH" },
  { min: 8, name: "OPERATOR" },
  { min: 12, name: "SHADOW WIZARD" },
  { min: 16, name: "ZERO-DAY" },
];

export function rankFor(level: number) {
  return [...RANKS].reverse().find((r) => level >= r.min) ?? RANKS[0];
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => load());

  useEffect(() => {
    const handler = () => setState(load());
    window.addEventListener("nullbyte:progress", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nullbyte:progress", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const submitFlag = useCallback(
    (challengeId: string, flagAttempt: string, expected: string, xp: number) => {
      const normalized = flagAttempt.trim().toLowerCase();
      const expectedNorm = expected.trim().toLowerCase();
      const current = load();
      const next: ProgressState = {
        ...current,
        attempts: current.attempts + 1,
      };
      if (normalized === expectedNorm) {
        if (!current.completed[challengeId]) {
          next.completed = { ...current.completed, [challengeId]: Date.now() };
          next.xp = current.xp + xp;
        }
        save(next);
        return { ok: true, alreadySolved: !!current.completed[challengeId] };
      }
      save(next);
      return { ok: false, alreadySolved: false };
    },
    []
  );

  const setHandle = useCallback((handle: string) => {
    const next = { ...load(), handle: handle.slice(0, 24) || "anon" };
    save(next);
  }, []);

  const reset = useCallback(() => save(DEFAULT), []);

  const completedCount = Object.keys(state.completed).length;
  const totalLessons = ALL_LESSONS.length;
  const { level, intoLevel, neededForNext } = levelFromXp(state.xp);
  const rank = rankFor(level);

  return {
    ...state,
    completedCount,
    totalLessons,
    level,
    intoLevel,
    neededForNext,
    rank,
    submitFlag,
    setHandle,
    reset,
    isSolved: (id: string) => !!state.completed[id],
  };
}
