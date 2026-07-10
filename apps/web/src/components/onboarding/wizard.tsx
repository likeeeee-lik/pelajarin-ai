"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { PHASES, QUESTIONS, activeQuestions } from "@/lib/onboarding/questions";
import { computeRadar } from "@/lib/onboarding/scoring";
import type { Answers, Question } from "@/lib/onboarding/types";
import { meApi } from "@/lib/api/resources";
import { setOnboardingPending } from "@/lib/session";
import { useSession } from "@/lib/use-session";
import { ProgressHeader } from "./progress-header";
import { PhaseTransition } from "./phase-transition";
import { QuestionView } from "./question-view";
import { RadarAnalysis } from "./radar-analysis";
import { ResultScreen } from "./result-screen";

type Stage = "question" | "transition" | "analysis" | "result";

function seedDefaults(): Answers {
  const a: Answers = {};
  for (const q of QUESTIONS) {
    if (q.kind === "scale" || q.kind === "semantic" || q.kind === "capsule") a[q.id] = q.default;
    else if (q.kind === "curve") a[q.id] = q.hours.map(() => q.default);
    else if (q.kind === "dual") {
      a[q.left.key] = q.left.default;
      a[q.right.key] = q.right.default;
    }
  }
  return a;
}

function isAnswered(q: Question, answers: Answers): boolean {
  if (q.kind === "single") return answers[q.id] !== undefined;
  return true; // slider/curve selalu punya nilai default
}

const phaseOrder = (id: string) => PHASES.findIndex((p) => p.id === id);

export function OnboardingWizard() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(seedDefaults);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("question");
  const shown = useRef<Set<string>>(new Set(["identitas"]));

  const active = useMemo(() => activeQuestions(answers), [answers]);
  const total = active.length;
  const current = active[Math.min(index, total - 1)];

  const scores = useMemo(() => computeRadar(answers), [answers]);
  const { signedIn } = useSession();

  /**
   * Selesai onboarding.
   * - Sudah masuk  : tandai di DB lalu ke dashboard.
   * - Belum masuk  : simpan penanda lokal, lanjut ke daftar (funnel).
   *   AppShell yang menandai di DB setelah login.
   */
  async function finishOnboarding() {
    if (!signedIn) {
      setOnboardingPending();
      router.push("/daftar");
      return;
    }
    try {
      await meApi.update({ onboardingCompleted: true });
    } catch {
      /* jangan menahan user bila API bermasalah */
    }
    router.push("/app");
  }

  // Auto-advance layar transisi fase.
  useEffect(() => {
    if (stage !== "transition") return;
    const t = setTimeout(() => setStage("question"), 1500);
    return () => clearTimeout(t);
  }, [stage, index]);

  function setAnswer(key: string, value: Answers[string]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (index >= total - 1) {
      setStage("analysis");
      return;
    }
    const nextQ = active[index + 1];
    setIndex(index + 1);
    if (
      nextQ &&
      nextQ.phase !== current.phase &&
      nextQ.phase !== "identitas" &&
      !shown.current.has(nextQ.phase)
    ) {
      shown.current.add(nextQ.phase);
      setStage("transition");
    } else {
      setStage("question");
    }
  }

  function goBack() {
    if (index > 0) {
      setIndex(index - 1);
      setStage("question");
    }
  }

  if (stage === "analysis") {
    return (
      <main className="bg-aurora min-h-screen">
        <RadarAnalysis scores={scores} onDone={() => setStage("result")} />
      </main>
    );
  }

  if (stage === "result") {
    // TODO(API): POST /onboarding { answers, scores } untuk menyimpan jawaban.
    return (
      <main className="bg-aurora min-h-screen">
        <ResultScreen
          scores={scores}
          answersCount={total}
          onStartPro={() => void finishOnboarding()}
          onSkip={() => void finishOnboarding()}
        />
      </main>
    );
  }

  if (stage === "transition") {
    const phase = PHASES[phaseOrder(current.phase)];
    return (
      <main className="bg-aurora min-h-screen">
        {phase ? <PhaseTransition phase={phase} index={phaseOrder(current.phase)} /> : null}
      </main>
    );
  }

  // stage === "question"
  const segments = PHASES.map((phase) => {
    const qs = active.filter((q) => q.phase === phase.id);
    if (qs.length === 0) return 0;
    const passed = active.slice(0, index + 1).filter((q) => q.phase === phase.id).length;
    return passed / qs.length;
  });
  const phaseLabel = PHASES[phaseOrder(current.phase)]?.label ?? "";
  const answered = isAnswered(current, answers);
  const isLast = index === total - 1;

  return (
    <main className="bg-aurora flex min-h-screen flex-col">
      <ProgressHeader segments={segments} current={index + 1} total={total} phaseLabel={phaseLabel} />

      <div className="flex flex-1 items-center py-10">
        <QuestionView question={current} answers={answers} setAnswer={setAnswer} />
      </div>

      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 pb-10">
        {index > 0 ? (
          <button
            type="button"
            onClick={goBack}
            aria-label="Kembali"
            className="grid h-12 w-12 place-items-center rounded-full border border-ink-500 text-muted transition hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <span className="h-12 w-12" />
        )}

        <button
          type="button"
          onClick={goNext}
          disabled={!answered}
          className="flex items-center gap-2 rounded-2xl bg-brand px-8 py-3.5 font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-40"
        >
          {isLast ? "Selesai" : "Lanjut"}
          {isLast ? <Check className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </main>
  );
}
