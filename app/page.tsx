import { MuseumAsk } from "./museum-ask";

const suggestions = [
  "온라인 감상이 가능한 미술관 알려줘",
  "메트로폴리탄 입장료 얼마야?",
  "국립중앙박물관 월요일에도 열어?",
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
        <p className="eyebrow">MUSEUM VISITOR GUIDE</p>
        <h1 id="page-title">미술관에 물어보기</h1>
        <p className="intro">
          관람 시간, 입장료, 예약, 환불, 접근성, 사진 촬영 등 방문 안내를
          물어보세요. 모르는 내용은 추측하지 않고 공식 확인을 안내해 드립니다.
        </p>
      </section>

      <MuseumAsk suggestions={suggestions} />

      <footer>
        <p>ART CONCIERGE</p>
        <p>방문 전 공식 미술관 안내를 한 번 더 확인해 주세요.</p>
      </footer>
    </main>
  );
}
