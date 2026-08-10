import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미술관에 물어보기 | Art Concierge",
  description: "관람 시간, 입장료, 예약, 접근성 등 미술관 방문 안내를 물어보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
