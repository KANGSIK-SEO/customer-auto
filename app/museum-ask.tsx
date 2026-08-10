"use client";

import { FormEvent, useState } from "react";

type Props = { suggestions: string[] };

export function MuseumAsk({ suggestions }: Props) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("온라인으로 갤러리 감상 안돼?");
  const [answer, setAnswer] = useState(
    "판정: 지금 질문만으로는 됩니다/안 됩니다를 정확히 판단할 수 없습니다. 정확한 미술관을 특정하지 못해 진심으로 죄송합니다.\n\n이유: 온라인 관람, 입장료, 촬영 규정과 담당자 연락처는 미술관과 지점마다 다릅니다.\n\n대체 답안: 미술관의 정확한 이름과 도시를 알려주시면 공식 규정, FAQ, 온라인 컬렉션, 문의 페이지까지 확인해 결론과 담당자 연락처를 찾아드리겠습니다.",
  );
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

      <article className="answer" aria-live="polite" aria-busy={loading}>
        <p className="question"><strong>Q</strong><span>{asked}</span></p>
        {loading ? (
          <p className="loading">공식 사이트와 규정을 끝까지 검색하고 있습니다. 답변까지 약 20~40초 걸릴 수 있습니다…</p>
        ) : (
          <p className="answer-copy">{answer}</p>
        )}
        {error && <p className="error" role="alert">{error}</p>}
      </article>
    </section>
  );
}
