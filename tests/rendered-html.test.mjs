import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("contains the Korean museum concierge experience", async () => {
  const [page, client] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/museum-ask.tsx", root), "utf8"),
  ]);
  assert.match(page, /미술관에 물어보기/);
  assert.match(page, /온라인 감상이 가능한 미술관 알려줘/);
  assert.match(client, /20~40초/);
  assert.match(client, /useState\(""\)/);
  assert.match(client, /asked \|\| loading \|\| error/);
  assert.doesNotMatch(page, /codex-preview|Your site is taking shape/);
});

test("discloses AI use, operator identity, and policy links (OECD compliance)", async () => {
  const [page, client, aiNotice, privacy, about] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/museum-ask.tsx", root), "utf8"),
    readFile(new URL("app/ai-notice/page.tsx", root), "utf8"),
    readFile(new URL("app/privacy/page.tsx", root), "utf8"),
    readFile(new URL("app/about/page.tsx", root), "utf8"),
  ]);

  // OECD Consumer Protection in E-commerce: operator identification + complaint route
  assert.match(page, /이볼라르\(Evolar\)/);
  assert.match(page, /mailto:evollardevollard@gmail\.com/);
  assert.match(about, /운영자 정보/);
  assert.match(about, /불만 및 분쟁 해결 절차/);

  // OECD AI Principles: transparency that answers are AI-generated + human escalation path
  assert.match(client, /생성형 AI가 작성한 참고용 정보/);
  assert.match(aiNotice, /OECD AI 원칙/);
  assert.match(aiNotice, /사람의 관여와 이의제기/);

  // OECD Privacy Guidelines: purpose specification, third-party processor disclosure, retention
  assert.match(client, /OpenAI\(미국\)로 전송/);
  assert.match(privacy, /OECD 개인정보보호 가이드라인/);
  assert.match(privacy, /자체 서버나 데이터베이스에 저장하지/);

  // Policy pages are linked from the main experience
  assert.match(page, /\/ai-notice/);
  assert.match(page, /\/privacy/);
  assert.match(page, /\/about/);
});

test("uses official web search and safe fallback responses", async () => {
  const source = await readFile(new URL("app/api/ask/route.ts", root), "utf8");
  assert.match(source, /web_search/);
  assert.match(source, /gpt-5\.6-luna/);
  assert.match(source, /discoveryIntent/);
  assert.match(source, /진심으로 죄송합니다/);
  assert.match(source, /world-class museum curator/);
  assert.match(source, /Korean, English, French, and Simplified Chinese/);
  assert.match(source, /Never infer or guess a person's identity/);
  assert.match(source, /Never fabricate an answer/);
  assert.match(source, /plain text only/i);
  assert.match(source, /culturally natural language/);
  assert.match(source, /D’après les informations officielles/);
  assert.match(source, /Veuillez indiquer/);
  assert.match(source, /Pourriez-vous, s’il vous plaît/);
  assert.match(source, /根据目前查询到的官方信息/);
  assert.match(source, /replace\(\/\[#\*\]\//);
});
