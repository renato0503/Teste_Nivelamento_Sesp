/* Decodifica os códigos de registro (tools/codes.txt, um por linha) e gera
   d:/Dev/Teste_Nivelamento_Sesp/seed.js  -> window.NIV_SEED = [...]
   Uso:  node tools/compile.js                                             */
const fs = require("fs");
const path = require("path");
const CATS = ["A","B","C","D","E","F"];
const TOT = { A:4, B:5, C:5, D:5, E:5, F:6 };
const DTOT = { basico:11, intermediario:14, avancado:1 };
const nivelFor = p => p>=85?"Avançado":p>=65?"Intermediário":p>=40?"Básico":"Iniciante";

const raw = fs.readFileSync(path.join(__dirname,"codes.txt"),"utf8")
  .split(/\r?\n/).map(s=>s.trim()).filter(Boolean).filter(s=>!s.startsWith("#"));

const seen = new Set();
const recs = [];
for (const code of raw) {
  let o;
  try { o = JSON.parse(decodeURIComponent(Buffer.from(code,"base64").toString("utf8"))); }
  catch (e) { console.error("IGNORADO (inválido):", code.slice(0,20)+"…"); continue; }
  const key = (o.n||"").toLowerCase().trim()+"|"+o.t;
  if (seen.has(key)) { console.error("DUPLICADO:", o.n); continue; }
  seen.add(key);
  recs.push({
    id: "code-"+o.t+"-"+(o.n||""),
    nome: o.n||"(sem nome)", setor: o.s||"", t: o.t,
    ac: o.ac, pct: o.pct, nivel: nivelFor(o.pct),
    porCat: Object.fromEntries(CATS.map(c=>[c,{a:(o.c&&o.c[c])||0,t:TOT[c]}])),
    porDif: {
      basico:{a:o.d.b||0,t:DTOT.basico},
      intermediario:{a:o.d.i||0,t:DTOT.intermediario},
      avancado:{a:o.d.a||0,t:DTOT.avancado},
    },
    respostas: null, origem: "código",
  });
}
recs.sort((a,b)=>a.t-b.t);
fs.writeFileSync(path.join(__dirname,"..","seed.js"),
  "/* Gerado por tools/compile.js — respostas recebidas por código (WhatsApp). */\n" +
  "window.NIV_SEED = " + JSON.stringify(recs,null,1) + ";\n");
console.log("OK:", recs.length, "respostas ->", "seed.js");
console.table(recs.map(r=>({nome:r.nome, setor:r.setor, pct:r.pct+"%", nivel:r.nivel})));
