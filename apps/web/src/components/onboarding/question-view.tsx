"use client";

import type { Answers, Question } from "@/lib/onboarding/types";
import { SingleSelect } from "./inputs/single-select";
import { ScaleSlider } from "./inputs/scale-slider";
import { DualSlider } from "./inputs/dual-slider";
import { SemanticSlider } from "./inputs/semantic-slider";
import { CapsuleSlider } from "./inputs/capsule-slider";
import { GoldenHours } from "./inputs/golden-hours";

export function QuestionView({
  question,
  answers,
  setAnswer,
}: {
  question: Question;
  answers: Answers;
  setAnswer: (key: string, value: Answers[string]) => void;
}) {
  const Icon = question.icon;
  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <div className="flex flex-col items-center text-center">
        <Icon className="h-12 w-12 text-brand" strokeWidth={1.5} />
        <h1 className="mt-6 text-2xl font-extrabold sm:text-3xl">{question.title}</h1>
        {question.subtitle ? (
          <p className="mt-2 text-muted">{question.subtitle}</p>
        ) : null}
      </div>

      <div className="mt-10">{renderInput(question, answers, setAnswer)}</div>
    </div>
  );
}

function renderInput(
  q: Question,
  answers: Answers,
  setAnswer: (key: string, value: Answers[string]) => void,
) {
  switch (q.kind) {
    case "single":
      return (
        <SingleSelect
          options={q.options}
          value={answers[q.id] as string | undefined}
          onChange={(v) => setAnswer(q.id, v)}
        />
      );
    case "scale":
      return (
        <ScaleSlider
          min={q.min}
          max={q.max}
          step={q.step}
          value={(answers[q.id] as number) ?? q.default}
          onChange={(v) => setAnswer(q.id, v)}
          valueLabel={q.valueLabel}
        />
      );
    case "dual":
      return (
        <DualSlider
          left={q.left}
          right={q.right}
          values={{
            [q.left.key]: (answers[q.left.key] as number) ?? q.left.default,
            [q.right.key]: (answers[q.right.key] as number) ?? q.right.default,
          }}
          onChange={(key, v) => setAnswer(key, v)}
        />
      );
    case "semantic":
      return (
        <SemanticSlider
          leftLabel={q.leftLabel}
          rightLabel={q.rightLabel}
          value={(answers[q.id] as number) ?? q.default}
          onChange={(v) => setAnswer(q.id, v)}
          centerLabel={q.centerLabel}
        />
      );
    case "capsule":
      return (
        <CapsuleSlider
          value={(answers[q.id] as number) ?? q.default}
          onChange={(v) => setAnswer(q.id, v)}
          valueLabel={q.valueLabel}
        />
      );
    case "curve":
      return (
        <GoldenHours
          hours={q.hours}
          values={(answers[q.id] as number[]) ?? q.hours.map(() => q.default)}
          onChange={(vals) => setAnswer(q.id, vals)}
        />
      );
  }
}
