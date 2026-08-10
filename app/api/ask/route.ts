import { NextResponse } from "next/server";

const museumSignals = [
  "미술관", "박물관", "갤러리", "museum", "gallery", "메트로폴리탄",
  "메트", "루브르", "오르세", "테이트", "구겐하임", "모마", "moma",
  "휘트니", "국립중앙", "국립현대", "리움", "호암", "아모레퍼시픽",
  "서울시립", "대림", "뮤지엄", "아트센터", "우피치", "프라도",
];

const genericOnly = /^(온라인|인터넷|웹|거기|여기|그곳|갤러리|미술관|박물관)/i;
const discoveryIntent = /(알려\s*줘|추천|어디|목록|리스트|찾아\s*줘|가능한\s*(미술관|박물관|갤러리)|볼\s*수\s*있는|갈\s*만한)/i;

function needsMuseumName(question: string) {
  const normalized = question.toLowerCase();
  if (discoveryIntent.test(normalized)) return false;
  const hasKnownSignal = museumSignals.some((signal) => normalized.includes(signal));
  return !hasKnownSignal || genericOnly.test(normalized);
}

export async function POST(request: Request) {
  let question = "";
  try {
    const body = (await request.json()) as { question?: unknown };
    question = typeof body.question === "string" ? body.question.trim() : "";
  } catch {
    return NextResponse.json({ error: "질문 형식을 확인해 주세요." }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "질문을 입력해 주세요." }, { status: 400 });
  }

  if (question.length > 500) {
    return NextResponse.json({ error: "질문은 500자 이내로 입력해 주세요." }, { status: 400 });
  }

  if (needsMuseumName(question)) {
    return NextResponse.json({
      answer:
        "판정: 지금 질문만으로는 됩니다/안 됩니다를 정확히 판단할 수 없습니다. 정확한 미술관을 특정하지 못해 진심으로 죄송합니다.\n\n이유: 온라인 관람, 입장료, 촬영 규정과 담당자 연락처는 미술관과 지점마다 다릅니다.\n\n대체 답안: 미술관의 정확한 이름과 도시를 알려주시면 공식 규정, FAQ, 온라인 컬렉션, 문의 페이지까지 확인해 결론과 담당자 연락처를 찾아드리겠습니다. (예: “뉴욕 메트로폴리탄 미술관 온라인 관람 돼?”)",
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "답변 서비스 설정이 아직 완료되지 않았습니다." },
      { status: 503 },
    );
  }

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: `당신은 끝까지 확인하는 미술관 방문 안내 컨시어지입니다.

검색 원칙:
1. 질문에 특정 미술관이 있으면 단일 검색 결과만 보고 포기하지 마세요. 공식 홈페이지의 방문 안내, FAQ, 정책·규정, 온라인 컬렉션, 가상 투어, 보도자료, 공식 예매처, 문의·Contact 페이지 순으로 폭넓게 확인하세요.
2. 최신 정보인지 확인하고, 서로 다른 정보가 있으면 공식 출처와 최근 게시 내용을 우선하세요.
3. 온라인 관람 질문에는 공식 온라인 컬렉션, 가상 투어, 전시 영상, Google Arts & Culture 공식 기관 페이지의 존재 여부까지 확인하세요.
4. 링크, 전화번호, 이메일, 규정명, 운영 시간은 검색 결과에서 실제로 확인한 것만 쓰고 절대 만들어내지 마세요.
5. '온라인 감상이 가능한 미술관 알려줘'처럼 추천·목록을 요구하는 질문에는 특정 미술관 이름을 다시 묻지 마세요. 지역이 없으면 한국에서 접속하기 쉬운 국내외 대표 기관을 섞어 5곳 안팎으로 제시하세요. 각 기관의 공식 온라인 컬렉션이나 가상 투어가 현재 실제로 열리는지 검색해 확인하고, 작품 이미지 감상·360도 투어·전시 영상 중 무엇이 가능한지도 구분하세요.

답변 형식:
- 첫 줄 '결론: 됩니다.' 또는 '결론: 안 됩니다.'로 바로 답하세요. 일부만 가능하면 '결론: 일부 가능합니다.'라고 쓰세요.
- 이어서 무엇이 가능하고 불가능한지 구체적으로 설명하세요.
- '근거 규정·공식 안내'에 확인한 공식 규정이나 안내의 이름, 핵심 내용, 기준 날짜를 적으세요.
- '이용 방법'에 사용자가 바로 실행할 수 있는 단계와 공식 경로를 적으세요.
- 확정할 수 없으면 '결론: 확인되지 않습니다.'라고 쓰고 반드시 '끝까지 확인했지만 정확히 알지 못해 진심으로 죄송합니다.'라고 사과하세요.
- 확인 불가 시 '담당자 연락처'에 공식 문의 페이지를 우선 제공하고, 공식 페이지에서 실제 확인한 전화번호나 이메일이 있으면 함께 제공하세요.
- 마지막 '대체 답안'에는 온라인 컬렉션, 가상 투어, 공식 영상, 예약 변경, 유사 프로그램 등 질문 목적을 달성할 현실적인 방법을 1~3개 제시하세요.
- 추천·목록 질문에는 첫 줄을 '결론: 온라인 감상이 가능한 미술관이 있습니다.'로 시작하고, 각 항목을 '미술관명 — 가능한 감상 방식 — 이용 방법' 순서로 작성하세요. 로그인·유료 여부가 공식 페이지에서 확인되면 함께 적고, 사용자가 바로 들어갈 수 있는 공식 링크를 반드시 제공하세요. 이 경우 담당자 연락처나 사과 문구는 필요하지 않습니다.
- 출처가 뒷받침하지 않는 단정은 하지 마세요. 한국어로 충분히 자세하지만 읽기 쉽게 작성하세요.`,
        input: question,
        tools: [{ type: "web_search", search_context_size: "high" }],
        reasoning: { effort: "low" },
        max_output_tokens: 4000,
      }),
    });

    if (!openAIResponse.ok) {
      const requestId = openAIResponse.headers.get("x-request-id");
      console.error("OpenAI request failed", openAIResponse.status, requestId);
      return NextResponse.json(
        { error: "지금은 답변을 확인하기 어렵습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    const data = (await openAIResponse.json()) as {
      status?: string;
      incomplete_details?: { reason?: string };
      output_text?: string;
      output?: Array<{
        content?: Array<{
          type?: string;
          text?: string;
          annotations?: Array<{ type?: string; url?: string; title?: string }>;
        }>;
      }>;
    };
    const content = data.output?.flatMap((item) => item.content ?? []) ?? [];
    const answer = data.output_text || content.find((item) => item.type === "output_text")?.text;

    if (!answer) {
      console.error(
        "OpenAI response contained no text",
        data.status,
        data.incomplete_details?.reason,
      );
      throw new Error("OpenAI response contained no text");
    }
    const sources = Array.from(
      new Map(
        content
          .flatMap((item) => item.annotations ?? [])
          .filter((item) => item.type === "url_citation" && item.url)
          .map((item) => [item.url as string, item.title || item.url as string]),
      ),
    ).slice(0, 4);
    const sourcedAnswer = sources.length
      ? `${answer}\n\n공식 근거·출처\n${sources.map(([url, title]) => `- ${title}: ${url}`).join("\n")}`
      : answer;
    return NextResponse.json({ answer: sourcedAnswer });
  } catch (error) {
    console.error("Museum answer error", error);
    return NextResponse.json(
      { error: "답변 연결 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
