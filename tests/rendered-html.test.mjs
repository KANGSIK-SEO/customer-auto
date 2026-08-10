import assert from "node:assert/strict";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(path = "/", init) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, init),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Korean museum concierge", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /미술관에 물어보기/);
  assert.match(html, /메트로폴리탄 입장료/);
  assert.match(html, /추측하지 않고/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("asks for a museum name without calling OpenAI", async () => {
  const response = await render("/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "온라인으로 갤러리 감상 안돼?" }),
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.match(data.answer, /진심으로 죄송합니다/);
  assert.match(data.answer, /이유:/);
  assert.match(data.answer, /대체 답안:/);
});

test("does not reject museum discovery questions for lacking one museum name", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/api/ask/route.ts", import.meta.url), "utf8"),
  );
  assert.match(source, /discoveryIntent/);
  assert.match(source, /추천·목록 질문/);
});
