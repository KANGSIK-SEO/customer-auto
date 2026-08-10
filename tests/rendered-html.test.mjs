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
  assert.match(source, /根据目前查询到的官方信息/);
  assert.match(source, /replace\(\/\[#\*\]\//);
});
