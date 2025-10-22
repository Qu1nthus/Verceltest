import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Chaos Warband quiz with dynamic warband matching.
// Each result now names specific warbands reflecting the player's choices and tendencies.

import QUESTIONS from "./questions";

const FACTIONS = {
  A: {
    name: "World Eaters (Khorne-aligned)",
    blurb: "A storm of chain-teeth and fury. Shock assault, martial pride, brutal discipline when it matters.",
    palette: "bg-red-50 border-red-200",
    warbands: {
      legions: ["World Eaters"],
      notable: ["Brazen Beasts", "Butcherhorde (Khârn)", "Skullfiend Tribe"],
    },
  },
  B: {
    name: "Emperor's Children (Slaanesh-aligned)",
    blurb: "Aesthetes of atrocity. Precision dueling, terror-as-theatre, and perfection pursued to damnation.",
    palette: "bg-fuchsia-50 border-fuchsia-200",
    warbands: {
      legions: ["Emperor's Children"],
      notable: ["The Flawless Host", "The Violators", "Creations of Bile"],
    },
  },
  C: {
    name: "Iron Warriors (Siege Masters)",
    blurb: "Methodical, logistical, and unyielding. War as engineering; victory as inevitability.",
    palette: "bg-slate-50 border-slate-200",
    warbands: {
      legions: ["Iron Warriors", "Death Guard"],
      notable: ["The Purge", "The Cleaved", "Steel Brethren"],
    },
  },
  D: {
    name: "Thousand Sons (Tzeentch-aligned)",
    blurb: "Scholars of the Warp; covens of witchfire. Fate rewritten by glyph and gun.",
    palette: "bg-cyan-50 border-cyan-200",
    warbands: {
      legions: ["Thousand Sons", "Word Bearers"],
      notable: ["Prodigal Sons (Ahriman)", "The Scourged", "Coven of the Shrouded Sun"],
    },
  },
  E: {
    name: "Alpha Legion / Red Corsairs (Cunning & Opportunism)",
    blurb: "Infiltration, subterfuge, and piracy. Empires fall to knives in the dark and forged sigils.",
    palette: "bg-emerald-50 border-emerald-200",
    warbands: {
      legions: ["Alpha Legion", "Black Legion", "Night Lords"],
      notable: ["Red Corsairs", "Crimson Slaughter", "Hounds of Abaddon"],
    },
  },
} as const;

type Key = keyof typeof FACTIONS;

export default function ChaosWarbandQuiz() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Key[]>([]);
  const total = QUESTIONS.length;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (idx >= total) return;
      const map: Record<string, Key> = { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E" };
      const key = map[e.key];
      if (key) choose(key);
      if (e.key === "Backspace") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, answers]);

  function choose(key: Key) {
    if (idx >= total) return;
    setAnswers((a) => {
      const next = [...a];
      next[idx] = key;
      return next;
    });
    if (idx < total - 1) setIdx((i) => i + 1);
    else setIdx(total);
  }

  function prev() {
    if (idx > 0) setIdx((i) => i - 1);
  }

  function restart() {
    setIdx(0);
    setAnswers([]);
  }

  const progress = Math.min(idx, total) / total;

  const tally = useMemo(() => {
    const t: Record<Key, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    answers.forEach((k) => (t[k] += 1));
    return t;
  }, [answers]);

  const best = useMemo(() => {
    const entries = Object.entries(tally) as [Key, number][];
    const max = Math.max(...entries.map(([, n]) => n));
    const top = entries.filter(([, n]) => n === max).map(([k]) => k);
    return { max, top };
  }, [tally]);

  const dynamicWarband = (key: Key) => {
    const w = FACTIONS[key].warbands.notable;
    const pick = w[Math.floor(Math.random() * w.length)];
    return pick;
  };

  const ResultCard = () => {
    const top = best.top as Key[];
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Chaos Alignment</h2>
          <button onClick={restart} className="text-sm underline opacity-80 hover:opacity-100">
            Restart
          </button>
        </div>

        {top.map((k) => (
          <div key={k} className={`border ${FACTIONS[k].palette} rounded-2xl p-4 mb-4`}>
            <div className="text-lg font-bold">{FACTIONS[k].name}</div>
            <div className="text-sm opacity-80 mt-1">{FACTIONS[k].blurb}</div>
            <div className="mt-3 text-sm">
              You most resemble commanders of the <span className="font-semibold">{dynamicWarband(k)}</span> — warriors known for their {k === "A" ? "brutal devotion and berserker fury" : k === "B" ? "hedonistic artistry and sonic terror" : k === "C" ? "siegecraft, attrition, and grim resolve" : k === "D" ? "warp mastery and occult cunning" : "espionage, piracy, and manipulation"}.
            </div>

            <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Major Traitor Legions</div>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {FACTIONS[k].warbands.legions.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Notable Warbands</div>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {FACTIONS[k].warbands.notable.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {top.length > 1 && (
          <p className="text-xs mt-4 opacity-70">
            Tie detected — the Dark Gods quarrel. Pick by mood: raw fury (A), exquisite terror (B), siege logic (C), arcana (D), or espionage (E).
          </p>
        )}

        <div className="mt-6 text-sm">
          <h3 className="font-semibold">Your spread</h3>
          <div className="mt-2 flex gap-2 flex-wrap">
            {Object.entries(tally).map(([k, v]) => (
              <div key={k} className="px-3 py-1 rounded-full bg-black/5 text-xs">
                {FACTIONS[k as Key].name.split(" ")[0]}: <span className="font-semibold ml-1">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Which Chaos Warband Should You Join?</h1>
          <p className="text-sm opacity-70 mt-1">Answer 20 questions. Use 1–5 to choose, Backspace to go back.</p>
        </header>

        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-black/70"
            style={{ width: `${Math.round(progress * 100)}%` }}
            aria-hidden
          />
        </div>

        <AnimatePresence mode="wait">
          {idx < total ? (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="border rounded-2xl p-5 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Question {idx + 1} / {total}</div>
                {idx > 0 && (
                  <button onClick={prev} className="text-xs underline opacity-80 hover:opacity-100">Back</button>
                )}
              </div>
              <h2 className="mt-3 text-lg md:text-xl font-semibold leading-snug">{QUESTIONS[idx].prompt}</h2>
              <div className="mt-4 grid gap-2">
                {QUESTIONS[idx].options.map((opt, i) => (
                  <button
                    key={opt.key}
                    onClick={() => choose(opt.key as Key)}
                    className="group w-full text-left border rounded-xl px-3 py-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/30"
                  >
                    <span className="mr-2 inline-flex w-6 h-6 items-center justify-center text-xs font-mono border rounded-md group-hover:bg-black/10">{i + 1}</span>
                    <span className="font-semibold mr-1">{opt.key}.</span> {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="border rounded-2xl bg-white shadow-sm"
            >
              <ResultCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
