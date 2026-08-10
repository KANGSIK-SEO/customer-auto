import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_KR({ variable: "--font-sans", subsets: ["latin"] });
const serif = Noto_Serif_KR({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "미술관에 물어보기 | Art Concierge",
  description: "관람 시간, 입장료, 예약, 접근성 등 미술관 방문 안내를 물어보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
