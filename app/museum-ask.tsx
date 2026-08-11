"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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
    <section className="ask-section" aria-label="글로벌 고객상담 질문">
      <form className="ask-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="museum-question">
          고객상담 질문
        </label>
        <input
          id="museum-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="예: 승인하지 않은 카드 거래는 어떻게 신고해?"
          autoComplete="off"
          maxLength={500}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? "확인 중" : "질문"}
        </button>
      </form>

      <p className="input-notice">
        이 서비스는 AI가 공식 자료를 검색해 답변을 생성합니다. 입력하신 질문은 답변
        생성을 위해 OpenAI(미국)로 전송되어 처리되며, 별도 계정이나 서버 데이터베이스에
        저장하지 않습니다. 이름, 연락처 등 개인정보는 입력하지 말아 주세요. 자세한 내용은{" "}
        <Link href="/privacy">개인정보처리방침</Link>과{" "}
        <Link href="/ai-notice">AI 시스템 안내</Link>를 참고하세요.
      </p>

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
          {answer && !loading && (
            <p className="ai-disclaimer">
              이 답변은 생성형 AI가 공식 출처와 온톨로지 자료를 바탕으로 작성한 참고용
              정보이며 해당 기관의 공식 답변이나 금융·보험·법률 자문이 아닙니다.
              사실과 다르거나 오래된 내용이 포함될 수 있으니 중요한 결정 전
              반드시 해당 기관에 다시 확인해 주세요. 답변에 오류가 있거나
              이의를 제기하고 싶다면{" "}
              <a href="mailto:evollardevollard@gmail.com">evollardevollard@gmail.com</a>
              으로 알려 주세요.
            </p>
          )}
        </article>
      )}
    </section>
  );
}
