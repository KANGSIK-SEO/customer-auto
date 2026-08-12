import { readFile } from "node:fs/promises";

const ontology = JSON.parse(await readFile(new URL("../data/customer-service-ontology.json", import.meta.url), "utf8"));
const allowedDomains = new Set(["banking", "insurance", "united_nations"]);
const required = ["id", "domain", "institution", "country", "region", "intents", "question", "answer", "action", "contact", "sourceUrl", "verifiedOn"];
const officialHosts = [
  "bankofamerica.com", "dbs.com.sg", "commbank.com.au", "hsbc.co.uk", "icicibank.com",
  "standardbank.co.za", "emiratesnbd.com", "allianz.com", "sanlam.co.za", "mapfre.com",
  "axa.co.uk", "prudential.com.sg", "tokiomarine.com", "un.org", "unhcr.org", "ohchr.org", "unv.org",
  "rbcroyalbank.com", "bbva.mx", "kbstar.com", "allianz.fr", "aia.com.hk",
  "deutsche-bank.de", "smbc.co.jp", "bbva.com.ar", "itau.com.br", "allianz.de",
  "portoseguro.com.br", "zurich.com.ar",
  "gtbank.com", "kcbgroup.com", "anz.co.nz", "bdo.com.ph", "britam.com",
  "leadway.com", "aia.co.nz", "axa.com.ph",
  "tokiomarine-nichido.co.jp", "axa.mx", "geico.com",
  "nrma.com.au", "intact.ca", "credit-agricole.fr", "hdfcergo.com", "kbinsure.co.kr",
  "hsbc.com.hk", "maybank2u.com.my", "bancosantander.es", "bangkokbank.com",
  "arabbank.jo", "ajig.com", "halykbank.kz", "basel.kz", "bankmed.com.lb",
  "libano-suisse.com", "insurancepasargad.com", "sukoon.com", "bsp.com.pg",
  "towerinsurance.com.fj", "bis.org",
  "icbc.com.cn", "pingan.com", "bca.co.id", "prudential.co.id",
  "alrajhibank.com.sa", "tawuniya.com", "cibeg.com", "allianz.com.eg",
  "isbank.com.tr", "allianz.com.tr",
  "intesasanpaolo.com", "generali.it", "abnamro.nl", "allianz.nl",
  "swedbank.se", "folksam.se",
  "pkobp.pl", "pzu.pl", "cgd.pt", "fidelidade.pt", "dnb.no", "gjensidige.no",
  "ubs.com", "axa.ch", "bnpparibasfortis.be", "axa.be", "sparkasse.at", "allianz.at",
  "danskebank.dk", "tryg.dk", "nordea.fi", "op.fi", "aib.ie", "allianz.ie",
  "alpha.gr", "generali.gr", "csas.cz", "allianz.cz", "erstebank.hu", "allianz.hu",
  "bancatransilvania.ro", "allianztiriac.ro", "unicreditbulbank.bg", "allianz.bg", "zaba.hr", "allianz.hr",
  "nlb.si", "triglav.si", "tatrabanka.sk", "kooperativa.sk", "seb.ee", "if.ee",
  "citadele.lv", "if.lv", "seb.lt", "islandsbanki.is", "vis.is",
  "bgl.lu", "lalux.lu", "hsbc.com.mt", "gasanmamo.com", "bankofcyprus.com", "eurolife.com.cy",
  "bancaintesa.rs", "generali.rs", "ckb.me", "lovcen-osiguranje.me", "nlb.mk", "triglav.mk",
  "raiffeisen.al", "sigal.com.al", "raiffeisenbank.ba", "uniqa.ba", "maib.md", "bnm.md",
  "ameriabank.am", "ingoarmenia.am", "libertybank.ge", "aldagi.ge", "abb-bank.az", "pasha-insurance.az",
  "cpa-bank.dz", "caar.dz", "attijariwafabank.com", "wafaassurance.ma", "biat.com.tn", "star.com.tn",
  "sc.com", "nic.gov.gh", "bic.co.bw", "nedbank.co.sz", "fnb.co.ls", "esric.co.sz", "lnighollard.co.ls", "bmoi.mg", "tools.assurancesaro.mg", "bcpbank.mu", "mua.mu", "absa.sc", "sacos.sc", "snpsf.com", "amanassurances.com", "standardbank.com.na", "nedbank.com.na", "mozabanco.co.mz", "emose.co.mz", "nbs.mw", "nico-life.com", "zanaco.co.zm", "madison.co.zm", "stanbicbank.co.zw", "cellinsurance.co.zw", "bnr.rw", "ubauganda.com", "nic.co.ug", "bot.go.tz", "nicinsurance.co.tz", "bfa.ao", "arseg.ao",
  "beac.int", "cima-afrique.org", "bceao.int",
  "bcrg-guinee.org", "bsl.gov.sl", "slicom.org.sl", "cbg.gm", "bcv.cv",
  "eccb-centralbank.org", "fsrc.gov.ag", "fsu.gov.dm", "garfin.gd", "fsrc.kn", "fsrastlucia.org", "fsasvg.com",
  "centralbankbahamas.com", "insurancecommissionbahamas.com", "centralbank.org.bb", "fsc.gov.bb",
  "bancentral.gov.do", "sis.gob.do", "brh.ht", "mef.gouv.ht", "boj.org.jm", "fscjamaica.org",
  "cbk.gov.kw", "iru.gov.kw", "qcb.gov.qa", "qfcra.com", "cbb.gov.bh", "cbo.gov.om", "fsa.gov.om",
  "nbe.gov.et", "banque-centrale.dj", "economie.gouv.dj",
  "bankpng.gov.pg", "cbsi.com.sb", "rbv.gov.vu", "towerinsurance.ws", "towerinsurance.to", "tower.co.nz",
  "superbancos.gob.pa", "superseguros.gob.pa", "centralbank.org.bz", "osipp.gov.bz", "bc.gob.cu", "esicuba.cu",
  "bankofguyana.org.gy", "cbvs.sr", "central-bank.org.tt", "bcn.gob.ni", "superintendencia.gob.ni",
  "bcr.gob.sv", "ssf.gob.sv", "banguat.gob.gt", "sib.gob.gt", "bch.hn", "cnbs.gob.hn", "bccr.fi.cr", "sugese.fi.cr",
  "bcb.gob.bo", "aps.gob.bo", "bcentral.cl", "cmfchile.cl", "bcu.gub.uy", "gub.uy", "bcp.gov.py",
  "nbkr.kg", "nbt.tj", "cbt.tm", "insurance.gov.tm", "cbu.uz", "napp.uz",
  "afa.ad", "fma-li.li", "acpr.banque-france.fr", "monentreprise.gouv.mc", "bcsm.sm",
  "banrep.gov.co", "superfinanciera.gov.co", "bce.fin.ec", "supercias.gob.ec", "sbs.gob.pe", "bcv.org.ve", "sudeaseg.gob.ve",
  "bb.org.bd", "idra.org.bd", "nrb.org.np", "nia.gov.np", "cbsl.gov.lk", "ircsl.gov.lk", "sbp.org.pk", "secp.gov.pk", "mma.gov.mv",
  "nbc.gov.kh", "irc.gov.kh", "bol.gov.la", "mof.gov.la", "sbv.gov.vn", "mof.gov.vn",
  "mongolbank.mn", "frc.mn", "bdcb.gov.bn", "bancocentral.tl", "mfa.gov.bn",
  "brb.bi", "arca.bi", "bcc.cd", "arca.cd", "cbl.org.lr", "bcm.mr", "boe.gov.er", "niceritrea.com", "bcstp.st",
  "nbrb.by", "minfin.gov.by", "cbr.ru", "boi.org.il", "gov.il", "cbi.iq", "insurancediwan.gov.iq",
  "bank.gov.ua", "cbm.gov.mm", "mopf.gov.mm", "cbl.gov.ly", "lisa.gov.ly", "cbos.gov.sd", "isa.gov.sd", "boss.gov.ss", "mofp.gov.ss",
];
const officialSourcePrefixes = [
  "https://t.me/s/BankMelli_ir",
  "https://t.me/s/bankmelli_ir",
];

const errors = [];
const ids = new Set();
const counts = Object.fromEntries([...allowedDomains].map((domain) => [domain, 0]));
const regions = new Set();
const countries = new Set();

for (const [index, record] of ontology.records.entries()) {
  for (const field of required) {
    if (record[field] === undefined || record[field] === "" || (Array.isArray(record[field]) && !record[field].length)) {
      errors.push(`record ${index} (${record.id ?? "no id"}): missing ${field}`);
    }
  }
  if (ids.has(record.id)) errors.push(`duplicate id: ${record.id}`);
  ids.add(record.id);
  if (!allowedDomains.has(record.domain)) errors.push(`${record.id}: invalid domain ${record.domain}`);
  else counts[record.domain] += 1;
  regions.add(record.region);
  countries.add(record.country);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.verifiedOn)) errors.push(`${record.id}: invalid verifiedOn`);
  try {
    const host = new URL(record.sourceUrl).hostname.replace(/^www\./, "");
    if (!officialHosts.some((official) => host === official || host.endsWith(`.${official}`))
      && !officialSourcePrefixes.some((prefix) => record.sourceUrl.startsWith(prefix))) {
      errors.push(`${record.id}: source host is not in official registry: ${host}`);
    }
  } catch {
    errors.push(`${record.id}: invalid sourceUrl`);
  }
}

for (const [domain, count] of Object.entries(counts)) {
  if (count < 6) errors.push(`${domain}: expected at least 6 records, found ${count}`);
}
if (ontology.records.length < 558) errors.push(`expected at least 558 records, found ${ontology.records.length}`);
if (regions.size < 9) errors.push(`expected at least 9 regions, found ${regions.size}`);
if (countries.size < 28) errors.push(`expected at least 28 countries or global jurisdictions, found ${countries.size}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ records: ontology.records.length, domains: counts, countries: [...countries].sort(), regions: [...regions].sort(), uniqueSources: new Set(ontology.records.map((record) => record.sourceUrl)).size }, null, 2));
