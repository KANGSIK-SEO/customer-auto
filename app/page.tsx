import Link from "next/link";
import { MuseumAsk } from "./museum-ask";

const suggestions = [
  "온라인 감상이 가능한 미술관 알려줘",
  "DBS에서 사기 피해가 의심되면 어떻게 해?",
  "보험금 청구는 어디에 접수해?",
  "유엔은 개인에게 장학금을 주나요?",
  "브라질 난민 신청은 비용이 드나요?",
];

export default function Home() {
  return (
    <main>
      <header className="masthead">
        <a className="brand" href="#top" aria-label="아트 컨시어지 홈">
          ART CONCIERGE
        </a>
        <span className="edition">VISITOR DESK · SEOUL</span>
      </header>

      <section id="top" className="hero" aria-labelledby="page-title">
        <p className="eyebrow">WORLDWIDE EVIDENCE DESK</p>
        <h1 id="page-title">글로벌 고객상담에 물어보기</h1>
        <p className="intro">
          미술관 방문, 은행 사기·거래, 보험 청구, UN·UNHCR 시민 안내를 물어보세요.
          공식 FAQ와 출처가 있는 온톨로지 자료만 근거로 삼고, 모르는 내용은 추측하지 않습니다.
        </p>
      </section>

      <MuseumAsk suggestions={suggestions} />

      <footer>
        <div className="footer-meta">
          <p>ART CONCIERGE · 운영자: 이볼라르(evollard)</p>
          <p className="muted">
            문의·오류 신고·이의제기:{" "}
            <a href="mailto:evollardevollard@gmail.com">evollardevollard@gmail.com</a>
          </p>
          <p className="muted">중요한 결정 전 해당 기관의 최신 공식 안내를 한 번 더 확인해 주세요.</p>
        </div>
        <nav className="footer-links" aria-label="정책 및 서비스 안내">
          <Link href="/ai-notice">AI 시스템 안내</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/about">서비스 소개·이용안내</Link>
        </nav>
      </footer>
    </main>
  );
}
