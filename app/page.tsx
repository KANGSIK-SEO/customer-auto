"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MuseumAsk } from "./museum-ask";
import { LANGUAGES, detectInitialLang, persistLang, translations, type Lang } from "./i18n";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(detectInitialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    persistLang(lang);
  }, [lang]);

  const t = translations[lang];

  return (
    <main>
      <header className="masthead">
        <a className="brand" href="#top" aria-label={t.brandAria}>
          ART CONCIERGE
        </a>
        <div className="masthead-right">
          <span className="edition">{t.edition}</span>
          <nav className="lang-switch" aria-label="Language / 언어 / Langue / 语言">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={lang === code ? "active" : ""}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section id="top" className="hero" aria-labelledby="page-title">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 id="page-title">{t.title}</h1>
        <p className="intro">{t.intro}</p>
      </section>

      <MuseumAsk lang={lang} t={t} />

      <footer>
        <div className="footer-meta">
          <p>{t.footerOperator}</p>
          <p className="muted">
            {t.footerContactBefore}
            <a href="mailto:evollardevollard@gmail.com">evollardevollard@gmail.com</a>
          </p>
          <p className="muted">{t.footerReminder}</p>
        </div>
        <nav className="footer-links" aria-label="Policies">
          <Link href="/ai-notice">{t.footerAiNotice}</Link>
          <Link href="/privacy">{t.footerPrivacy}</Link>
          <Link href="/about">{t.footerAbout}</Link>
        </nav>
      </footer>
    </main>
  );
}
