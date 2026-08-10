import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 소개·이용안내 | Art Concierge",
  description: "OECD 전자상거래 소비자보호 가이드라인에 따른 아트 컨시어지 운영자 정보와 이용안내.",
};

export default function AboutPage() {
  return (
    <main className="policy-main">
      <Link className="back-link" href="/">← 아트 컨시어지로 돌아가기</Link>
      <h1>서비스 소개·이용안내</h1>
      <p className="lede">
        이 페이지는 OECD 전자상거래 소비자보호 가이드라인의 취지에 따라 운영자
        정보, 서비스 성격, 불만·분쟁 해결 절차를 안내합니다.
      </p>

      <h2>운영자 정보</h2>
      <ul>
        <li>서비스명: 아트 컨시어지 (ART CONCIERGE)</li>
        <li>운영자: 이볼라르(Evolar) · 대표 서강식</li>
        <li>연락처: <a href="mailto:evollardevollard@gmail.com">evollardevollard@gmail.com</a></li>
        <li>사업자 등록 정보는 위 연락처로 문의하시면 안내해 드립니다.</li>
      </ul>

      <h2>서비스 성격</h2>
      <p>
        아트 컨시어지는 미술관·박물관 방문 관련 질문에 AI가 공식 자료를 검색해
        참고용 정보를 제공하는 안내 서비스입니다. 특정 미술관·박물관이 공식
        운영하는 채널이 아니며, 이 서비스를 통한 결제, 예약, 티켓 구매 등의 거래는
        발생하지 않습니다. 현재 무료로 제공됩니다.
      </p>

      <h2>정확성에 관한 안내</h2>
      <p>
        답변은 생성형 AI가 검색 시점의 공식 자료를 근거로 작성한 참고 정보이며,
        실제 미술관의 최신 정책과 다를 수 있습니다. 입장, 예약, 환불, 촬영 등
        중요한 사항은 방문 전 반드시 해당 기관의 공식 채널로 다시 확인해 주시기
        바랍니다. 자세한 AI 관련 안내는{" "}
        <Link href="/ai-notice">AI 시스템 안내</Link> 페이지를 참고하세요.
      </p>

      <h2>불만 및 분쟁 해결 절차</h2>
      <ol>
        <li>답변 오류, 부적절한 표현, 기타 불편 사항을 이메일로 접수합니다.</li>
        <li>운영자가 접수 내용을 확인하고, 가능한 빠르게 회신합니다.</li>
        <li>필요한 경우 답변 로직이나 안내 문구를 수정합니다.</li>
      </ol>
      <p>
        접수처: <a href="mailto:evollardevollard@gmail.com">evollardevollard@gmail.com</a>
      </p>

      <h2>개인정보</h2>
      <p>
        입력하신 질문의 처리 방식은 <Link href="/privacy">개인정보처리방침</Link>에서
        확인하실 수 있습니다.
      </p>
    </main>
  );
}
