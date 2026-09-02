/* ==========================================================================
   Coletor de respostas do Teste de Nivelamento - SESP
   --------------------------------------------------------------------------
   COMO USAR
   1. Crie uma Planilha Google nova (Google Sheets).
   2. Menu  Extensões > Apps Script.
   3. Apague o conteúdo e cole TODO este arquivo.
   4. Troque o valor de TOKEN abaixo por algo só seu (o mesmo valor vai em
      config.js, campo "token").
   5. Menu  Implantar > Nova implantação > tipo "App da Web".
        - Executar como: Eu
        - Quem pode acessar: Qualquer pessoa
   6. Copie a URL do app da Web e cole em config.js, campo "apiUrl".
   ========================================================================== */

var TOKEN = 'sesp-2025';            // <-- TROQUE e repita o mesmo em config.js
var SHEET_NAME = 'respostas';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sh = _sheet_();
    sh.appendRow([
      new Date(data.t || Date.now()),
      data.nome || '',
      data.setor || '',
      Number(data.pct) || 0,
      data.nivel || '',
      Number(data.ac) || 0,
      JSON.stringify(data.porCat || {}),
      JSON.stringify(data.porDif || {}),
      JSON.stringify(data.respostas || {})
    ]);
    return _json_({ ok: true });
  } catch (err) {
    return _json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  if (!e || (e.parameter.token || '') !== TOKEN) {
    return _json_({ ok: false, error: 'token invalido' });
  }
  var sh = _sheet_();
  var last = sh.getLastRow();
  if (last < 2) return _json_({ ok: true, respostas: [] });
  var rows = sh.getRange(2, 1, last - 1, 9).getValues();
  var out = rows.map(function (r) {
    return {
      t: new Date(r[0]).getTime(),
      nome: r[1], setor: r[2],
      pct: Number(r[3]) || 0, nivel: r[4], ac: Number(r[5]) || 0,
      porCat: _safe_(r[6]), porDif: _safe_(r[7]), respostas: _safe_(r[8])
    };
  });
  return _json_({ ok: true, respostas: out });
}

function _sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['data', 'nome', 'setor', 'percentual', 'nivel', 'acertos',
                  'porCategoria', 'porDificuldade', 'respostas']);
  }
  return sh;
}
function _safe_(s) { try { return JSON.parse(s); } catch (e) { return {}; } }
function _json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
