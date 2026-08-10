"use client";

import { FormEvent, useState } from "react";

type Props = { suggestions: string[] };

export function MuseumAsk({ suggestions }: Props) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(value: string) {
    const nextQuestion = value.trim();
    if (!nextQuestion || loading) return;

    setLoading(true);
    setError("");
    setAsked(nextQuestion);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) {
        throw new Error(data.error || "답변을 불러오지 못했습니다.");
      }
      setAnswer(data.answer);
      setQuestion("");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <section className="ask-section" aria-label="미술관 방문 안내 질문">
      <form className="ask-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="museum-question">
          미술관 방문 질문
        </label>
        <input
          id="museum-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="예: 메트로폴리탄 입장료 얼마야?"
          autoComplete="off"
          maxLength={500}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? "확인 중" : "질문"}
        </button>
      </form>

      <div className="suggestions" aria-label="질문 예시">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => void ask(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      {(asked || loading || error) && (
        <article className="answer" aria-live="polite" aria-busy={loading}>
          {asked && <p className="question"><strong>Q</strong><span>{asked}</span></p>}
          {loading ? (
            <p className="loading">공식 사이트와 규정을 끝까지 검색하고 있습니다. 답변까지 약 20~40초 걸릴 수 있습니다…</p>
          ) : answer ? (
            <p className="answer-copy">{answer}</p>
          ) : null}
          {error && <p className="error" role="alert">{error}</p>}
        </article>
      )}
    </section>
  );
}
