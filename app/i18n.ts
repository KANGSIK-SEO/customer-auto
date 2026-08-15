export type Lang = "ko" | "en" | "fr" | "zh";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
];

export type Translations = {
  brandAria: string;
  edition: string;
  eyebrow: string;
  title: string;
  intro: string;
  askSectionAria: string;
  questionLabel: string;
  placeholder: string;
  askButton: string;
  askButtonLoading: string;
  noticeBefore: string;
  privacyLabel: string;
  noticeMiddle: string;
  aiNoticeLabel: string;
  noticeAfter: string;
  suggestionsAria: string;
  loading: string;
  evidenceHeading: string;
  evidenceIntro: string;
  verifiedPrefix: string;
  sourceLink: string;
  disclaimerBefore: string;
  disclaimerAfter: string;
  errorInput: string;
  errorConfig: string;
  errorConnect: string;
  errorGeneric: string;
  domainLabels: Record<"banking" | "insurance" | "united_nations", string>;
  footerOperator: string;
  footerContactBefore: string;
  footerReminder: string;
  footerAiNotice: string;
  footerPrivacy: string;
  footerAbout: string;
  suggestions: string[];
};

export const translations: Record<Lang, Translations> = {
  ko: {
    brandAria: "아트 컨시어지 홈",
    edition: "전 세계 미술관 안내 데스크",
    eyebrow: "WORLDWIDE MUSEUM DESK",
    title: "세상의 모든 미술관에 대해 물어보기",
    intro:
      "관람 시간, 입장료, 온라인 감상, 접근성, 촬영 규정 등 전 세계 미술관 방문 정보를 물어보세요. 공식 자료만 근거로 답하며, 확인되지 않은 내용은 추측하지 않습니다.",
    askSectionAria: "세계 미술관 질문",
    questionLabel: "미술관 질문",
    placeholder: "예: 루브르 박물관은 몇 시에 열어?",
    askButton: "질문",
    askButtonLoading: "확인 중",
    noticeBefore:
      "이 서비스는 AI가 공식 자료를 검색해 답변을 생성합니다. 입력하신 질문은 답변 생성을 위해 OpenAI(미국)로 전송되어 처리되며, 별도 계정이나 서버 데이터베이스에 저장하지 않습니다. 이름, 연락처 등 개인정보는 입력하지 말아 주세요. 자세한 내용은 ",
    privacyLabel: "개인정보처리방침",
    noticeMiddle: "과 ",
    aiNoticeLabel: "AI 시스템 안내",
    noticeAfter: "를 참고하세요.",
    suggestionsAria: "질문 예시",
    loading:
      "공식 사이트와 규정을 끝까지 검색하고 있습니다. 답변까지 약 20~40초 걸릴 수 있습니다…",
    evidenceHeading: "이 답변에 사용된 온톨로지 근거",
    evidenceIntro:
      "아래 항목은 질문과 연결된 기관 공식 자료입니다. 중요한 내용은 원문에서 다시 확인해 주세요.",
    verifiedPrefix: "확인",
    sourceLink: "기관 공식 원문 확인",
    disclaimerBefore:
      "이 답변은 생성형 AI가 공식 출처와 온톨로지 자료를 바탕으로 작성한 참고용 정보이며 해당 기관의 공식 답변이나 금융·보험·법률 자문이 아닙니다. 사실과 다르거나 오래된 내용이 포함될 수 있으니 중요한 결정 전 반드시 해당 기관에 다시 확인해 주세요. 답변에 오류가 있거나 이의를 제기하고 싶다면 ",
    disclaimerAfter: "으로 알려 주세요.",
    errorInput: "질문 형식을 확인해 주세요.",
    errorConfig: "답변 서비스 설정이 아직 완료되지 않았습니다.",
    errorConnect: "지금은 답변을 확인하기 어렵습니다. 잠시 후 다시 시도해 주세요.",
    errorGeneric: "잠시 후 다시 시도해 주세요.",
    domainLabels: { banking: "은행", insurance: "보험", united_nations: "UN 시민지원" },
    footerOperator: "ART CONCIERGE · 운영자: 이볼라르(evollard)",
    footerContactBefore: "문의·오류 신고·이의제기: ",
    footerReminder: "중요한 결정 전 해당 기관의 최신 공식 안내를 한 번 더 확인해 주세요.",
    footerAiNotice: "AI 시스템 안내",
    footerPrivacy: "개인정보처리방침",
    footerAbout: "서비스 소개·이용안내",
    suggestions: [
      "온라인으로 감상할 수 있는 미술관 알려줘",
      "루브르 박물관 입장권은 어떻게 예약해?",
      "메트로폴리탄 미술관에서 사진 촬영이 가능해?",
      "오르세 미술관 휴관일은 언제야?",
      "휠체어로 관람하기 좋은 미술관 추천해줘",
    ],
  },
  en: {
    brandAria: "Art Concierge home",
    edition: "WORLDWIDE MUSEUM VISITOR DESK",
    eyebrow: "WORLDWIDE MUSEUM DESK",
    title: "Ask About Every Museum in the World",
    intro:
      "Ask about opening hours, admission, online viewing, accessibility, and photography policies at museums worldwide. Answers rely only on official sources — nothing is guessed.",
    askSectionAria: "World museum question",
    questionLabel: "Museum question",
    placeholder: "e.g. What time does the Louvre open?",
    askButton: "Ask",
    askButtonLoading: "Checking",
    noticeBefore:
      "This service uses AI to search official sources and generate an answer. Your question is sent to OpenAI (United States) for processing and is not stored in a separate account or server database. Please do not enter personal information such as your name or contact details. For more information, see our ",
    privacyLabel: "Privacy Policy",
    noticeMiddle: " and our ",
    aiNoticeLabel: "AI System Notice",
    noticeAfter: ".",
    suggestionsAria: "Example questions",
    loading:
      "Thoroughly searching official museum sites and policies. This may take about 20–40 seconds…",
    evidenceHeading: "Sources Used for This Answer",
    evidenceIntro:
      "The items below are official institutional records linked to your question. Please double-check important details in the original source.",
    verifiedPrefix: "Verified",
    sourceLink: "View official source",
    disclaimerBefore:
      "This answer is AI-generated reference information based on official sources and ontology data. It is not an official response from the institution, nor financial, insurance, or legal advice. It may contain inaccurate or outdated information, so please reconfirm with the institution before making an important decision. If you find an error or wish to raise an objection, please write to ",
    disclaimerAfter: ".",
    errorInput: "Please check your question format.",
    errorConfig: "The answer service is not fully configured yet.",
    errorConnect: "We can't retrieve an answer right now. Please try again shortly.",
    errorGeneric: "Please try again in a moment.",
    domainLabels: { banking: "Banking", insurance: "Insurance", united_nations: "UN Public Assistance" },
    footerOperator: "ART CONCIERGE · Operated by Evollard",
    footerContactBefore: "Inquiries, error reports, objections: ",
    footerReminder: "Please double-check the institution's latest official information before making an important decision.",
    footerAiNotice: "AI System Notice",
    footerPrivacy: "Privacy Policy",
    footerAbout: "About & Terms",
    suggestions: [
      "Which museums offer free online viewing?",
      "How do I book tickets for the Louvre?",
      "Is photography allowed at the Metropolitan Museum of Art?",
      "When is the Musée d'Orsay closed?",
      "Recommend museums with strong accessibility for wheelchair visitors",
    ],
  },
  fr: {
    brandAria: "Accueil Art Concierge",
    edition: "GUICHET MONDIAL DES MUSÉES",
    eyebrow: "GUICHET MONDIAL DES MUSÉES",
    title: "Interrogez tous les musées du monde",
    intro:
      "Posez vos questions sur les horaires, les tarifs, la visite en ligne, l'accessibilité et les règles de photographie des musées du monde entier. Les réponses reposent uniquement sur des sources officielles ; rien n'est deviné.",
    askSectionAria: "Question sur les musées du monde",
    questionLabel: "Question sur un musée",
    placeholder: "ex. À quelle heure ouvre le Louvre ?",
    askButton: "Demander",
    askButtonLoading: "Vérification",
    noticeBefore:
      "Ce service utilise l'IA pour rechercher des informations officielles et générer une réponse. Votre question est transmise à OpenAI (États-Unis) à des fins de traitement et n'est pas conservée dans un compte ou une base de données distincte. Veuillez ne pas indiquer de renseignements personnels tels que votre nom ou vos coordonnées. Pour en savoir plus, consultez notre ",
    privacyLabel: "Politique de confidentialité",
    noticeMiddle: " et notre ",
    aiNoticeLabel: "Avis sur le système d'IA",
    noticeAfter: ".",
    suggestionsAria: "Exemples de questions",
    loading:
      "Recherche approfondie des sites et règlements officiels des musées. Cela peut prendre environ 20 à 40 secondes…",
    evidenceHeading: "Sources utilisées pour cette réponse",
    evidenceIntro:
      "Les éléments ci-dessous proviennent des documents officiels des institutions liées à votre question. Veuillez vérifier les détails importants dans la source originale.",
    verifiedPrefix: "Vérifié le",
    sourceLink: "Consulter la source officielle",
    disclaimerBefore:
      "Cette réponse est une information de référence générée par une IA à partir de sources officielles et de données d'ontologie. Il ne s'agit pas d'une réponse officielle de l'institution, ni d'un conseil financier, d'assurance ou juridique. Elle peut contenir des informations inexactes ou obsolètes ; veuillez donc reconfirmer auprès de l'institution avant toute décision importante. Pour signaler une erreur ou une objection, veuillez écrire à ",
    disclaimerAfter: ".",
    errorInput: "Veuillez vérifier le format de votre question.",
    errorConfig: "Le service de réponse n'est pas encore entièrement configuré.",
    errorConnect: "Impossible d'obtenir une réponse pour le moment. Veuillez réessayer sous peu.",
    errorGeneric: "Veuillez réessayer dans un instant.",
    domainLabels: { banking: "Banque", insurance: "Assurance", united_nations: "Aide publique de l'ONU" },
    footerOperator: "ART CONCIERGE · Exploité par Evollard",
    footerContactBefore: "Questions, signalement d'erreurs, réclamations : ",
    footerReminder: "Veuillez reconfirmer les informations officielles les plus récentes de l'institution avant toute décision importante.",
    footerAiNotice: "Avis sur le système d'IA",
    footerPrivacy: "Politique de confidentialité",
    footerAbout: "À propos et conditions",
    suggestions: [
      "Quels musées proposent une visite en ligne gratuite ?",
      "Comment réserver des billets pour le Louvre ?",
      "Peut-on prendre des photos au Metropolitan Museum of Art ?",
      "Quels sont les jours de fermeture du Musée d'Orsay ?",
      "Quels musées offrent un bon accès aux visiteurs en fauteuil roulant ?",
    ],
  },
  zh: {
    brandAria: "Art Concierge 首页",
    edition: "全球博物馆问询台",
    eyebrow: "全球博物馆问询台",
    title: "向世界上所有的博物馆提问",
    intro:
      "欢迎咨询全球博物馆的开放时间、门票价格、在线参观、无障碍设施及拍照规定。所有回答均仅依据官方资料，不会凭空猜测。",
    askSectionAria: "世界博物馆提问",
    questionLabel: "博物馆提问",
    placeholder: "例如：卢浮宫几点开门？",
    askButton: "提问",
    askButtonLoading: "查询中",
    noticeBefore:
      "本服务由AI检索官方资料并生成回答。您输入的问题将发送至OpenAI（美国）用于生成回答处理，不会另行存入账户或服务器数据库。请勿输入姓名、联系方式等个人信息。详情请参阅",
    privacyLabel: "隐私政策",
    noticeMiddle: "与",
    aiNoticeLabel: "AI系统说明",
    noticeAfter: "。",
    suggestionsAria: "提问示例",
    loading: "正在全面检索官方网站及相关规定，回答最长可能需要约20-40秒…",
    evidenceHeading: "本回答使用的资料来源",
    evidenceIntro: "以下内容为与您的问题相关的机构官方资料。重要信息请以原文为准再次确认。",
    verifiedPrefix: "核实日期",
    sourceLink: "查看官方原文",
    disclaimerBefore:
      "本回答为人工智能根据官方资料及本体数据生成的参考信息，并非机构官方答复，也不构成金融、保险或法律建议。其中可能包含不准确或过时的内容，重要决定前请务必向相关机构再次确认。如发现错误或有异议，请联系",
    disclaimerAfter: "告知我们。",
    errorInput: "请检查您的提问格式。",
    errorConfig: "回答服务尚未配置完成。",
    errorConnect: "目前暂时无法获取回答，请稍后重试。",
    errorGeneric: "请稍后再试。",
    domainLabels: { banking: "银行", insurance: "保险", united_nations: "联合国公共援助" },
    footerOperator: "ART CONCIERGE · 运营方：Evollard",
    footerContactBefore: "咨询、错误报告、异议：",
    footerReminder: "重要决定前，请再次确认相关机构的最新官方信息。",
    footerAiNotice: "AI系统说明",
    footerPrivacy: "隐私政策",
    footerAbout: "关于本服务及使用说明",
    suggestions: [
      "哪些博物馆提供免费的在线参观？",
      "如何预订卢浮宫的门票？",
      "大都会艺术博物馆可以拍照吗？",
      "奥赛博物馆的闭馆日是哪天？",
      "请推荐轮椅无障碍设施完善的博物馆",
    ],
  },
};

const STORAGE_KEY = "customer-auto-lang";

export function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "ko";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ko" || stored === "en" || stored === "fr" || stored === "zh") {
    return stored;
  }
  const nav = window.navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("ko")) return "ko";
  return "en";
}

export function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, lang);
}
