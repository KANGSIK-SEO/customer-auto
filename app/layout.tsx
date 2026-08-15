import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask About Every Museum in the World | Art Concierge",
  description:
    "관람 시간, 입장료, 예약, 접근성 등 전 세계 미술관 방문 안내를 물어보세요. Ask about museum hours, admission, and accessibility worldwide, in Korean, English, French, and Chinese.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
