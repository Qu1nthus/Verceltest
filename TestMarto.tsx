import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------------------------------------------
// Chaos Warband Quiz — Lean React App (Expanded Results)
// - 20 questions, 6 options (A–F), ephemeral state
// - Expanded results: Major Traitor Legions ranking + Notable Warbands
// - Self-tests to validate config (act as runtime test cases)
// ------------------------------------------------------------

export type Option = { key: "A" | "B" | "C" | "D" | "E" | "F"; label: string };
export type Question = { prompt: string; options: Option[] };

const QUESTIONS: Question[] = [
  { prompt: "How do you approach an enemy stronghold?", options: [
      { key: "A", label: "Charge headlong into the fray, weapon roaring." },
      { key: "B", label: "Seduce its defenders into betrayal." },
      { key: "C", label: "Lay siege until they rot behind their walls." },
      { key: "D", label: "Shatter their morale with illusions and psychic storms." },
      { key: "E", label: "Sabotage the defenses before the battle even begins." },
      { key: "F", label: "Descend upon them in the dark and leave no survivors." },
  ]},
  { prompt: "What motivates you to wage war?", options: [
      { key: "A", label: "The thrill of battle and the taste of victory." },
      { key: "B", label: "The pursuit of sensation and mastery." },
      { key: "C", label: "The endurance of corruption and decay eternal." },
      { key: "D", label: "A desire to uncover forbidden truths." },
      { key: "E", label: "The chance to manipulate events unseen." },
      { key: "F", label: "The joy of terrorizing the weak." },
  ]},
  { prompt: "How do you deal with failure in your ranks?", options: [
      { key: "A", label: "Punish swiftly and violently." },
      { key: "B", label: "Twist their suffering into a lesson of beauty." },
      { key: "C", label: "Let disease take those who falter." },
      { key: "D", label: "Reforge them through arcane means." },
      { key: "E", label: "Erase them and rewrite the record." },
      { key: "F", label: "Display them as an example to others." },
  ]},
  { prompt: "Your ideal weapon is...", options: [
      { key: "A", label: "A roaring chainaxe or power fist." },
      { key: "B", label: "A whip or sonic blade that sings." },
      { key: "C", label: "A rusted scythe dripping with toxins." },
      { key: "D", label: "A staff of crystal, charged with sorcery." },
      { key: "E", label: "A concealed blade and a false smile." },
      { key: "F", label: "A flensing talon and a cruel laugh." },
  ]},
  { prompt: "What kind of leader are you?", options: [
      { key: "A", label: "An example of martial ferocity." },
      { key: "B", label: "A charismatic visionary of excess." },
      { key: "C", label: "A patient commander who endures all." },
      { key: "D", label: "A strategist guided by hidden knowledge." },
      { key: "E", label: "A ghost who moves pieces across the board." },
      { key: "F", label: "A figure of dread who rules through fear." },
  ]},
  { prompt: "How do you celebrate victory?", options: [
      { key: "A", label: "With another glorious slaughter." },
      { key: "B", label: "Through indulgence and grand performance." },
      { key: "C", label: "By letting the rot settle in the conquered land." },
      { key: "D", label: "By recording every outcome for future study." },
      { key: "E", label: "By taking new identities and new prey." },
      { key: "F", label: "By broadcasting screams to the void." },
  ]},
  { prompt: "What colors adorn your armor?", options: [
      { key: "A", label: "Crimson and brass." },
      { key: "B", label: "Violet and gold." },
      { key: "C", label: "Green and rusted brown." },
      { key: "D", label: "Blue and gold runes." },
      { key: "E", label: "Stealth gray with hidden sigils." },
      { key: "F", label: "Midnight blue and bone white." },
  ]},
  { prompt: "Your preferred battlefield environment is...", options: [
      { key: "A", label: "A killing field soaked in blood." },
      { key: "B", label: "A decadent palace or stage of agony." },
      { key: "C", label: "A decaying ruin where disease festers." },
      { key: "D", label: "A shifting warp-rift under strange skies." },
      { key: "E", label: "An infiltration behind enemy lines." },
      { key: "F", label: "A city shrouded in terror and darkness." },
  ]},
  { prompt: "What does loyalty mean to you?", options: [
      { key: "A", label: "Strength proven in battle." },
      { key: "B", label: "Adoration of perfection." },
      { key: "C", label: "Resilience under any plague or siege." },
      { key: "D", label: "Obedience to destiny and fate." },
      { key: "E", label: "A tool to be used and discarded." },
      { key: "F", label: "Fear so deep it becomes faith." },
  ]},
  { prompt: "How do you see mortals of the Imperium?", options: [
      { key: "A", label: "Fodder for the blade." },
      { key: "B", label: "An audience for my grandeur." },
      { key: "C", label: "Hosts for new contagions." },
      { key: "D", label: "Ignorant minds to enlighten—or destroy." },
      { key: "E", label: "Pieces to be moved on a grander board." },
      { key: "F", label: "Prey to stalk in the dark." },
  ]},
  { prompt: "Your fortress is built...", options: [
      { key: "A", label: "From the bones of my enemies." },
      { key: "B", label: "With elegance and depraved artistry." },
      { key: "C", label: "From rusted iron and living flesh." },
      { key: "D", label: "Upon runes that defy reality." },
      { key: "E", label: "In secrecy, hidden from all eyes." },
      { key: "F", label: "In the ruins of a dead city." },
  ]},
  { prompt: "When the gods whisper, you...", options: [
      { key: "A", label: "Roar in answer and charge forward." },
      { key: "B", label: "Dance to their rhythm." },
      { key: "C", label: "Listen patiently, awaiting decay’s wisdom." },
      { key: "D", label: "Interpret their words through symbols and code." },
      { key: "E", label: "Twist their command to your own ends." },
      { key: "F", label: "Mock them as you bleed others for their amusement." },
  ]},
  { prompt: "Your opinion of the Imperium is...", options: [
      { key: "A", label: "A weak corpse unworthy of survival." },
      { key: "B", label: "A tragic failure of potential and art." },
      { key: "C", label: "A festering wound waiting to rot away." },
      { key: "D", label: "A delusion that must be dismantled logically." },
      { key: "E", label: "A mask I can wear to deceive." },
      { key: "F", label: "A terrified empire ripe for nightmare." },
  ]},
  { prompt: "How do you view daemons?", options: [
      { key: "A", label: "As tools of war and fury." },
      { key: "B", label: "As muses of creation and pain." },
      { key: "C", label: "As inevitable companions in decay." },
      { key: "D", label: "As beings of knowledge to bargain with." },
      { key: "E", label: "As entities to manipulate for my gain." },
      { key: "F", label: "As horrors to unleash upon others." },
  ]},
  { prompt: "How do you conquer a world?", options: [
      { key: "A", label: "Through blood and fire." },
      { key: "B", label: "Through corruption of its culture." },
      { key: "C", label: "By waiting until pestilence does my work." },
      { key: "D", label: "By unraveling its fate from within." },
      { key: "E", label: "By deception and sabotage." },
      { key: "F", label: "By terror and psychological warfare." },
  ]},
  { prompt: "Your most valued trait is...", options: [
      { key: "A", label: "Courage and fury." },
      { key: "B", label: "Charm and perfection." },
      { key: "C", label: "Patience and endurance." },
      { key: "D", label: "Wisdom and foresight." },
      { key: "E", label: "Cunning and adaptability." },
      { key: "F", label: "Cruelty and fearlessness." },
  ]},
  { prompt: "What do you seek in the Warp?", options: [
      { key: "A", label: "Glory in endless battle." },
      { key: "B", label: "Pleasure beyond mortal sensation." },
      { key: "C", label: "Peace through decay and stillness." },
      { key: "D", label: "Knowledge forbidden to mortals." },
      { key: "E", label: "Power through manipulation." },
      { key: "F", label: "Dominion through fear." },
  ]},
  { prompt: "When all is lost, you...", options: [
      { key: "A", label: "Fight until death takes you." },
      { key: "B", label: "Embrace beauty in the end." },
      { key: "C", label: "Accept decay as release." },
      { key: "D", label: "Seek escape through sorcery." },
      { key: "E", label: "Melt into the shadows to return later." },
      { key: "F", label: "Drag others into the void with you." },
  ]},
  { prompt: "How would your enemies describe you?", options: [
      { key: "A", label: "A relentless berserker." },
      { key: "B", label: "A sadistic perfectionist." },
      { key: "C", label: "An unkillable plague." },
      { key: "D", label: "A manipulative sorcerer." },
      { key: "E", label: "A phantom or conspirator." },
      { key: "F", label: "A living nightmare." },
  ]},
  { prompt: "What will remain after your crusade ends?", options: [
      { key: "A", label: "Skulls and ashes." },
      { key: "B", label: "Art and echoes of pleasure." },
      { key: "C", label: "Rot and rebirth." },
      { key: "D", label: "Truths carved into the void." },
      { key: "E", label: "A legacy of deception." },
      { key: "F", label: "Fear eternal." },
  ]},
];

// ---------------- Factions + Warband metadata ----------------
const FACTIONS = {
  A: {
    name: "World Eaters",
    palette: "bg-red-50 border-red-200",
    warbands: {
      legions: ["World Eaters"],
      notable: ["Brazen Beasts", "Butcherhorde (Khârn)", "Skullfiend Tribe"],
    },
  },
  B: {
    name: "Emperor's Children",
    palette: "bg-pink-50 border-pink-200",
    warbands: {
      legions: ["Emperor's Children"],
      notable: ["The Flawless Host", "The Violators", "Creations of Bile"],
    },
  },
  C: {
    name: "Death Guard",
    palette: "bg-green-50 border-green-200",
    warbands: {
      legions: ["Death Guard", "Iron Warriors"],
      notable: ["The Purge", "The Cleaved", "Apostles of Contagion"],
    },
  },
  D: {
    name: "Thousand Sons",
    palette: "bg-cyan-50 border-cyan-200",
    warbands: {
      legions: ["Thousand Sons", "Word Bearers"],
      notable: ["Prodigal Sons (Ahriman)", "The Scourged", "Coven of the Shrouded Sun"],
    },
  },
  E: {
    name: "Alpha Legion",
    palette: "bg-emerald-50 border-emerald-200",
    warbands: {
      legions: ["Alpha Legion", "Black Legion"],
      notable: ["Red Corsairs", "Crimson Slaughter", "Hounds of Abaddon"],
    },
  },
  F: {
    name: "Night Lords",
    palette: "bg-blue-50 border-blue-200",
    warbands: {
      legions: ["Night Lords", "Black Legion"],
      notable: ["The Bleeding Eyes", "Claw of Deltrian", "Krypteia Cells"],
    },
  },
} as const;

type Key = keyof typeof FACTIONS;

export default function ChaosWarbandQuiz() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Key[]>([]);
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const total = QUESTIONS.length;

  // ---------------- Runtime self-tests ("test cases") ----------------
  useEffect(() => {
    const errs: string[] = [];
    if (QUESTIONS.length !== 20) errs.push(`Expected 20 questions, found ${QUESTIONS.length}.`);
    QUESTIONS.forEach((q, qi) => {
      if (!q.prompt?.trim()) errs.push(`Question ${qi + 1} has empty prompt.`);
      if (!Array.isArray(q.options) || q.options.length !== 6) errs.push(`Question ${qi + 1} should have 6 options.`);
      const keys = q.options.map((o) => o.key).join("");
      if (keys !== "ABCDEF") errs.push(`Question ${qi + 1} options must be in order A–F.`);
      q.options.forEach((o) => {
        if (!o.label?.trim()) errs.push(`Question ${qi + 1}, option ${o.key} has empty label.`);
      });
    });
    setConfigErrors(errs);
  }, []);

  // Keyboard shortcuts 1–6 and Backspace
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (idx >= total) return; // finished
      const map: Record<string, Key> = { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F" };
      const key = map[e.key];
      if (key) choose(key);
      if (e.key === "Backspace") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, answers, total]);

  function choose(key: Key) {
    if (idx >= total) return;
    setAnswers((a) => {
      const next = [...a];
      next[idx] = key;
      return next;
    });
    if (idx < total - 1) setIdx((i) => i + 1);
    else setIdx(total); // move to results
  }

  function prev() {
    if (idx > 0) setIdx((i) => i - 1);
  }

  function restart() {
    setIdx(0);
    setAnswers([]);
  }

  const progress = Math.min(idx, total) / total;

  // ---------------- Tally + Derived Scores ----------------
  const tally = useMemo(() => {
    const t: Record<Key, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    answers.forEach((k) => (t[k] += 1));
    return t;
  }, [answers]);

  const best = useMemo(() => {
    const entries = Object.entries(tally) as [Key, number][];
    const max = Math.max(...entries.map(([, n]) => n));
    const top = entries.filter(([, n]) => n === max).map(([k]) => k);
    return { max, top };
  }, [tally]);

  // Score Major Traitor Legions from A–F archetypes
  const legionList = [
    "Black Legion",
    "World Eaters",
    "Emperor's Children",
    "Death Guard",
    "Thousand Sons",
    "Word Bearers",
    "Iron Warriors",
    "Alpha Legion",
    "Night Lords",
  ] as const;
  type Legion = typeof legionList[number];

  const legionScores: Record<Legion, number> = useMemo(() => {
    const scores: Record<Legion, number> = Object.fromEntries(legionList.map((l) => [l, 0])) as Record<Legion, number>;
    answers.forEach((k) => {
      if (k === "A") { // fury & shock assault
        scores["World Eaters"] += 2; scores["Black Legion"] += 1;
      }
      if (k === "B") { // excess & performance
        scores["Emperor's Children"] += 2; scores["Black Legion"] += 1;
      }
      if (k === "C") { // attrition & decay
        scores["Death Guard"] += 2; scores["Iron Warriors"] += 1; scores["Black Legion"] += 1;
      }
      if (k === "D") { // arcana & fate
        scores["Thousand Sons"] += 2; scores["Word Bearers"] += 1;
      }
      if (k === "E") { // deception & subterfuge
        scores["Alpha Legion"] += 2; scores["Black Legion"] += 1; scores["Night Lords"] += 1;
      }
      if (k === "F") { // terror doctrine
        scores["Night Lords"] += 2; scores["Black Legion"] += 1;
      }
    });
    return scores;
  }, [answers]);

  const rankedLegions = useMemo(() => {
    return Object.entries(legionScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [legionScores]);

  const dynamicWarband = (k: Key) => {
    const list = FACTIONS[k].warbands.notable;
    return list[Math.floor(Math.random() * list.length)];
  };

  const ErrorPanel = () => (
    <div className="border border-red-300 bg-red-50 rounded-2xl p-4 mb-6">
      <div className="font-semibold">Configuration Errors</div>
      <ul className="list-disc list-inside mt-2 text-sm">
        {configErrors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
      <p className="text-xs mt-2 opacity-70">If any of these checks conflict with your expectations (e.g., not exactly 20 questions or 6 options), tell me and I’ll adjust.</p>
    </div>
  );

  const ResultCard = () => (
    <div className="grid gap-6">
      {/* Primary archetype(s) with linked warbands */}
      {best.top.map((k) => (
        <div key={k} className={`border ${FACTIONS[k].palette} rounded-2xl p-4`}>
          <div className="text-lg font-bold">{FACTIONS[k].name}</div>
          <div className="text-sm opacity-80 mt-1">You most resemble commanders of the <span className="font-semibold">{dynamicWarband(k)}</span>.</div>

          <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Major Traitor Legions (closest fit)</div>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {FACTIONS[k].warbands.legions.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Notable Warbands (40k)</div>
              <ul className="mt-1 list-disc list-inside space-y-1">
                {FACTIONS[k].warbands.notable.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/* Legion ranking */}
      <div className="border rounded-2xl p-4 bg-white/60">
        <h3 className="font-semibold">Closest Major Traitor Legions (Top 5)</h3>
        <ol className="mt-2 text-sm list-decimal list-inside space-y-1">
          {rankedLegions.map(([name, score]) => (
            <li key={name} className="flex items-center justify-between">
              <span>{name}</span>
              <span className="text-xs opacity-60">{score} pts</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Global warband directory (compact) */}
      <div className="border rounded-2xl p-4">
        <h3 className="font-semibold">Notable Chaos Warbands by Bent</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Khorne / Shock Assault</div>
            <p className="mt-1">Brazen Beasts, Butcherhorde, Skullfiend Tribe</p>
          </div>
          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Slaanesh / Exquisite Terror</div>
            <p className="mt-1">The Flawless Host, The Violators, Creations of Bile</p>
          </div>
          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Nurgle / Attrition</div>
            <p className="mt-1">The Purge, The Cleaved, Apostles of Contagion</p>
          </div>
          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Tzeentch / Occult</div>
            <p className="mt-1">Prodigal Sons, The Scourged, Coven of the Shrouded Sun</p>
          </div>
          <div className="md:col-span-2">
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">Undivided / Pirates / Terror</div>
            <p className="mt-1">Red Corsairs, Crimson Slaughter, Hounds of Abaddon, Night Lords Claws</p>
          </div>
        </div>
      </div>

      {/* Spread */}
      <div className="text-sm">
        <h3 className="font-semibold">Your spread</h3>
        <div className="mt-2 flex gap-2 flex-wrap">
          {Object.entries(tally).map(([k, v]) => (
            <div key={k} className="px-3 py-1 rounded-full bg-black/5 text-xs">
              {FACTIONS[k as Key].name}: <span className="font-semibold ml-1">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100svh] w-full bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Which Chaos Warband Should You Join?</h1>
          <p className="text-sm opacity-70 mt-1">Answer 20 questions. Use 1–6 to choose, Backspace to go back.</p>
        </header>

        {/* Progress bar */}
        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-black/70" style={{ width: `${Math.round(progress * 100)}%` }} aria-hidden />
        </div>

        {/* Config tests output */}
        {configErrors.length > 0 && <ErrorPanel />}

        {/* Quiz or results */}
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
                    onClick={() => choose(opt.key)}
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
            >
              <ResultCard />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-8 text-xs opacity-60">
          <p>Fan-made tool for Warhammer 40,000 roleplay flavor. Not affiliated with Games Workshop.</p>
        </footer>
      </div>
    </div>
  );
}

