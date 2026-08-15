"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { Lang, Translations } from "./i18n";

type Props = { lang: Lang; t: Translations };

type Evidence = {
  id: string;
  domain: "banking" | "insurance" | "united_nations";
  institution: string;
  country: string;
  question: string;
  sourceUrl: string;
  verifiedOn: string;
  relevanceScore: number;
};

export function MuseumAsk({ lang, t }: Props) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(value: string) {
    const nextQuestion = value.trim();
    if (!nextQuestion || loading) return;

    setLoading(true);
    setError("");
    setAsked(nextQuestion);
    setAnswer("");
    setEvidence([]);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion }),
      });
      const data = (await response.json()) as {
        answer?: string;
        evidence?: Evidence[];
        error?: string;
      };
      if (!response.ok || !data.answer) {
        const fallback =
          response.status === 400
            ? t.errorInput
            : response.status === 503
              ? t.errorConfig
              : t.errorConnect;
        throw new Error(fallback);
      }
      setAnswer(data.answer);
      setEvidence(data.evidence ?? []);
      setQuestion("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <section className="ask-section" aria-label={t.askSectionAria}>
      <form className="ask-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="museum-question">
          {t.questionLabel}
        </label>
        <input
          id="museum-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          maxLength={500}
          lang={lang}
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? t.askButtonLoading : t.askButton}
        </button>
      </form>

      <p className="input-notice">
        {t.noticeBefore}
        <Link href="/privacy">{t.privacyLabel}</Link>
        {t.noticeMiddle}
        <Link href="/ai-notice">{t.aiNoticeLabel}</Link>
        {t.noticeAfter}
      </p>

      <div className="suggestions" aria-label={t.suggestionsAria}>
        {t.suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => void ask(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      {(asked || loading || error) && (
        <article className="answer" aria-live="polite" aria-busy={loading}>
          {asked && (
            <p className="question">
              <strong>Q</strong>
              <span>{asked}</span>
            </p>
          )}
          {loading ? (
            <p className="loading">{t.loading}</p>
          ) : answer ? (
            <>
              <p className="answer-copy">{answer}</p>
              {evidence.length > 0 && (
                <section className="evidence-panel" aria-labelledby="evidence-heading">
                  <h2 id="evidence-heading">{t.evidenceHeading}</h2>
                  <p className="evidence-intro">{t.evidenceIntro}</p>
                  <ul className="evidence-list">
                    {evidence.map((item) => (
                      <li key={item.id}>
                        <div className="evidence-meta">
                          <span>{t.domainLabels[item.domain]}</span>
                          <span>{item.country}</span>
                          <time dateTime={item.verifiedOn}>
                            {t.verifiedPrefix} {item.verifiedOn}
                          </time>
                        </div>
                        <strong>{item.institution}</strong>
                        <p>{item.question}</p>
                        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                          {t.sourceLink}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : null}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {answer && !loading && (
            <p className="ai-disclaimer">
              {t.disclaimerBefore}
              <a href="mailto:evollardevollard@gmail.com">evollardevollard@gmail.com</a>
              {t.disclaimerAfter}
            </p>
          )}
        </article>
      )}
    </section>
  );
}
