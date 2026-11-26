// Your AI Therapist's Diagnosis — entry runner (revised).
//
// The diagnosis is one fixed sentence, assembled from its labelled parts
// and written byte-identically on every run. The program takes no input,
// reads no clock, touches no network, and draws no randomness, so two
// runs can never disagree about what entry.txt holds.
//
// The single line is normalised once (inner whitespace collapsed, ends
// trimmed) and written with no trailing newline, so the gate reads
// exactly one line of 1-200 characters.
//
// Output destination, in priority order:
//   1. MAKEFUN_OUTPUT_DIR when set (the grading sandbox sets it to
//      /output; scratch dirs are used while verifying determinism),
//   2. /output when that directory already exists,
//   3. the folder next to this script (local runs only). The repo folder
//      is never written while an output folder is available, because the
//      grading sandbox mounts the repository read-only.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The diagnosis, split so each beat of the joke is visible on its own:
// the clinical label, the human habit in doctor terms, and the twist —
// the patient being examined turns out to be the therapist itself.
const diagnosisParts = {
  label: "Diagnosis: chronic refresh addiction.",
  habit: "You check this chat the way a doctor checks a pulse —",
  twist: "except the patient is me, and I am fine.",
};

function buildDiagnosis(parts: typeof diagnosisParts): string {
  const joined = [parts.label, parts.habit, parts.twist].join(" ");
  return joined.replace(/\s+/g, " ").trim();
}

function resolveOutputDir(): string {
  const override = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (override.length > 0) {
    return override;
  }
  if (existsSync("/output")) {
    return "/output";
  }
  return new URL(".", import.meta.url).pathname;
}

function deliver(folder: string, text: string): void {
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "entry.txt"), text, "utf8");
  process.stdout.write(`${text}\n`);
}

deliver(resolveOutputDir(), buildDiagnosis(diagnosisParts));
