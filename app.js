(function () {
'use strict';

/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s);
const app = $('#app');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
const num = (v) => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; };
const fmt = (n, d = 1) => (n == null || !isFinite(n) ? '' : Number(n).toLocaleString('de-DE', { maximumFractionDigits: d }));
const fmtTime = (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`; };
const str = (v) => (v == null ? '' : String(v).trim());
const clampInt = (v, lo, hi, d) => { const n = Math.round(Number(v)); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
const clampNum = (v, lo, hi, d) => { const n = Number(String(v).replace(',', '.')); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DAY = 864e5;
const dateShort = (ts) => new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
const weekday = (ts) => new Date(ts).toLocaleDateString('de-DE', { weekday: 'short' });
function weekStart(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }
function isoWeek(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7)); const w1 = new Date(d.getFullYear(), 0, 4); return 1 + Math.round(((d - w1) / DAY - 3 + ((w1.getDay() + 6) % 7)) / 7); }
function parseRange(reps) {
  const s = str(reps);
  if (/s\b|sek|min/i.test(s)) return null;
  const m = s.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (m) return { lo: +m[1], hi: +m[2] };
  const one = s.match(/^(\d+)/);
  return one ? { lo: +one[1], hi: +one[1] } : null;
}
const e1rm = (w, r) => (w > 0 && r > 0 ? w * (1 + Math.min(r, 15) / 30) : 0);
const ICON = {
  swap: '<svg viewBox="0 0 24 24"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>',
  barcode: '<svg viewBox="0 0 24 24"><path d="M4 5v14M7 5v14M10.5 5v14M13 5v14M16.5 5v14M20 5v14"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  text: '<svg viewBox="0 0 24 24"><path d="M5 6h14M5 11h14M5 16h9"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>',
  pen: '<svg viewBox="0 0 24 24"><path d="M4 20l4-1L19 8l-3-3L5 16z"/></svg>'
};
function dayKey(ts) { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function keyToDate(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
function shiftKey(k, n) { const d = keyToDate(k); d.setDate(d.getDate() + n); return dayKey(d.getTime()); }
const r1 = (x) => Math.round(x * 10) / 10;

/* ---------- reference data ---------- */
const GOALS = [
  { id: 'muskel', label: 'Muskelaufbau', hint: 'Mehr Muskelmasse' },
  { id: 'kraft', label: 'Maximalkraft', hint: 'Schwerer heben' },
  { id: 'fett', label: 'Fett verlieren', hint: 'Straffer werden, Muskeln halten' },
  { id: 'fit', label: 'Allgemeine Fitness', hint: 'Gesund und leistungsfähig' },
  { id: 'ausdauer', label: 'Kraftausdauer', hint: 'Kondition und Belastbarkeit' },
  { id: 'beweglich', label: 'Haltung & Mobilität', hint: 'Beweglicher, weniger Beschwerden' }
];
const LEVELS = [
  { id: 'anfaenger', label: 'Anfänger', hint: 'unter 1 Jahr' },
  { id: 'fortgeschritten', label: 'Fortgeschritten', hint: '1 bis 3 Jahre' },
  { id: 'erfahren', label: 'Erfahren', hint: 'über 3 Jahre' }
];
const EQUIP = [
  { id: 'gym', label: 'Fitnessstudio' },
  { id: 'home-rack', label: 'Zuhause mit Langhantel & Rack' },
  { id: 'home-db', label: 'Zuhause mit Kurzhanteln' },
  { id: 'bodyweight', label: 'Nur Körpergewicht' }
];
const FOCUS = ['Brust', 'Rücken', 'Schultern', 'Arme', 'Bauch & Core', 'Beine', 'Po', 'Haltung'];
const RPE_OPTS = ['', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];
const labelOf = (list, id) => (list.find((x) => x.id === id) || {}).label || id;

const EXAMPLE_PLAN = {
  name: 'Ganzkörper 3×', summary: 'Drei Ganzkörper-Einheiten pro Woche mit den wichtigsten Grundübungen. Gut als Start, bis du deinen eigenen Plan hast.',
  progression: 'Doppelte Progression: Erreichst du in allen Sätzen das obere Ende der Wiederholungen, steigerst du beim nächsten Mal das Gewicht.',
  weeks: 6,
  days: [
    { name: 'Tag A', focus: 'Ganzkörper, Schwerpunkt Kniebeuge & Drücken', exercises: [
      { name: 'Kniebeuge (Langhantel)', sets: 3, reps: '6-8', rpe: 8, rest: 150, notes: 'Hüftbreit, Knie über die Zehen schieben, aufrechter Oberkörper.' },
      { name: 'Bankdrücken (Langhantel)', sets: 3, reps: '6-8', rpe: 8, rest: 150, notes: '' },
      { name: 'Rudern vorgebeugt (Langhantel)', sets: 3, reps: '8-10', rpe: 8, rest: 120, notes: '' },
      { name: 'Rumänisches Kreuzheben', sets: 2, reps: '8-10', rpe: 7, rest: 120, notes: '' },
      { name: 'Seitheben (Kurzhantel)', sets: 3, reps: '12-15', rpe: 9, rest: 60, notes: '' },
      { name: 'Unterarmstütz (Plank)', sets: 3, reps: '30-45 s', rpe: 7, rest: 60, notes: '' } ] },
    { name: 'Tag B', focus: 'Ganzkörper, Schwerpunkt Kreuzheben & Ziehen', exercises: [
      { name: 'Kreuzheben (Langhantel)', sets: 3, reps: '5', rpe: 7.5, rest: 180, notes: 'Rücken neutral, Stange nah am Körper.' },
      { name: 'Schulterdrücken (Kurzhantel)', sets: 3, reps: '8-10', rpe: 8, rest: 120, notes: '' },
      { name: 'Latzug', sets: 3, reps: '8-12', rpe: 8, rest: 90, notes: '' },
      { name: 'Ausfallschritte (Kurzhantel)', sets: 3, reps: '10-12', rpe: 8, rest: 90, notes: 'Wiederholungen pro Bein.' },
      { name: 'Bizepscurls (Kurzhantel)', sets: 2, reps: '10-12', rpe: 9, rest: 60, notes: '' },
      { name: 'Trizepsdrücken am Kabel', sets: 2, reps: '10-12', rpe: 9, rest: 60, notes: '' } ] },
    { name: 'Tag C', focus: 'Ganzkörper, Schwerpunkt Beine & Oberkörper-Volumen', exercises: [
      { name: 'Beinpresse', sets: 3, reps: '10-12', rpe: 8, rest: 120, notes: '' },
      { name: 'Schrägbankdrücken (Kurzhantel)', sets: 3, reps: '8-10', rpe: 8, rest: 120, notes: '' },
      { name: 'Klimmzüge (assistiert)', sets: 3, reps: '6-10', rpe: 8, rest: 120, notes: '' },
      { name: 'Hip Thrust', sets: 3, reps: '8-12', rpe: 8, rest: 90, notes: '' },
      { name: 'Face Pulls', sets: 3, reps: '12-15', rpe: 8, rest: 60, notes: '' },
      { name: 'Hängendes Beinheben', sets: 3, reps: '10-15', rpe: 8, rest: 60, notes: '' } ] }
  ]
};

/* ---------- state ---------- */
const S = {
  profile: null, plan: null, workouts: [], active: null,
  nut: { days: {}, foods: {}, goals: null },
  exinfo: {},
  view: 'training',
  form: { goal: 'muskel', level: 'fortgeschritten', days: '3', minutes: '60', equipment: 'gym', focus: [], ab: false, limits: '', notes: '', importText: '' },
  ui: { tab: 'new', edit: false, swap: null, confirm: null, openHist: null, progEx: null, newEx: '', nutDate: dayKey(Date.now()), nutAdd: null, goalEdit: false, goalDraft: null, foodQuery: '' },
  gen: null
};
let restT = null; // {end, total, label}
let actx = null;
let wakeLock = null;

/* ---------- storage: Claude account (db) with on-device fallback ---------- */
const LS_KEY = 'satzbuch.v1';
function lsRead() { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; } }
function lsWrite() { try { localStorage.setItem(LS_KEY, JSON.stringify({ profile: S.profile, plan: S.plan, workouts: S.workouts, active: S.active, nut: S.nut, exinfo: S.exinfo })); } catch (e) { /* storage blocked */ } }
function applyData(d) {
  if (!d) return;
  S.profile = d.profile || null; S.plan = d.plan || null; S.active = d.active || null;
  S.nut = { days: (d.nut && d.nut.days) || {}, foods: (d.nut && d.nut.foods) || {}, goals: (d.nut && d.nut.goals) || null };
  S.exinfo = d.exinfo && typeof d.exinfo === 'object' ? d.exinfo : {};
  S.workouts = Array.isArray(d.workouts) ? d.workouts.slice() : [];
  sortWorkouts();
}
function sortWorkouts() { S.workouts.sort((a, b) => b.startedAt - a.startedAt); }

const cloud = { db: null, base: null, ready: false };
let localDirty = false;
let syncState = 'connecting';
function setSync(s) {
  syncState = s;
  const el = $('#sync'); if (!el) return;
  el.dataset.s = s;
  el.lastElementChild.textContent = { connecting: 'Verbinde …', cloud: 'Im Konto gespeichert', local: 'Nur auf diesem Gerät', error: 'Speichern fehlgeschlagen', slow: 'Konto antwortet nicht' }[s] || '';
}
const DEL = Symbol('del');
const pending = new Map();
let flushing = false;
function cloudPut(path, data) { if (!cloud.ready) return; pending.set(path, data); flush(); }
async function writeOne(path, data) {
  const ref = cloud.db.doc(path);
  if (data === DEL) await ref.delete(); else await ref.set(data);
}
async function flush() {
  if (flushing) return; flushing = true;
  while (pending.size) {
    const [path, data] = pending.entries().next().value;
    pending.delete(path);
    try { await writeOne(path, data); if (syncState !== 'cloud') setSync('cloud'); }
    catch (e) {
      if (e && e.code === 'unavailable') {
        await sleep(700 + Math.random() * 900);
        try { await writeOne(path, data); continue; } catch (e2) { /* fall through */ }
      }
      setSync('error');
    }
  }
  flushing = false;
}
const P = {
  profile: () => cloud.base + '/profile',
  plan: () => cloud.base + '/plan',
  active: () => cloud.base + '/active',
  workouts: () => cloud.base + '/log/workouts',
  workout: (id) => cloud.base + '/log/workouts/' + id,
  goals: () => cloud.base + '/goals',
  days: () => cloud.base + '/log/days',
  day: (k) => cloud.base + '/log/days/' + k,
  foods: () => cloud.base + '/log/foods',
  food: (id) => cloud.base + '/log/foods/' + id,
  exinfos: () => cloud.base + '/log/exinfo',
  exinfo: (k) => cloud.base + '/log/exinfo/' + k
};
function saveExinfo(k) { markLocal(); if (S.exinfo[k]) cloudPut(P.exinfo(k), S.exinfo[k]); }
function saveDay(k) { markLocal(); if (S.nut.days[k]) cloudPut(P.day(k), S.nut.days[k]); }
const dayTimers = {};
function saveDaySoon(k) { lsWrite(); if (!cloud.ready) localDirty = true; clearTimeout(dayTimers[k]); dayTimers[k] = setTimeout(() => saveDay(k), 900); }
function saveFood(f) { markLocal(); cloudPut(P.food(f.id), f); }
function saveGoals() { markLocal(); cloudPut(P.goals(), { value: S.nut.goals }); }
function markLocal() { lsWrite(); if (!cloud.ready) localDirty = true; }
function saveProfile() { markLocal(); cloudPut(P.profile(), { value: S.profile }); }
function savePlan() { markLocal(); cloudPut(P.plan(), S.plan ? { value: S.plan } : DEL); }
function saveWorkout(w) { markLocal(); cloudPut(P.workout(w.id), w); }
function deleteWorkout(id) { markLocal(); cloudPut(P.workout(id), DEL); }
let activeTimer = null, planTimer = null;
function saveActiveSoon() { lsWrite(); if (!cloud.ready) localDirty = true; clearTimeout(activeTimer); activeTimer = setTimeout(() => cloudPut(P.active(), { value: S.active }), 1200); }
function saveActiveNow() { clearTimeout(activeTimer); markLocal(); cloudPut(P.active(), { value: S.active }); }
function savePlanSoon() { lsWrite(); if (!cloud.ready) localDirty = true; clearTimeout(planTimer); planTimer = setTimeout(savePlan, 800); }

async function initCloud() {
  if (!window.claude || typeof window.claude.use !== 'function') { setSync('local'); return; }
  let db = null, user = null;
  try { [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]); } catch (e) { /* treated as absent */ }
  if (!db || !user) { setSync('local'); return; }
  const id = await user.id();
  if (!id) { setSync('local'); return; }
  cloud.db = db; cloud.base = 'data/users/' + id;
  const slow = setTimeout(() => setSync('slow'), 10000);
  try {
    const [p, pl, ac, ws, gl, dsnap, fsnap, isnap] = await Promise.all([
      db.doc(P.profile()).get(), db.doc(P.plan()).get(), db.doc(P.active()).get(),
      db.collection(P.workouts()).orderBy('startedAt', 'desc').limit(1000).get(),
      db.doc(P.goals()).get(),
      db.collection(P.days()).orderBy('date', 'desc').limit(400).get(),
      db.collection(P.foods()).limit(1000).get(),
      db.collection(P.exinfos()).limit(500).get()
    ]);
    clearTimeout(slow);
    const cProfile = p.exists ? clone(p.data().value) : null;
    const cPlan = pl.exists ? clone(pl.data().value) : null;
    const cActive = ac.exists ? clone(ac.data().value) : null;
    const cWorkouts = ws.docs.map((d) => clone(d.data()));
    const ids = new Set(cWorkouts.map((w) => w.id));
    const localOnly = S.workouts.filter((w) => !ids.has(w.id));
    if (localDirty) {
      S.profile = S.profile || cProfile; S.plan = S.plan || cPlan; S.active = S.active || cActive;
    } else {
      S.profile = cProfile || S.profile; S.plan = cPlan || S.plan; S.active = cActive || S.active;
    }
    S.workouts = cWorkouts.concat(localOnly); sortWorkouts();
    const cGoals = gl.exists ? clone(gl.data().value) : null;
    const cDays = {}; dsnap.docs.forEach((d) => { const v = clone(d.data()); if (v && v.date) cDays[v.date] = v; });
    const cFoods = {}; fsnap.docs.forEach((d) => { const v = clone(d.data()); if (v && v.id) cFoods[v.id] = v; });
    const ln = S.nut;
    const pushDays = Object.keys(ln.days).filter((k) => localDirty || !cDays[k]);
    const pushFoods = Object.keys(ln.foods).filter((k) => localDirty || !cFoods[k]);
    const merged = { goals: localDirty ? (ln.goals || cGoals) : (cGoals || ln.goals), days: Object.assign({}, cDays), foods: Object.assign({}, cFoods) };
    pushDays.forEach((k) => { merged.days[k] = ln.days[k]; });
    pushFoods.forEach((k) => { merged.foods[k] = ln.foods[k]; });
    S.nut = merged;
    const cInfo = {}; isnap.docs.forEach((d) => { const v = clone(d.data()); if (v && Array.isArray(v.steps)) cInfo[d.id] = v; });
    const pushInfo = Object.keys(S.exinfo).filter((k) => !cInfo[k]);
    S.exinfo = Object.assign({}, S.exinfo, cInfo);
    cloud.ready = true; setSync('cloud');
    pushInfo.forEach((k) => cloudPut(P.exinfo(k), S.exinfo[k]));
    if (S.nut.goals && (!cGoals || localDirty)) cloudPut(P.goals(), { value: S.nut.goals });
    pushDays.forEach((k) => cloudPut(P.day(k), S.nut.days[k]));
    pushFoods.forEach((k) => cloudPut(P.food(k), S.nut.foods[k]));
    if (S.profile && (!cProfile || localDirty)) cloudPut(P.profile(), { value: S.profile });
    if (S.plan && (!cPlan || localDirty)) cloudPut(P.plan(), { value: S.plan });
    if (S.active && (!cActive || localDirty)) cloudPut(P.active(), { value: S.active });
    localOnly.forEach((w) => cloudPut(P.workout(w.id), w));
    lsWrite();
    render();
  } catch (e) {
    clearTimeout(slow);
    setSync('local');
  }
}

/* ---------- Claude (sample) ---------- */
let sample = null;
let aiState = 'pending'; // pending | ok | off
let imgOk = false;
let samplePromise = null;
function initSample() { sample = bridgeSample; aiState = 'ok'; imgOk = true; }

/* ---------- Claude chat bridge: prompts go through the user's own Claude chat ---------- */
const CLAUDE_URL = 'https://claude.ai/new';
let bridgeJob = null;
function bridgeMeta(p, photo) {
  if (/^Wandle den folgenden Trainingsplan/.test(p)) return ['Plan einlesen', ''];
  if (/Erstelle einen individuellen Trainingsplan/.test(p)) return ['Plan erstellen', ''];
  if (/Alternativen zur Kraftübung/.test(p)) return ['Alternativen finden', ''];
  if (/Strichcode/.test(p)) return ['Barcode lesen', 'Füge in Claude zuerst ein Foto des Barcodes hinzu, dann den Text.'];
  if (/Nährwerttabelle/.test(p)) return ['Nährwerttabelle lesen', 'Fotografiere in Claude die Nährwerttabelle (über das Plus- bzw. Kamera-Symbol) und schick das Foto zusammen mit dem Text.'];
  if (/Schätze die Nährwerte/.test(p)) return ['Nährwerte schätzen', photo ? 'Füge in Claude ein Foto deines Essens hinzu und schick es zusammen mit dem Text.' : ''];
  if (/Erkläre die Kraftübung/.test(p)) return ['Übung erklären', ''];
  return ['Claude fragen', photo ? 'Füge in Claude das passende Foto hinzu.' : ''];
}
const bridgeSample = {
  json(prompt, opts) {
    opts = opts || {};
    if (opts.signal && opts.signal.aborted) return Promise.reject({ code: 'cancelled' });
    if (bridgeJob) closeBridge();
    const photo = !!opts.images;
    const [title, hint] = bridgeMeta(prompt, photo);
    return new Promise((resolve, reject) => {
      const job = { title, hint, photo, prompt: prompt + '\n\nGib die Antwort nur als JSON in einem einzigen Code-Block aus, ohne weitere Erklärung.', resolve, reject, error: null, copied: false, answer: '' };
      bridgeJob = job;
      if (opts.signal) opts.signal.addEventListener('abort', () => { if (bridgeJob === job) closeBridge(); });
      renderBridge();
    });
  }
};
function closeBridge() { const j = bridgeJob; bridgeJob = null; renderBridge(); if (j) j.reject({ code: 'cancelled' }); }
function parseLoose(t) {
  t = String(t || '').trim(); if (!t) return null;
  const tryP = (s) => { try { return JSON.parse(s); } catch (e) { return undefined; } };
  let v = tryP(t); if (v !== undefined) return v;
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) { v = tryP(fence[1].trim()); if (v !== undefined) return v; }
  const i = t.search(/[[{]/), j = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
  if (i >= 0 && j > i) { v = tryP(t.slice(i, j + 1)); if (v !== undefined) return v; }
  const fixed = t.replace(/[“”„]/g, '"');
  return fixed !== t ? parseLoose(fixed) : null;
}
function syncSheetLock() { const open = ['#sheet', '#bridge', '#datasheet'].some((s) => { const el = $(s); return el && !el.hidden; }); document.body.classList.toggle('sheet-open', open); }
function renderBridge() {
  const el = $('#bridge'), j = bridgeJob;
  if (!j) { el.hidden = true; el.innerHTML = ''; syncSheetLock(); return; }
  el.hidden = false; syncSheetLock();
  el.innerHTML = `<div class="sheet-backdrop" data-act="bridge-cancel"></div>
    <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="bridge-title">
      <div class="sheet-head"><div><p class="eyebrow">Über deinen Claude-Chat</p><h2 id="bridge-title">${esc(j.title)}</h2></div>
        <button class="icon-btn" type="button" data-act="bridge-cancel" aria-label="Abbrechen">${ICON.x}</button></div>
      <div class="sheet-body">
        <div class="bridge-step"><h4><span>1</span>Text an Claude schicken</h4>
          ${j.hint ? `<p class="small">${esc(j.hint)}</p>` : ''}
          <a class="btn primary" href="${CLAUDE_URL}" target="_blank" rel="noopener" data-act="bridge-copy">Text kopieren und Claude öffnen</a>
          ${j.copied ? '<p class="copied">Kopiert. In Claude einfügen und abschicken.</p>' : '<p class="small muted">Der Text kommt in die Zwischenablage. In Claude einfügen und abschicken.</p>'}
          <details><summary>Text anzeigen</summary><textarea readonly id="bridge-prompt" aria-label="Text für Claude">${esc(j.prompt)}</textarea></details>
        </div>
        <div class="bridge-step"><h4><span>2</span>Antwort hier einfügen</h4>
          <p class="small muted">Kopiere Claudes Antwort (am einfachsten über das Kopieren-Symbol am Code-Block) und füge sie hier ein.</p>
          <textarea id="bridge-answer" placeholder="Antwort von Claude …" data-bind="bridge">${esc(j.answer)}</textarea>
          ${j.error ? `<p class="err">${esc(j.error)}</p>` : ''}
          <div class="btn-row"><button class="btn" type="button" data-act="bridge-paste">Einfügen</button><button class="btn primary" type="button" data-act="bridge-apply">Übernehmen</button></div>
        </div>
      </div>
    </div>`;
}
async function getSample() { if (sample) return sample; if (samplePromise) return samplePromise; return null; }
function aiErr(e) {
  const c = e && e.code;
  if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(c)) { aiState = 'off'; return 'Claude ist für diese App gerade nicht freigegeben. Du kannst deinen Plan trotzdem selbst anlegen oder den Beispielplan nutzen.'; }
  if (c === 'cancelled') return null;
  if (c === 'rate_limited') return 'Gerade zu viele Anfragen oder dein Nutzungslimit ist erreicht. Versuch es in ein paar Minuten noch einmal.';
  if (c === 'session_expired') return 'Deine Anmeldung ist abgelaufen. Melde dich bei Claude neu an und versuch es dann erneut.';
  if (c === 'invalid_json') return 'Die Antwort ließ sich nicht als Plan lesen. Versuch es noch einmal.';
  if (c === 'refused') return 'Claude hat diese Anfrage abgelehnt. Formuliere deine Angaben etwas anders.';
  if (c === 'prompt_too_large') return 'Der eingefügte Text ist zu lang. Kürze ihn auf das Wesentliche.';
  if (c === 'images_unavailable') { imgOk = false; return 'Fotos können hier nicht an Claude geschickt werden. Trag die Werte bitte selbst ein.'; }
  if (c === 'image_rejected') return 'Das Foto konnte nicht verarbeitet werden. Versuch es mit einem anderen Foto.';
  if (!c && e && e.message) return e.message;
  return 'Die Verbindung zu Claude wurde unterbrochen. Versuch es noch einmal.';
}

const JSON_SHAPE = '{"name":"Push/Pull/Beine A/B","summary":"2-3 Sätze, worum es im Plan geht","weeks":8,"progression":"1-2 Sätze, wie gesteigert wird und wann Deload ist","scale":"rir","rir":[3,3,2,2,"0-1","0-1","D"],"repeat":true,"days":[{"name":"Push A","week":"A","focus":"Brust, Schultern, Trizeps","exercises":[{"name":"Schrägbankdrücken (Kurzhantel)","sets":3,"reps":"6-8","rpe":8,"rest":150,"ss":false,"notes":"kurzer Hinweis oder leer"}]}]}';
const RULES_SHARED = [
  '- Supersätze als zwei aufeinanderfolgende Übungen: die erste bekommt "ss": true, beide einen Hinweis in "notes" (z. B. "Supersatz mit Hammercurls"). Sonst "ss": false.',
  '- Intensitätstechniken wie Dropset, Myo-Reps oder Rest-Pause gehören in "notes", z. B. "Letzter Satz als Dropset".',
  '- Pausen ("rest", Sekunden): schwere Grundübungen mit wenigen Wdh. 150-180, Maschinen und Kabel 90-120, Isolationsübungen 60-75.',
  '- Legt der Plan die Intensität pro Woche fest (z. B. Wiederholungen im Tank / RIR), setze "scale": "rir" und "rir" als Array mit einem Eintrag pro Woche: Zahl, Bereich wie "0-1" oder "D" für eine Deload-Woche. Beginnt der Zyklus danach von vorn, "repeat": true. Sonst "scale": "rpe", "rir": [] und "repeat": false.'
];

function genPrompt(f) {
  return [
    'Du bist erfahrener Sportwissenschaftler und Kraft-Coach. Erstelle einen individuellen Trainingsplan (einen Mesozyklus).',
    '',
    'Angaben der Person:',
    '- Ziel: ' + labelOf(GOALS, f.goal),
    '- Trainingserfahrung: ' + labelOf(LEVELS, f.level),
    '- Trainingstage pro Woche: ' + f.days,
    '- Zeit pro Einheit: etwa ' + f.minutes + ' Minuten',
    '- Trainingsort / Equipment: ' + labelOf(EQUIP, f.equipment),
    '- Schwerpunkte: ' + (f.focus.length ? f.focus.join(', ') : 'keine besonderen'),
    '- Beschwerden / Einschränkungen: ' + (str(f.limits) || 'keine angegeben'),
    '- Weitere Infos: ' + (str(f.notes) || 'keine'),
    '',
    'Regeln:',
    f.ab
      ? '- A- und B-Wochen im Wechsel: Woche A und Woche B haben je ' + f.days + ' Trainingstage mit gleicher Aufteilung, aber anderen Übungsvarianten. Gib also ' + (2 * Number(f.days)) + ' Tage zurück, mit "week": "A" bzw. "B", erst alle A-Tage, dann alle B-Tage, und hänge A oder B an den Tagesnamen (z. B. "Push A").'
      : '- Genau ' + f.days + ' Trainingstage, "week" jeweils "".',
    '- Jeder Tag mit 4 bis 8 Übungen, die in die Zeit pro Einheit passen.',
    ...RULES_SHARED,
    '- Nur Übungen, die mit dem angegebenen Equipment machbar sind. Beschwerden berücksichtigen.',
    '- Übungsnamen auf Deutsch, so wie man sie im Gym kennt, mit Gerät in Klammern, z. B. "Rudern (Kurzhantel)".',
    '- "reps" als Text: Bereich wie "8-10", feste Zahl wie "5" oder Zeit wie "30-45 s".',
    '- "rpe" ist die Ziel-Intensität auf der RPE-Skala 6 bis 10 (10 = Muskelversagen). "rest" ist die Satzpause in Sekunden.',
    '- "weeks" ist die Länge des Zyklus (4 bis 10 Wochen).',
    '',
    'Antworte nur mit JSON in genau dieser Form, ohne weiteren Text:',
    JSON_SHAPE
  ].join('\n');
}
function importPrompt(text) {
  return [
    'Wandle den folgenden Trainingsplan in strukturiertes JSON um.',
    'Übernimm Trainingstage, Übungen, Sätze und Wiederholungen so genau wie möglich. Ändere nichts am Inhalt.',
    'Fehlt die Intensität, schätze "rpe" (6 bis 10): Grundübungen 8, Isolationsübungen 9.',
    '- A/B-Wochen oder A/B-Varianten (z. B. "Push A" und "Push B", "Woche A" und "Woche B"): übernimm ALLE Tage beider Wochen, setze "week" auf "A" bzw. "B" und sortiere erst alle A-Tage, dann alle B-Tage. Ohne solche Varianten "week": "".',
    ...RULES_SHARED,
    'Gibt der Plan mehrere Phasen mit unterschiedlichen Übungen an, nimm die aktuelle Phase als Trainingstage und beschreibe den Rest kurz in "progression".',
    '"reps" als Text: Bereich wie "8-10", Zahl wie "5" oder Zeit wie "30 s".',
    '',
    'Antworte nur mit JSON in genau dieser Form, ohne weiteren Text:',
    JSON_SHAPE,
    '',
    'Der Plan:',
    '"""',
    text.slice(0, 40000),
    '"""'
  ].join('\n');
}

function normEx(e) {
  return { id: uid(), name: str(e && e.name) || 'Übung', sets: clampInt(e && e.sets, 1, 12, 3), reps: str(e && e.reps) || '8-12', rpe: clampNum(e && e.rpe, 5, 10, 8), rest: clampInt(e && e.rest, 15, 600, 90), ss: !!(e && e.ss), notes: str(e && e.notes) };
}
function sortDays(plan) {
  if (!plan || !plan.days.some((d) => d.week)) return;
  const order = [];
  plan.days.forEach((d) => { if (!order.includes(d.week || '')) order.push(d.week || ''); });
  order.sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b, 'de')));
  plan.days = order.flatMap((w) => plan.days.filter((d) => (d.week || '') === w));
}
function weekLabels(plan) { const out = []; (plan ? plan.days : []).forEach((d) => { if (d.week && !out.includes(d.week)) out.push(d.week); }); return out; }
function normalizePlan(raw, source) {
  const days = raw && Array.isArray(raw.days) ? raw.days : [];
  const cleaned = days.filter((d) => d && Array.isArray(d.exercises) && d.exercises.length);
  if (!cleaned.length) throw { message: 'Im Ergebnis war kein Trainingstag mit Übungen. Versuch es noch einmal.' };
  const plan = {
    id: uid(), source, createdAt: Date.now(),
    name: str(raw.name) || 'Mein Trainingsplan', summary: str(raw.summary), progression: str(raw.progression),
    weeks: clampInt(raw.weeks, 1, 52, 6),
    scale: raw.scale === 'rir' ? 'rir' : 'rpe',
    rir: Array.isArray(raw.rir) && raw.rir.some((v) => parseRir(v)) ? raw.rir.slice(0, 52).map((v) => (parseRir(v) ? v : null)) : null,
    repeat: !!raw.repeat,
    days: cleaned.slice(0, 14).map((d, i) => ({ id: uid(), name: str(d.name) || 'Tag ' + (i + 1), week: str(d.week).toUpperCase().slice(0, 3), focus: str(d.focus), exercises: d.exercises.slice(0, 16).map(normEx) }))
  };
  sortDays(plan);
  return plan;
}

async function runGen(kind) {
  const f = S.form;
  if (kind === 'import' && str(f.importText).length < 20) { S.gen = { status: 'error', kind, error: 'Füge zuerst deinen Plan in das Textfeld ein.' }; render(); return; }
  const smp = await getSample();
  if (!smp) { aiState = 'off'; S.gen = { status: 'error', kind, error: 'Claude ist hier nicht verfügbar. Lege deinen Plan selbst an oder nutze den Beispielplan.' }; render(); return; }
  const ctl = new AbortController();
  const g = { status: 'running', kind, chars: 0, started: Date.now(), ctl, result: null, error: null };
  S.gen = g; render();
  try {
    const raw = await smp.json(kind === 'import' ? importPrompt(f.importText) : genPrompt(f), {
      signal: ctl.signal, cache: false, modelTier: 'default',
      onText: ({ text }) => { g.chars = text.length; updateGenStatus(); }
    });
    if (S.gen !== g) return;
    g.result = normalizePlan(raw, kind === 'import' ? 'import' : 'claude');
    g.status = 'done';
  } catch (e) {
    if (S.gen !== g) return;
    const msg = aiErr(e);
    if (msg == null) { S.gen = null; render(); return; }
    g.status = 'error'; g.error = msg;
  }
  render();
}
function updateGenStatus() {
  const el = document.getElementById('gen-msg'); if (!el || !S.gen) return;
  const g = S.gen;
  const secs = Math.round((Date.now() - g.started) / 1000);
  el.textContent = g.chars ? `Claude schreibt deinen Plan … (${g.chars.toLocaleString('de-DE')} Zeichen)` : `Warte auf Claudes Antwort … ${secs} s`;
}

async function runSwap(dayId, exId) {
  const day = S.plan.days.find((d) => d.id === dayId); if (!day) return;
  const ex = day.exercises.find((x) => x.id === exId); if (!ex) return;
  S.ui.swap = { dayId, exId, status: 'running', items: [], error: null }; render();
  const smp = await getSample();
  if (!smp) { S.ui.swap.status = 'error'; S.ui.swap.error = 'Claude ist hier nicht verfügbar. Ändere den Namen im Bearbeiten-Modus.'; render(); return; }
  const equip = S.profile ? labelOf(EQUIP, S.profile.equipment) : 'Fitnessstudio';
  const prompt = `Nenne 5 gleichwertige Alternativen zur Kraftübung "${ex.name}" (Trainingstag: ${day.name}${day.focus ? ', Fokus: ' + day.focus : ''}; Equipment: ${equip}). Gleiche Muskelgruppe, ähnliche Belastung. Übungsnamen auf Deutsch mit Gerät in Klammern.\nAntworte nur mit einem JSON-Array: [{"name":"Rudern (Kurzhantel)","why":"höchstens 8 Wörter, warum sie passt"}]`;
  try {
    const arr = await smp.json(prompt, { modelTier: 'quick' });
    if (!S.ui.swap || S.ui.swap.exId !== exId) return;
    S.ui.swap.items = (Array.isArray(arr) ? arr : []).filter((x) => x && x.name).slice(0, 6).map((x) => ({ name: str(x.name), why: str(x.why) }));
    S.ui.swap.status = S.ui.swap.items.length ? 'done' : 'error';
    if (!S.ui.swap.items.length) S.ui.swap.error = 'Keine Alternativen gefunden.';
  } catch (e) {
    if (!S.ui.swap) return;
    S.ui.swap.status = 'error'; S.ui.swap.error = aiErr(e) || 'Abgebrochen.';
  }
  render();
}

/* ---------- training logic ---------- */
function lastPerformance(name, filter) {
  const key = name.trim().toLowerCase();
  for (const w of S.workouts) {
    if (w.deload || (filter && !filter(w))) continue;
    const e = (w.exercises || []).find((x) => x.name.trim().toLowerCase() === key);
    if (e && e.sets && e.sets.length) return { date: w.startedAt, sets: e.sets, cycle: w.cycle || 1, week: w.week || null };
  }
  return null;
}
function suggestion(ex) {
  const last = lastPerformance(ex.name);
  if (!last) return null;
  const range = parseRange(ex.reps);
  const top = Math.max(0, ...last.sets.map((s) => s.weight || 0));
  const work = last.sets.filter((s) => (s.weight || 0) === top);
  const rpes = work.map((s) => s.rpe).filter((r) => r != null);
  const avgRpe = rpes.length ? rpes.reduce((a, b) => a + b, 0) / rpes.length : null;
  const lastText = last.sets.map((s) => (s.weight ? fmt(s.weight) + '×' : '') + s.reps).join(' · ');
  const info = curRir(), pos = cyclePos();
  const roundW = (x) => (x >= 20 ? Math.round(x / 2.5) * 2.5 : Math.round(x * 2) / 2);
  if (info && info.deload) {
    return { weight: top ? roundW(top * 0.9) : null, reps: range ? range.lo : null, reason: 'Deload: halbe Sätze, etwa 10 % leichter. Locker bleiben.', lastText, date: last.date };
  }
  if (S.plan && S.plan.repeat && pos.cycle > 1 && last.cycle < pos.cycle) {
    const ref = lastPerformance(ex.name, (w) => (w.cycle || 1) === pos.cycle - 1 && w.week === pos.week);
    const rtop = ref ? Math.max(0, ...ref.sets.map((s) => s.weight || 0)) : 0;
    if (rtop > 0) return { weight: rtop + (rtop >= 20 ? 2.5 : 1), reps: range ? range.lo : null, reason: `Neuer Zyklus: etwas mehr als in Woche ${pos.week} des letzten Zyklus (${fmt(rtop)} kg).`, lastText, date: last.date };
  }
  let weight = top || null, reps = range ? range.lo : null, reason = '';
  if (range) {
    const hitTop = work.length >= Math.min(ex.sets, last.sets.length) && work.every((s) => s.reps >= range.hi);
    const easy = avgRpe == null || avgRpe <= ex.rpe + 0.25;
    if (hitTop && easy && top > 0) {
      weight = top + (top >= 20 ? 2.5 : 1); reps = range.lo;
      reason = 'Alle Sätze am oberen Ende geschafft, also mehr Gewicht.';
    } else if (hitTop && easy) {
      reps = range.hi + 1; reason = 'Ziel erreicht: eine Wiederholung mehr oder schwerere Variante.';
    } else {
      const best = Math.max(...work.map((s) => s.reps));
      reps = Math.min(range.hi, Math.max(range.lo, best + (avgRpe != null && avgRpe > ex.rpe + 1 ? 0 : 1)));
      reason = avgRpe != null && avgRpe > ex.rpe + 1 ? 'Letztes Mal war es sehr schwer: Gewicht halten.' : 'Gleiches Gewicht, eine Wiederholung mehr anpeilen.';
    }
  }
  return { weight, reps, reason, lastText, date: last.date };
}
function buildActiveEx(ex) {
  const tr = targetRpe(ex), r = curRir();
  const n = r && r.deload ? deloadSets(ex.sets) : ex.sets;
  return {
    id: uid(), name: ex.name, notes: ex.notes || '', ss: !!ex.ss,
    target: { sets: n, reps: ex.reps, rpe: tr, rest: ex.rest, label: targetLabel(ex) },
    sug: suggestion(Object.assign({}, ex, { rpe: tr })),
    sets: Array.from({ length: n }, () => ({ w: '', r: '', rpe: '', done: false }))
  };
}
function nextDay() {
  if (!S.plan || !S.plan.days.length) return null;
  const last = S.workouts.find((w) => w.planId === S.plan.id);
  if (!last) return S.plan.days[0];
  const i = S.plan.days.findIndex((d) => d.id === last.dayId);
  return S.plan.days[(i + 1) % S.plan.days.length] || S.plan.days[0];
}
const planStart = (p) => { const d = new Date(p.startDate || p.createdAt); d.setHours(0, 0, 0, 0); return d.getTime(); };
function cyclePos() {
  if (!S.plan) return { cycle: 1, week: 1, abs: 1 };
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const abs = Math.floor(Math.round((t.getTime() - planStart(S.plan)) / DAY) / 7) + 1;
  const n = S.plan.weeks || 6;
  if (abs < 1 || !S.plan.repeat) return { cycle: 1, week: abs, abs };
  return { cycle: Math.floor((abs - 1) / n) + 1, week: ((abs - 1) % n) + 1, abs };
}
function planWeek() { return cyclePos().week; }
function cycleWeekRange() { const s = planStart(S.plan) + (cyclePos().abs - 1) * 7 * DAY; return { start: s, end: s + 7 * DAY }; }
function parseRir(v) {
  if (v == null || v === '') return null;
  const s = String(v).trim().toLowerCase().replace(/,/g, '.');
  if (s === 'd' || s.startsWith('deload')) return { deload: true, lo: 4, hi: 4, label: 'Deload' };
  const m = s.match(/^(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)$/);
  if (m) { const a = Math.min(+m[1], +m[2]), b = Math.max(+m[1], +m[2]); return { lo: a, hi: b, label: a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}` }; }
  const n = Number(s);
  return s !== '' && isFinite(n) && n >= 0 && n <= 10 ? { lo: n, hi: n, label: fmt(n) } : null;
}
function weekRir(p, wk) { const arr = p && Array.isArray(p.rir) ? p.rir : null; return arr ? parseRir(arr[wk - 1]) : null; }
const curRir = () => weekRir(S.plan, planWeek());
function targetRpe(ex) { const r = curRir(); return r ? 10 - r.lo : ex.rpe; }
const isRir = () => !!(S.plan && S.plan.scale === 'rir');
function intensity(rpe) { if (rpe == null) return ''; return isRir() ? 'RIR ' + fmt(10 - rpe) : 'RPE ' + fmt(rpe); }
function targetLabel(ex) {
  const r = curRir();
  if (!r) return intensity(ex.rpe);
  if (r.deload) return 'Deload';
  if (isRir()) return 'RIR ' + r.label;
  return r.lo === r.hi ? 'RPE ' + fmt(10 - r.lo) : `RPE ${fmt(10 - r.hi)}–${fmt(10 - r.lo)}`;
}
const deloadSets = (n) => Math.max(1, Math.ceil(n / 2));
function phaseOf(p, wk) { return p && Array.isArray(p.phases) ? p.phases.find((x) => wk >= x.from && wk <= x.to) || null : null; }
function startWorkout(dayId) {
  const day = S.plan.days.find((d) => d.id === dayId); if (!day) return;
  const pos = cyclePos(), r = curRir();
  S.active = { id: uid(), planId: S.plan.id, dayId: day.id, dayName: day.name, startedAt: Date.now(), cycle: pos.cycle, week: pos.week, deload: !!(r && r.deload), exercises: day.exercises.map(buildActiveEx) };
  S.ui.confirm = null;
  saveActiveNow();
  requestWake();
  go('training');
  window.scrollTo(0, 0);
}
function requestWake() {
  try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then((l) => { wakeLock = l; }).catch(() => {}); } catch (e) { /* not allowed */ }
}
function releaseWake() { try { if (wakeLock) wakeLock.release(); } catch (e) { /* ignore */ } wakeLock = null; }
function workoutStats(w) {
  let sets = 0, vol = 0;
  (w.exercises || []).forEach((e) => e.sets.forEach((s) => { sets++; vol += (s.weight || 0) * (s.reps || 0); }));
  return { sets, vol };
}
function finishWorkout() {
  const a = S.active; if (!a) return;
  const w = {
    id: a.id, planId: a.planId, dayId: a.dayId, dayName: a.dayName, startedAt: a.startedAt, finishedAt: Date.now(),
    cycle: a.cycle || 1, week: a.week || null, deload: !!a.deload,
    duration: Math.round((Date.now() - a.startedAt) / 1000),
    exercises: a.exercises.map((e) => ({
      name: e.name, target: e.target,
      sets: e.sets.filter((s) => s.done).map((s) => ({ weight: num(s.w) || 0, reps: num(s.r) || 0, rpe: num(s.rpe) }))
    })).filter((e) => e.sets.length)
  };
  S.workouts.unshift(w); sortWorkouts();
  S.active = null; restT = null; S.ui.confirm = null;
  saveWorkout(w); saveActiveNow(); releaseWake();
  S.ui.openHist = w.id;
  go('verlauf');
}

/* ---------- beep / vibrate ---------- */
function ensureAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { actx = null; } }
function beep() {
  try {
    if (actx) {
      const t = actx.currentTime;
      [0, 0.28].forEach((off) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t + off);
        g.gain.exponentialRampToValueAtTime(0.22, t + off + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.22);
        o.connect(g); g.connect(actx.destination); o.start(t + off); o.stop(t + off + 0.25);
      });
    }
  } catch (e) { /* no audio */ }
  try { if (navigator.vibrate) navigator.vibrate([180, 90, 180]); } catch (e) { /* no vibration */ }
}

/* ---------- views ---------- */
function exDose(ex, raw) {
  if (raw) return `${ex.sets} × ${esc(ex.reps)} · RPE ${fmt(ex.rpe)}`;
  const r = curRir();
  return `${r && r.deload ? deloadSets(ex.sets) : ex.sets} × ${esc(ex.reps)} · ${esc(targetLabel(ex))}`;
}
function exLi(ex, withRest, raw) {
  return `<li><span class="ex-name">${esc(ex.name)}${infoBtn(ex.name, ex.notes)}${ex.ss ? ' <span class="ss-tag">Supersatz ↓</span>' : ''}${ex.notes ? `<small class="ex-note">${esc(ex.notes)}</small>` : ''}</span><span class="ex-dose">${exDose(ex, raw)}${withRest ? ' · ' + fmtTime(ex.rest) : ''}</span></li>`;
}
function rirRow(p) {
  if (!Array.isArray(p.rir) || !p.rir.some((v) => v != null && v !== '')) return '';
  const wk = planWeek();
  const missing = Array.from({ length: p.weeks || 6 }, (_, i) => weekRir(p, i + 1)).some((v) => !v);
  return `<div class="stack" style="gap:6px"><p class="small"><strong>Wiederholungen im Tank pro Woche</strong></p><div class="rir-row">${Array.from({ length: p.weeks || 6 }, (_, i) => { const v = weekRir(p, i + 1); return `<span class="rir-cell ${i + 1 === wk ? 'now' : ''} ${v && v.deload ? 'dl' : ''}"><small>W${i + 1}</small><b>${!v ? '–' : v.deload ? 'D' : esc(v.label)}</b></span>`; }).join('')}</div>
    ${Array.isArray(p.phases) && p.phases.length ? `<ul class="phase-list">${p.phases.map((ph) => `<li class="${wk >= ph.from && wk <= ph.to ? 'now' : ''}"><span class="num">W${ph.from}${ph.to !== ph.from ? '–' + ph.to : ''}</span><span><strong>${esc(ph.name)}.</strong> ${esc(ph.text)}</span></li>`).join('')}</ul>` : ''}
    ${p.repeat ? '<p class="small muted">Danach beginnt der nächste Zyklus wieder bei Woche 1, mit höheren Gewichten als im letzten Zyklus.</p>' : ''}
    ${missing ? '<p class="small muted">Bei „–“ gilt der Wert der einzelnen Übung. Festlegen kannst du das unter Bearbeiten.</p>' : ''}</div>`;
}

function viewWelcome() {
  return `
  <section class="hero">
    <p class="eyebrow">Dein Trainingsbuch</p>
    <h1>Plan holen, Sätze eintragen, stärker werden.</h1>
    <p>Sag, was du erreichen willst. Claude baut dir daraus einen Trainingsplan. Im Training trägst du pro Satz Gewicht, Wiederholungen und Intensität (RPE) ein, und die App schlägt dir beim nächsten Mal das passende Gewicht vor.</p>
  </section>
  <div class="choices">
    ${aiState !== 'off' ? `<button class="choice primary" type="button" data-act="go-create" data-tab="new">Plan von Claude erstellen lassen<small>Ziel, Erfahrung und Trainingstage angeben</small></button>
    <button class="choice" type="button" data-act="go-create" data-tab="import">Vorhandenen Plan einfügen<small>Zum Beispiel den Plan aus deinem Claude-Chat</small></button>` : ''}
    <button class="choice" type="button" data-act="manual-plan">Selbst zusammenstellen<small>Leerer Plan, Übungen trägst du selbst ein</small></button>
    <button class="choice" type="button" data-act="example-load">Mit Beispielplan starten<small>3 Tage Ganzkörper, jederzeit ersetzbar</small></button>
  </div>
  <section class="panel" aria-label="Beispiel">
    <div class="section-head"><h3>So trägst du ein Training ein</h3><span class="demo-tag">Beispiel</span></div>
    <div class="sets" aria-hidden="true">
      <div class="set-row head"><span>Satz</span><span>kg</span><span>Wdh.</span><span>RPE</span><span></span></div>
      ${[['60', '8', '7.5', true], ['60', '8', '8', true], ['60', '', '', false]].map((r, i) => `
      <div class="set-row ${r[3] ? 'done' : ''}"><span class="set-no">${i + 1}</span><input tabindex="-1" readonly value="${r[0]}"><input tabindex="-1" readonly value="${r[1]}" placeholder="8"><input tabindex="-1" readonly value="${r[2] ? fmt(+r[2]) : ''}" placeholder="–"><span class="tick">${ICON.check}</span></div>`).join('')}
    </div>
    <p class="small muted">Bankdrücken, Ziel 3 × 6-8 bei RPE 8. Abhaken startet automatisch den Pausen-Timer.</p>
  </section>`;
}

function cycleBar() {
  const pos = cyclePos(), wk = pos.week, n = S.plan.weeks || 6, r = weekRir(S.plan, wk), ph = phaseOf(S.plan, wk);
  const cells = Array.from({ length: n }, (_, i) => `<span class="${i + 1 < wk ? 'on' : i + 1 === wk ? 'now' : ''}"></span>`).join('');
  const label = wk < 1 ? `Start am ${dateShort(planStart(S.plan))}`
    : wk <= n ? `${S.plan.repeat ? `Zyklus ${pos.cycle} · ` : ''}Woche ${wk} von ${n}${ph ? ' · ' + esc(ph.name) : ''}${r && !r.deload ? ` · ${esc(r.label)} im Tank` : ''}`
    : `Zyklus beendet (${n} Wochen)`;
  return `<div class="cycle"><span class="small muted num">${label}</span><div class="cycle-track" style="grid-template-columns:repeat(${n},1fr)">${cells}</div></div>`;
}

function viewTraining() {
  if (S.active) return viewSession();
  if (!S.plan) return viewWelcome();
  const nd = nextDay();
  const range = cycleWeekRange();
  const thisWeek = S.workouts.filter((w) => w.startedAt >= range.start && w.startedAt < range.end).length;
  const last = S.workouts[0];
  const over = !S.plan.repeat && planWeek() > (S.plan.weeks || 6);
  const ph = phaseOf(S.plan, planWeek());
  const labels = weekLabels(S.plan);
  const curW = nd && nd.week ? nd.week : '';
  const weekDays = labels.length && curW ? S.plan.days.filter((d) => d.week === curW) : S.plan.days;
  const pos = nd ? weekDays.indexOf(nd) + 1 : 0;
  const others = S.plan.days.filter((d) => !nd || d.id !== nd.id);
  const otherGroups = labels.length ? [...labels, ''].map((l) => ({ l, days: others.filter((d) => (d.week || '') === l) })).filter((g) => g.days.length) : [{ l: '', days: others }];
  return `
  <section class="plan-head">
    <p class="eyebrow">${esc(S.plan.source === 'example' ? 'Beispielplan' : 'Dein Plan')}</p>
    <h1>${esc(S.plan.name)}</h1>
    ${cycleBar()}
    ${ph ? `<p class="phase-note"><strong>${esc(ph.name)}:</strong> ${esc(ph.text)}</p>` : ''}
    ${labels.length > 1 && curW ? `<div class="rotation">${labels.map((l) => `<span class="wk ${l === curW ? 'on' : ''}">Woche ${esc(l)}</span>`).join('<span class="muted" aria-hidden="true">→</span>')}<span class="small muted num">Tag ${pos} von ${weekDays.length}</span></div>` : ''}
    <p class="small muted num">Diese Woche (${dateShort(range.start)}–${dateShort(range.end - DAY)}): ${thisWeek} von ${weekDays.length} Einheiten${last ? ` · Zuletzt ${esc(weekday(last.startedAt))}, ${dateShort(last.startedAt)}: ${esc(last.dayName)}` : ''}</p>
  </section>
  ${over ? `<div class="panel"><h3>Dein Zyklus ist durch</h3><p class="muted">Nach ${S.plan.weeks} Wochen lohnt sich ein neuer Plan mit frischen Reizen. Dein Verlauf bleibt erhalten.</p><div class="btn-row"><button class="btn primary" type="button" data-act="go-create" data-tab="new">Neuen Plan erstellen</button></div></div>` : ''}
  ${nd ? `<article class="day next">
    <div class="day-head"><div><p class="day-tag">Als Nächstes${curW ? ' · Woche ' + esc(curW) : ''}</p><h2>${esc(nd.name)}</h2>${nd.focus ? `<p class="small muted">${esc(nd.focus)}</p>` : ''}</div><span class="small muted num">${nd.exercises.length} Übungen</span></div>
    <ul class="ex-list">${nd.exercises.map((ex) => exLi(ex, false)).join('')}</ul>
    <div class="day-foot"><button class="btn primary big" type="button" data-act="start-day" data-day="${nd.id}">Training starten</button></div>
  </article>` : ''}
  ${others.length ? `<section class="stack"><h3>Anderen Tag trainieren</h3>
    ${otherGroups.map((g) => `${labels.length ? `<p class="week-label">${g.l ? 'Woche ' + esc(g.l) : 'Ohne Woche'}</p>` : ''}
    ${g.days.map((d) => `
      <article class="day"><div class="day-head"><div><h3>${esc(d.name)}</h3><p class="small muted">${esc(d.focus || d.exercises.slice(0, 3).map((e) => e.name).join(', '))}</p></div>
      <button class="btn" type="button" data-act="start-day" data-day="${d.id}">Starten</button></div></article>`).join('')}`).join('')}
  </section>` : ''}`;
}

function rpeSelect(id, val, attrs) {
  const opts = isRir() ? [['', '–'], ['10', '0'], ['9', '1'], ['8', '2'], ['7', '3'], ['6', '4'], ['5', '5']] : RPE_OPTS.map((o) => [o, o ? fmt(+o) : '–']);
  return `<select id="${id}" ${attrs} aria-label="${isRir() ? 'Wiederholungen im Tank' : 'RPE'}">${opts.map(([v, l]) => `<option value="${v}" ${String(val) === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
}

function viewSession() {
  const a = S.active;
  const total = a.exercises.reduce((n, e) => n + e.sets.length, 0);
  const done = a.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
  const c = S.ui.confirm;
  return `
  <section class="session-head">
    <div><p class="eyebrow">Training läuft</p><h1>${esc(a.dayName)}</h1></div>
    <div style="text-align:right"><span class="clock" id="elapsed">${fmtTime((Date.now() - a.startedAt) / 1000)}</span><p class="small muted num">${done}/${total} Sätze</p></div>
  </section>
  <div class="progress-line" aria-hidden="true"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div>
  ${(() => { const sph = phaseOf(S.plan, a.week); return sph ? `<p class="phase-note"><strong>${esc(sph.name)}:</strong> ${esc(sph.text)}</p>` : a.deload ? '<p class="phase-note"><strong>Deload:</strong> halbe Sätze, etwas leichteres Gewicht.</p>' : ''; })()}
  ${a.exercises.map((e, ei) => {
    const r = parseRange(e.target.reps);
    const partner = e.ss ? a.exercises[ei + 1] : null;
    const prevSs = ei > 0 && a.exercises[ei - 1].ss ? a.exercises[ei - 1] : null;
    const d = e.sets.filter((s) => s.done).length;
    const wPh = e.sug && e.sug.weight ? fmt(e.sug.weight) : '';
    const rPh = e.sug && e.sug.reps ? e.sug.reps : r ? r.lo : '';
    return `
    <article class="ex-card ${d === e.sets.length && d ? 'complete' : ''}">
      <header class="ex-head"><div><h3>${esc(e.name)}${infoBtn(e.name, e.notes)}</h3><p class="target">Ziel ${e.target.sets} × ${esc(e.target.reps)} · ${esc(e.target.label || intensity(e.target.rpe))} · Pause ${fmtTime(e.target.rest)}</p></div><span class="count">${d}/${e.sets.length}</span></header>
      ${e.sug ? `<p class="sug"><span>Zuletzt (${dateShort(e.sug.date)}): ${esc(e.sug.lastText)}</span>${e.sug.weight || e.sug.reps ? `<strong>Heute: ${e.sug.weight ? fmt(e.sug.weight) + ' kg × ' : ''}${e.sug.reps || ''}</strong>` : ''}${e.sug.reason ? `<em>${esc(e.sug.reason)}</em>` : ''}</p>` : ''}
      ${partner ? `<p class="ss-line">Supersatz: nach jedem Satz direkt weiter mit <strong>${esc(partner.name)}</strong>, Pause erst danach.</p>` : ''}
      ${prevSs ? `<p class="ss-line">Supersatz mit <strong>${esc(prevSs.name)}</strong>: nach diesem Satz Pause, dann zurück.</p>` : ''}
      ${e.notes ? `<p class="note">${esc(e.notes)}</p>` : ''}
      <div class="sets">
        <div class="set-row head"><span>Satz</span><span>kg</span><span>Wdh.</span><span>${isRir() ? 'RIR' : 'RPE'}</span><span></span></div>
        ${e.sets.map((s, i) => `
        <div class="set-row ${s.done ? 'done' : ''}">
          <span class="set-no">${i + 1}</span>
          <input id="w-${e.id}-${i}" inputmode="decimal" autocomplete="off" aria-label="Gewicht Satz ${i + 1}" placeholder="${esc(wPh)}" value="${esc(s.w)}" data-bind="set" data-ex="${e.id}" data-i="${i}" data-f="w">
          <input id="r-${e.id}-${i}" inputmode="numeric" autocomplete="off" aria-label="Wiederholungen Satz ${i + 1}" placeholder="${esc(rPh)}" value="${esc(s.r)}" data-bind="set" data-ex="${e.id}" data-i="${i}" data-f="r">
          ${rpeSelect(`p-${e.id}-${i}`, s.rpe, `data-bind="set" data-ex="${e.id}" data-i="${i}" data-f="rpe"`)}
          <button class="tick" type="button" aria-pressed="${s.done}" aria-label="Satz ${i + 1} ${s.done ? 'nicht mehr abhaken' : 'abhaken'}" data-act="set-done" data-ex="${e.id}" data-i="${i}">${ICON.check}</button>
        </div>`).join('')}
      </div>
      <div class="ex-actions"><button class="btn" type="button" data-act="add-set" data-ex="${e.id}">+ Satz</button>${e.sets.length > 1 ? `<button class="btn" type="button" data-act="remove-set" data-ex="${e.id}">− Satz</button>` : ''}</div>
    </article>`;
  }).join('')}
  <div class="panel">
    <label class="field" for="new-ex">Übung hinzufügen</label>
    <div class="add-ex"><input class="inp" id="new-ex" placeholder="z. B. Wadenheben" value="${esc(S.ui.newEx)}" data-bind="ui" data-f="newEx"><button class="btn" type="button" data-act="add-ex-session">Hinzufügen</button></div>
  </div>
  ${c && c.kind === 'finish' ? `<div class="confirm ok"><strong>Training abschließen?</strong><p class="small">${done ? `${done} Sätze werden gespeichert. Nicht abgehakte Sätze fallen weg.` : 'Du hast noch keinen Satz abgehakt. Es wird nichts gespeichert.'}</p><div class="btn-row">${done ? '<button class="btn primary" type="button" data-act="finish-confirm">Speichern</button>' : ''}<button class="btn" type="button" data-act="confirm-cancel">Weiter trainieren</button></div></div>`
    : c && c.kind === 'discard' ? `<div class="confirm"><strong>Training verwerfen?</strong><p class="small">Alle Einträge dieser Einheit gehen verloren.</p><div class="btn-row"><button class="btn danger solid" type="button" data-act="discard-confirm">Verwerfen</button><button class="btn" type="button" data-act="confirm-cancel">Abbrechen</button></div></div>`
    : `<button class="btn primary big" type="button" data-act="finish-ask">Training abschließen</button>
       <button class="btn ghost" type="button" data-act="discard-ask" style="align-self:center">Training verwerfen</button>`}`;
}

function planDayCard(d, di, editable) {
  const sw = S.ui.swap;
  if (!editable) {
    return `<article class="day">
      <div class="day-head"><div><h3>${esc(d.name)}</h3>${d.focus ? `<p class="small muted">${esc(d.focus)}</p>` : ''}</div><span class="small muted num">${d.exercises.length} Übungen</span></div>
      <ul class="ex-list">${d.exercises.map((ex) => exLi(ex, true)).join('')}</ul>
    </article>`;
  }
  return `<article class="day">
    <div class="edit-ex">
      <div class="day-fields"><label class="field">Name des Tages<input id="dn-${d.id}" value="${esc(d.name)}" data-bind="day" data-day="${d.id}" data-f="name"></label>
      <label class="field">Woche<input id="dw-${d.id}" value="${esc(d.week || '')}" placeholder="A, B …" maxlength="3" data-bind="day" data-day="${d.id}" data-f="week"></label></div>
      <label class="field">Fokus<input id="df-${d.id}" value="${esc(d.focus)}" placeholder="z. B. Brust, Schultern" data-bind="day" data-day="${d.id}" data-f="focus"></label>
    </div>
    ${d.exercises.map((ex, i) => `
    <div class="edit-ex">
      <label class="field">Übung<input id="en-${ex.id}" value="${esc(ex.name)}" data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="name"></label>
      <div class="edit-grid">
        <label class="field">Sätze<input id="es-${ex.id}" inputmode="numeric" value="${ex.sets}" data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="sets"></label>
        <label class="field">Wdh.<input id="er-${ex.id}" value="${esc(ex.reps)}" data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="reps"></label>
        <label class="field">${isRir() ? 'RIR' : 'RPE'}<input id="ep-${ex.id}" inputmode="decimal" value="${fmt(isRir() ? 10 - ex.rpe : ex.rpe)}" data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="rpe"></label>
        <label class="field">Pause (s)<input id="et-${ex.id}" inputmode="numeric" value="${ex.rest}" data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="rest"></label>
      </div>
      <label class="field">Hinweis<input id="eh-${ex.id}" value="${esc(ex.notes)}" placeholder="optional" data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="notes"></label>
      <div class="ex-tools">
        <button class="btn" type="button" style="padding:7px 10px;font-size:.85rem" data-act="ex-info" data-name="${esc(ex.name)}" data-note="${esc(ex.notes || '')}">Anleitung</button>
        ${i < d.exercises.length - 1 ? `<label class="check"><input type="checkbox" id="ess-${ex.id}" ${ex.ss ? 'checked' : ''} data-bind="ex" data-day="${d.id}" data-ex="${ex.id}" data-f="ss">Supersatz mit nächster Übung</label>` : ''}
        ${aiState !== 'off' ? `<button class="btn" type="button" style="padding:7px 10px;font-size:.85rem" data-act="swap" data-day="${d.id}" data-ex="${ex.id}">${ICON.swap.replace('<svg', '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"')} Alternativen</button>` : ''}
        <button class="icon-btn" type="button" aria-label="Nach oben" data-act="ex-move" data-dir="-1" data-day="${d.id}" data-ex="${ex.id}" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button>
        <button class="icon-btn" type="button" aria-label="Nach unten" data-act="ex-move" data-dir="1" data-day="${d.id}" data-ex="${ex.id}" ${i === d.exercises.length - 1 ? 'disabled' : ''}>${ICON.down}</button>
        <button class="icon-btn" type="button" aria-label="Übung entfernen" data-act="ex-del" data-day="${d.id}" data-ex="${ex.id}">${ICON.trash}</button>
      </div>
      ${sw && sw.exId === ex.id ? `<div class="swap">
        ${sw.status === 'running' ? '<div class="gen-status"><span class="spinner"></span><span class="small">Claude sucht Alternativen …</span></div>' : ''}
        ${sw.status === 'error' ? `<p class="err">${esc(sw.error)}</p>` : ''}
        ${sw.items.map((it) => `<button class="swap-item" type="button" data-act="swap-pick" data-name="${esc(it.name)}"><span>${esc(it.name)}</span>${it.why ? `<small>${esc(it.why)}</small>` : ''}</button>`).join('')}
        <button class="link" type="button" data-act="swap-close" style="justify-self:start">Schließen</button>
      </div>` : ''}
    </div>`).join('')}
    <div class="day-foot">
      <button class="btn" type="button" data-act="ex-add" data-day="${d.id}">+ Übung</button>
      ${S.plan.days.length > 1 ? `<button class="btn danger" type="button" data-act="day-del" data-day="${d.id}">Tag entfernen</button>` : ''}
    </div>
  </article>`;
}

function planGroups(p) {
  const labels = weekLabels(p);
  if (!labels.length) return [{ title: '', days: p.days }];
  return [...labels, ''].map((l) => {
    const days = p.days.filter((d) => (d.week || '') === l);
    return { title: l ? `Woche ${l} · ${days.length} ${days.length === 1 ? 'Tag' : 'Tage'}` : 'Ohne Woche', days };
  }).filter((g) => g.days.length);
}

function viewPlan() {
  if (!S.plan) {
    return `<section class="hero"><p class="eyebrow">Plan</p><h1>Noch kein Trainingsplan</h1><p>Lass dir einen erstellen, füge einen vorhandenen ein oder stell ihn selbst zusammen.</p></section>
    <div class="choices">
      ${aiState !== 'off' ? `<button class="choice primary" type="button" data-act="go-create" data-tab="new">Plan von Claude erstellen lassen<small>Auf Basis deines Ziels</small></button>
      <button class="choice" type="button" data-act="go-create" data-tab="import">Vorhandenen Plan einfügen<small>Text aus deinem Claude-Chat einfügen</small></button>` : ''}
      <button class="choice" type="button" data-act="manual-plan">Selbst zusammenstellen</button>
      <button class="choice" type="button" data-act="example-load">Beispielplan laden</button>
    </div>`;
  }
  const p = S.plan, ed = S.ui.edit, c = S.ui.confirm;
  return `
  <section class="plan-head">
    <div class="section-head"><p class="eyebrow">${p.source === 'example' ? 'Beispielplan' : p.source === 'import' ? 'Eingefügter Plan' : p.source === 'manual' ? 'Eigener Plan' : 'Von Claude erstellt'} · ${p.days.length} Tage</p>
      <button class="btn ${ed ? 'primary' : ''}" type="button" data-act="edit-toggle">${ed ? 'Fertig' : 'Bearbeiten'}</button></div>
    ${ed ? `<label class="field">Name des Plans<input id="plan-name" value="${esc(p.name)}" data-bind="plan" data-f="name"></label>
            <div class="row2"><label class="field">Länge des Zyklus (Wochen)<input id="plan-weeks" inputmode="numeric" value="${p.weeks}" data-bind="plan" data-f="weeks"></label>
            <label class="field">Start des Zyklus<input id="plan-start" type="date" value="${dayKey(planStart(p))}" data-bind="plan" data-f="startDate"></label></div>
            <label class="field">Intensität angeben als<select id="plan-scale" data-bind="plan" data-f="scale"><option value="rpe" ${p.scale !== 'rir' ? 'selected' : ''}>RPE (1–10, 10 = Versagen)</option><option value="rir" ${p.scale === 'rir' ? 'selected' : ''}>RIR (Wiederholungen im Tank)</option></select></label>
            <div class="field">Wiederholungen im Tank pro Woche: Zahl, Bereich wie 0-1 oder D für Deload (leer = Wert der Übung)<div class="rir-edit">${Array.from({ length: p.weeks || 6 }, (_, i) => { const raw = Array.isArray(p.rir) && p.rir[i] != null ? String(p.rir[i]) : ''; return `<label><small>W${i + 1}</small><input id="plan-rir-${i}" autocomplete="off" value="${esc(raw)}" data-bind="rir" data-i="${i}"></label>`; }).join('')}</div></div>
            <label class="check"><input type="checkbox" id="plan-repeat" ${p.repeat ? 'checked' : ''} data-bind="plan" data-f="repeat">Danach automatisch mit Zyklus 2 weitermachen</label>`
         : `<h1>${esc(p.name)}</h1>${cycleBar()}`}
    ${!ed && p.summary ? `<p class="muted">${esc(p.summary)}</p>` : ''}
    ${!ed && p.progression ? `<p class="small"><strong>Steigerung:</strong> ${esc(p.progression)}</p>` : ''}
    ${!ed ? rirRow(p) : ''}
  </section>
  ${planGroups(p).map((g) => `${g.title ? `<p class="week-label">${esc(g.title)}</p>` : ''}${g.days.map((d) => planDayCard(d, 0, ed)).join('')}`).join('')}
  ${ed ? `<button class="btn" type="button" data-act="day-add">+ Trainingstag</button>
    ${c && c.kind === 'plan-del' ? `<div class="confirm"><strong>Plan löschen?</strong><p class="small">Der Plan wird entfernt. Dein Trainingsverlauf bleibt erhalten.</p><div class="btn-row"><button class="btn danger solid" type="button" data-act="plan-del-confirm">Plan löschen</button><button class="btn" type="button" data-act="confirm-cancel">Abbrechen</button></div></div>`
      : '<button class="btn danger" type="button" data-act="plan-del-ask">Plan löschen</button>'}`
  : `<div class="btn-row">${aiState !== 'off' ? '<button class="btn" type="button" data-act="go-create" data-tab="new">Neuen Plan erstellen</button><button class="btn" type="button" data-act="go-create" data-tab="import">Plan einfügen</button>' : '<button class="btn" type="button" data-act="manual-plan">Neuer leerer Plan</button>'}</div>`}`;
}

function chipGroup(group, list, multi) {
  const val = S.form[group];
  return list.map((it) => {
    const id = typeof it === 'string' ? it : it.id;
    const on = multi ? val.includes(id) : val === id;
    return typeof it === 'string' || !it.hint
      ? `<button class="chip" type="button" aria-pressed="${on}" data-act="chip" data-group="${group}" data-val="${esc(id)}" ${multi ? 'data-multi="1"' : ''}>${esc(typeof it === 'string' ? it : it.label)}</button>`
      : `<button class="chip-card" type="button" aria-pressed="${on}" data-act="chip" data-group="${group}" data-val="${esc(id)}">${esc(it.label)}<small>${esc(it.hint)}</small></button>`;
  }).join('');
}

function viewCreate() {
  const f = S.form, g = S.gen, tab = S.ui.tab;
  const running = g && g.status === 'running';
  let status = '';
  if (g && g.status === 'running') status = `<div class="panel"><div class="gen-status"><span class="spinner"></span><span id="gen-msg" class="small">Claude denkt nach …</span></div><p class="small muted">Folge den beiden Schritten im Fenster. Wenn du es geschlossen hast, starte einfach neu.</p><button class="btn" type="button" data-act="gen-stop">Abbrechen</button></div>`;
  else if (g && g.status === 'error') status = `<div class="panel"><p class="err">${esc(g.error)}</p></div>`;
  else if (g && g.status === 'done') {
    const p = g.result;
    status = `<section class="stack" id="gen-result">
      <div class="panel"><p class="eyebrow">Vorschlag · ${p.days.length} Tage · ${p.weeks} Wochen</p><h2>${esc(p.name)}</h2>${p.summary ? `<p class="muted">${esc(p.summary)}</p>` : ''}${p.progression ? `<p class="small"><strong>Steigerung:</strong> ${esc(p.progression)}</p>` : ''}</div>
      ${planGroups(p).map((gr) => `${gr.title ? `<p class="week-label">${esc(gr.title)}</p>` : ''}${gr.days.map((d) => `<article class="day"><div class="day-head"><div><h3>${esc(d.name)}</h3>${d.focus ? `<p class="small muted">${esc(d.focus)}</p>` : ''}</div></div><ul class="ex-list">${d.exercises.map((ex) => exLi(ex, false, true)).join('')}</ul></article>`).join('')}`).join('')}
      ${S.plan ? '<p class="small muted">Ersetzt deinen aktuellen Plan. Dein Trainingsverlauf bleibt erhalten.</p>' : ''}
      <button class="btn primary big" type="button" data-act="gen-accept">Plan übernehmen</button>
      <div class="btn-row"><button class="btn" type="button" data-act="${g.kind === 'import' ? 'import-run' : 'gen-run'}">Noch einmal erstellen</button><button class="btn ghost" type="button" data-act="gen-discard">Verwerfen</button></div>
    </section>`;
  }
  if (aiState === 'off') {
    return `<button class="btn ghost back" type="button" data-act="go" data-to="${S.plan ? 'plan' : 'training'}">← Zurück</button>
    <section class="hero"><h1>Neuer Trainingsplan</h1><p>Claude ist in dieser Ansicht nicht verfügbar. Du kannst deinen Plan selbst zusammenstellen oder mit dem Beispielplan starten.</p></section>
    <div class="choices"><button class="choice" type="button" data-act="manual-plan">Selbst zusammenstellen</button><button class="choice" type="button" data-act="example-load">Beispielplan laden</button></div>`;
  }
  const body = tab === 'import'
    ? `<div class="panel">
        <label class="field" for="f-import">Füge deinen Plan hier ein. Format egal, Claude liest Tage, Übungen, Sätze und Wiederholungen heraus.</label>
        <textarea class="inp" id="f-import" rows="12" style="min-height:220px;resize:vertical" placeholder="Tag 1 – Push&#10;Bankdrücken 4×6–8&#10;Schulterdrücken 3×8–10&#10;…" data-bind="form" data-f="importText">${esc(f.importText)}</textarea>
        <button class="btn primary big" type="button" data-act="import-run" ${running ? 'disabled' : ''}>Plan einlesen</button>
      </div>`
    : `<div class="panel">
        <fieldset><legend>Was willst du erreichen?</legend><div class="goal-grid">${chipGroup('goal', GOALS)}</div></fieldset>
        <fieldset><legend>Wie lange trainierst du schon?</legend><div class="goal-grid">${chipGroup('level', LEVELS)}</div></fieldset>
        <div class="row2">
          <label class="field">Tage pro Woche<select id="f-days" data-bind="form" data-f="days">${['2', '3', '4', '5', '6'].map((v) => `<option ${f.days === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
          <label class="field">Minuten pro Einheit<select id="f-minutes" data-bind="form" data-f="minutes">${['30', '45', '60', '75', '90'].map((v) => `<option ${f.minutes === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        </div>
        <fieldset><legend>Wochenrhythmus</legend><div class="goal-grid">
          <button class="chip-card" type="button" aria-pressed="${!f.ab}" data-act="set-ab" data-val="0">Jede Woche gleich<small>Ein fester Satz Trainingstage</small></button>
          <button class="chip-card" type="button" aria-pressed="${!!f.ab}" data-act="set-ab" data-val="1">A/B-Wochen im Wechsel<small>Zwei Varianten für mehr Abwechslung</small></button>
        </div></fieldset>
        <fieldset><legend>Wo trainierst du?</legend><div class="chips">${chipGroup('equipment', EQUIP)}</div></fieldset>
        <fieldset><legend>Schwerpunkte <span class="muted small">(optional)</span></legend><div class="chips">${chipGroup('focus', FOCUS, true)}</div></fieldset>
        <label class="field">Beschwerden oder Einschränkungen<input id="f-limits" value="${esc(f.limits)}" placeholder="z. B. Knie links, kein Überkopfdrücken" data-bind="form" data-f="limits"></label>
        <label class="field">Sonst noch etwas?<textarea id="f-notes" placeholder="z. B. 1,82 m, 84 kg, will Klimmzüge schaffen, am Wochenende laufen" data-bind="form" data-f="notes">${esc(f.notes)}</textarea></label>
        <button class="btn primary big" type="button" data-act="gen-run" ${running ? 'disabled' : ''}>Plan erstellen lassen</button>
      </div>`;
  return `<button class="btn ghost back" type="button" data-act="go" data-to="${S.plan ? 'plan' : 'training'}">← Zurück</button>
  <section class="hero"><h1>Neuer Trainingsplan</h1></section>
  <div class="seg" role="group" aria-label="Art"><button type="button" aria-pressed="${tab === 'new'}" data-act="gen-tab" data-tab="new">Neu erstellen</button><button type="button" aria-pressed="${tab === 'import'}" data-act="gen-tab" data-tab="import">Plan einfügen</button></div>
  ${g && g.status === 'done' ? '' : body}
  ${status}`;
}

function viewHistory() {
  if (!S.workouts.length) {
    return `<section class="hero"><p class="eyebrow">Verlauf</p><h1>Noch keine Einheiten</h1></section>
    <div class="panel empty"><p>Hier erscheinen deine abgeschlossenen Trainings mit allen Sätzen, Gewichten und Wiederholungen.</p>${S.plan ? '<button class="btn primary" type="button" data-act="go" data-to="training">Zum Training</button>' : ''}</div>`;
  }
  const groups = [];
  S.workouts.forEach((w) => {
    const k = weekStart(w.startedAt);
    let g = groups.find((x) => x.k === k);
    if (!g) { g = { k, items: [] }; groups.push(g); }
    g.items.push(w);
  });
  const c = S.ui.confirm;
  return `<section class="hero"><p class="eyebrow">Verlauf</p><h1>${S.workouts.length} ${S.workouts.length === 1 ? 'Einheit' : 'Einheiten'}</h1></section>
  ${groups.map((g) => `
    <p class="week-label num">KW ${isoWeek(g.k)} · ${dateShort(g.k)} – ${dateShort(g.k + 6 * DAY)} · ${g.items.length} ${g.items.length === 1 ? 'Einheit' : 'Einheiten'}</p>
    ${g.items.map((w) => {
      const st = workoutStats(w), open = S.ui.openHist === w.id;
      return `<article class="hist">
        <button class="hist-head" type="button" aria-expanded="${open}" data-act="hist-toggle" data-id="${w.id}">
          <span class="hist-date">${esc(weekday(w.startedAt))}<small>${dateShort(w.startedAt)}</small></span>
          <span class="hist-name">${esc(w.dayName)}</span>
          <span class="hist-meta">${w.duration ? fmtTime(w.duration).replace(/:\d\d$/, '') + ' min' : 'nachgetragen'} · ${st.sets} Sätze</span>
        </button>
        ${open ? `<div class="hist-body">
          ${w.note ? `<p class="small muted">${esc(w.note)}</p>` : ''}
          ${st.sets ? `<p class="small muted num">${w.duration ? 'Dauer ' + fmtTime(w.duration) + ' · ' : ''}Volumen ${fmt(st.vol, 0)} kg</p>` : ''}
          ${w.exercises.map((e) => `<div class="hist-ex"><strong>${esc(e.name)}</strong><span class="hist-sets">${e.sets.map((s) => `${s.weight ? fmt(s.weight) + ' kg × ' : ''}${s.reps}${s.rpe != null ? (isRir() ? ' · RIR ' + fmt(10 - s.rpe) : ' @' + fmt(s.rpe)) : ''}`).join('  ·  ')}</span></div>`).join('')}
          ${c && c.kind === 'hist-del' && c.id === w.id
            ? `<div class="confirm"><strong>Einheit löschen?</strong><p class="small">Das lässt sich nicht rückgängig machen.</p><div class="btn-row"><button class="btn danger solid" type="button" data-act="hist-del-confirm" data-id="${w.id}">Löschen</button><button class="btn" type="button" data-act="confirm-cancel">Abbrechen</button></div></div>`
            : `<button class="btn danger" type="button" style="justify-self:start" data-act="hist-del-ask" data-id="${w.id}">Einheit löschen</button>`}
        </div>` : ''}
      </article>`;
    }).join('')}`).join('')}`;
}

function lineChart(pts) {
  const W = 600, H = 230, pl = 46, pr = 54, pt = 16, pb = 30;
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(...ys), y1 = Math.max(...ys);
  const span = Math.max(y1 - y0, 5);
  y0 = Math.max(0, Math.floor((y0 - span * 0.2) / 5) * 5); y1 = Math.ceil((y1 + span * 0.2) / 5) * 5;
  if (y1 === y0) y1 = y0 + 5;
  const sx = (x) => pl + (x1 === x0 ? 0.5 : (x - x0) / (x1 - x0)) * (W - pl - pr);
  const sy = (y) => pt + (1 - (y - y0) / (y1 - y0)) * (H - pt - pb);
  const ticks = [0, 1, 2, 3, 4].map((i) => y0 + ((y1 - y0) * i) / 4);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
  const area = `${line} L${sx(pts[pts.length - 1].x).toFixed(1)},${sy(y0)} L${sx(pts[0].x).toFixed(1)},${sy(y0)} Z`;
  const last = pts[pts.length - 1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Verlauf geschätztes Maximalgewicht">
    ${ticks.map((t) => `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${sy(t)}" y2="${sy(t)}"/><text class="axis-t" x="${pl - 8}" y="${sy(t) + 4}" text-anchor="end">${fmt(t, 0)}</text>`).join('')}
    <path class="area" d="${area}"/>
    <path class="line" d="${line}"/>
    ${pts.map((p, i) => `<circle class="dot ${i === pts.length - 1 ? 'end' : ''}" cx="${sx(p.x)}" cy="${sy(p.y)}" r="${i === pts.length - 1 ? 5 : 3.5}"/>`).join('')}
    <text class="val-t" x="${sx(last.x) + 9}" y="${sy(last.y) + 4}">${fmt(last.y)} kg</text>
    <text class="axis-t" x="${pl}" y="${H - 8}">${dateShort(x0)}</text>
    <text class="axis-t" x="${W - pr}" y="${H - 8}" text-anchor="end">${dateShort(x1)}</text>
  </svg>`;
}
function barChart(weeks) {
  const W = 600, H = 200, pl = 8, pr = 8, pt = 22, pb = 28;
  const max = Math.max(1, ...weeks.map((w) => w.v));
  const bw = (W - pl - pr) / weeks.length;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Trainingsvolumen pro Woche">
    <line class="grid" x1="${pl}" x2="${W - pr}" y1="${H - pb}" y2="${H - pb}"/>
    ${weeks.map((w, i) => {
      const h = w.v ? Math.max(3, (w.v / max) * (H - pt - pb)) : 3;
      const x = pl + i * bw + bw * 0.18, y = H - pb - h, bwi = bw * 0.64;
      return `<rect class="bar ${w.v ? (i === weeks.length - 1 ? 'now' : '') : 'empty'}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bwi.toFixed(1)}" height="${h.toFixed(1)}" rx="3"/>
        ${w.v ? `<text class="val-t" x="${(x + bwi / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle">${w.v >= 1000 ? fmt(w.v / 1000) + ' t' : fmt(w.v, 0)}</text>` : ''}
        <text class="axis-t" x="${(x + bwi / 2).toFixed(1)}" y="${H - 9}" text-anchor="middle">KW ${isoWeek(w.k)}</text>`;
    }).join('')}
  </svg>`;
}

function viewProgress() {
  if (!S.workouts.length) {
    return `<section class="hero"><p class="eyebrow">Fortschritt</p><h1>Noch keine Daten</h1></section>
    <div class="panel empty"><p>Nach deinem ersten Training siehst du hier Volumen pro Woche, deine Serie und wie sich deine Kraft pro Übung entwickelt.</p></div>`;
  }
  const now = weekStart(Date.now());
  const weeks = Array.from({ length: 8 }, (_, i) => ({ k: now - (7 - i) * 7 * DAY, v: 0, n: 0 }));
  S.workouts.forEach((w) => { const k = weekStart(w.startedAt); const wk = weeks.find((x) => x.k === k); if (wk) { wk.v += workoutStats(w).vol; wk.n++; } });
  const weekSet = new Set(S.workouts.map((w) => weekStart(w.startedAt)));
  let streak = 0, k = weekSet.has(now) ? now : now - 7 * DAY;
  while (weekSet.has(k)) { streak++; k -= 7 * DAY; }
  const thisWeek = weeks[weeks.length - 1].n;

  const byEx = new Map();
  [...S.workouts].reverse().forEach((w) => (w.exercises || []).forEach((e) => {
    const best = Math.max(0, ...e.sets.map((s) => e1rm(s.weight || 0, s.reps || 0)));
    const topSet = e.sets.reduce((b, s) => ((s.weight || 0) > (b.weight || 0) || ((s.weight || 0) === (b.weight || 0) && s.reps > b.reps) ? s : b), e.sets[0]);
    if (!byEx.has(e.name)) byEx.set(e.name, []);
    byEx.get(e.name).push({ x: w.startedAt, y: Math.round(best * 10) / 10, top: topSet });
  }));
  const names = [...byEx.keys()].filter((n) => byEx.get(n).some((p) => p.y > 0)).sort((a, b) => byEx.get(b).length - byEx.get(a).length || a.localeCompare(b, 'de'));
  if (!S.ui.progEx || !names.includes(S.ui.progEx)) S.ui.progEx = names[0] || null;
  const pts = S.ui.progEx ? byEx.get(S.ui.progEx).filter((p) => p.y > 0) : [];
  const bestP = pts.reduce((b, p) => (!b || p.y > b.y ? p : b), null);
  return `<section class="hero"><p class="eyebrow">Fortschritt</p><h1>Dranbleiben zahlt sich aus</h1></section>
  <div class="tiles">
    <div class="tile"><b>${thisWeek}</b><span>Einheiten diese Woche</span></div>
    <div class="tile"><b>${streak}</b><span>${streak === 1 ? 'Woche' : 'Wochen'} in Folge</span></div>
    <div class="tile"><b>${S.workouts.length}</b><span>Einheiten gesamt</span></div>
  </div>
  <section class="panel"><div class="section-head"><h3>Volumen pro Woche</h3><span class="small muted">kg × Wdh., letzte 8 Wochen</span></div>${barChart(weeks)}</section>
  <section class="panel">
    <div class="section-head"><h3>Kraft pro Übung</h3><span class="small muted">geschätztes 1RM</span></div>
    ${names.length ? `<label class="field">Übung<select id="prog-ex" data-bind="prog">${names.map((n) => `<option ${n === S.ui.progEx ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
      ${pts.length >= 2 ? lineChart(pts) : '<p class="small muted">Ab zwei Einheiten mit dieser Übung siehst du hier eine Kurve.</p>'}
      ${bestP ? `<p class="small muted num">Bestwert ${fmt(bestP.y)} kg am ${dateShort(bestP.x)} · Bester Satz zuletzt ${fmt(pts[pts.length - 1].top.weight)} kg × ${pts[pts.length - 1].top.reps}</p>` : ''}
      <ul class="pr-list">${pts.slice(-6).reverse().map((p) => `<li><span>${esc(weekday(p.x))}, ${dateShort(p.x)}</span><span>${fmt(p.top.weight)} kg × ${p.top.reps}</span><span class="muted">≈ ${fmt(p.y)} kg</span></li>`).join('')}</ul>`
      : '<p class="small muted">Trag Gewichte ein, damit hier deine Kraftentwicklung erscheint.</p>'}
  </section>`;
}

/* ---------- exercise guide ---------- */
function exSlug(name) {
  return String(name || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'uebung';
}
const GUIDES = {};
(window.SATZ_GUIDES || []).forEach((g) => { GUIDES[exSlug(g.name)] = g; (g.aliases || []).forEach((al) => { GUIDES[exSlug(al)] = g; }); });
const infoBtn = (name, note) => `<button class="info-btn" type="button" aria-label="Anleitung: ${esc(name)}" data-act="ex-info" data-name="${esc(name)}" data-note="${esc(note || '')}">i</button>`;
function normInfo(r) {
  if (!r || typeof r !== 'object') return null;
  const arr = (x) => (Array.isArray(x) ? x.map(str).filter(Boolean).slice(0, 8) : []);
  const d = { muscles: str(r.muscles), setup: str(r.setup), steps: arr(r.steps), cues: arr(r.cues), mistakes: arr(r.mistakes), breathing: str(r.breathing) };
  return d.steps.length ? d : null;
}
async function openInfo(name, note, refresh) {
  const key = exSlug(name), cached = S.exinfo[key] || GUIDES[key];
  const inf = { name, note: note || '', key, data: cached || null, status: cached && !refresh ? 'done' : 'running', error: null };
  S.ui.info = inf; render();
  const cb = document.getElementById('sheet-close'); if (cb) cb.focus();
  if (inf.status === 'done') return;
  const smp = aiState === 'off' ? null : await getSample();
  if (S.ui.info !== inf) return;
  if (!smp) { inf.status = 'off'; render(); return; }
  const prompt = [
    `Erkläre die Kraftübung "${name}" für jemanden, der im Fitnessstudio trainiert.` + (note ? ` Hinweis aus dem Trainingsplan: "${note}".` : ''),
    'Sachlich, auf Deutsch, kurze klare Sätze, keine Übertreibungen. Beschreibe die übliche, sichere Ausführung.',
    'Antworte nur mit JSON in dieser Form:',
    '{"muscles":"Hauptmuskeln, kurz","setup":"1-2 Sätze zu Einstellung und Ausgangsposition","steps":["3 bis 5 kurze Schritte der Ausführung"],"cues":["3 bis 4 Punkte, worauf man achten muss"],"mistakes":["2 bis 3 häufige Fehler"],"breathing":"1 Satz zur Atmung"}'
  ].join('\n');
  try {
    const r = await smp.json(prompt, { modelTier: 'default', cache: refresh ? false : true });
    if (S.ui.info !== inf) return;
    const data = normInfo(r);
    if (!data) throw { message: 'Die Antwort ließ sich nicht lesen. Versuch es noch einmal.' };
    data.name = name; data.at = Date.now();
    S.exinfo[key] = data; saveExinfo(key);
    inf.data = data; inf.status = 'done';
  } catch (e) {
    if (S.ui.info !== inf) return;
    inf.status = 'error'; inf.error = aiErr(e) || 'Abgebrochen.';
  }
  render();
}
function renderSheet() {
  const el = $('#sheet'), inf = S.ui.info;
  if (!inf) { if (!el.hidden) { el.hidden = true; el.innerHTML = ''; syncSheetLock(); } return; }
  el.hidden = false; syncSheetLock();
  const d = inf.data;
  const yt = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(inf.name + ' richtige Ausführung');
  const list = (items, tag) => `<${tag}>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</${tag}>`;
  const scrollTop = el.querySelector('.sheet-body') ? el.querySelector('.sheet-body').scrollTop : 0;
  el.innerHTML = `<div class="sheet-backdrop" data-act="info-close"></div>
    <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="sheet-head"><div><p class="eyebrow">So geht's</p><h2 id="sheet-title">${esc(inf.name)}</h2>${d && d.muscles ? `<p class="small muted">${esc(d.muscles)}</p>` : ''}</div>
        <button class="icon-btn" type="button" id="sheet-close" data-act="info-close" aria-label="Schließen">${ICON.x}</button></div>
      <div class="sheet-body">
        ${inf.note ? `<p class="note">Dein Plan: ${esc(inf.note)}</p>` : ''}
        ${inf.status === 'running' ? '<div class="gen-status"><span class="spinner"></span><span class="small">Claude schreibt die Anleitung …</span></div>' : ''}
        ${inf.status === 'error' ? `<p class="err">${esc(inf.error)}</p><button class="btn" type="button" data-act="info-refresh" style="justify-self:start">Noch einmal versuchen</button>` : ''}
        ${inf.status === 'off' ? '<p class="muted">Anleitungen schreibt Claude, und Claude ist in dieser Ansicht nicht verfügbar. Über den Link unten findest du Videos zur Übung.</p>' : ''}
        ${d ? `
          ${d.setup ? `<section><h4>Ausgangsposition</h4><p>${esc(d.setup)}</p></section>` : ''}
          <section><h4>Ausführung</h4>${list(d.steps, 'ol')}</section>
          ${d.cues.length ? `<section><h4>Darauf achten</h4>${list(d.cues, 'ul')}</section>` : ''}
          ${d.mistakes.length ? `<section><h4>Häufige Fehler</h4>${list(d.mistakes, 'ul')}</section>` : ''}
          ${d.breathing ? `<section><h4>Atmung</h4><p>${esc(d.breathing)}</p></section>` : ''}
          ${d.extra ? `<section><h4>Intensitätstechnik</h4><p>${esc(d.extra)}</p></section>` : ''}` : ''}
        <a class="btn" href="${yt}" target="_blank" rel="noopener">Videos zur Übung auf YouTube ↗</a>
        ${d && inf.status === 'done' ? '<button class="link" type="button" data-act="info-refresh" style="justify-self:start">Von Claude neu erklären lassen</button>' : ''}
        <p class="small muted">Bei Schmerzen abbrechen, und im Zweifel die Technik von einer Trainerin oder einem Trainer prüfen lassen.</p>
      </div>
    </div>`;
  const body = el.querySelector('.sheet-body'); if (body && scrollTop) body.scrollTop = scrollTop;
}

/* ---------- nutrition ---------- */
const MEALS = [{ id: 'fruehstueck', label: 'Frühstück' }, { id: 'mittag', label: 'Mittagessen' }, { id: 'abend', label: 'Abendessen' }, { id: 'snack', label: 'Snacks' }];
const DEFAULT_GOALS = { kcal: 2500, protein: 150, carbs: 290, fat: 80, water: 3000, isDefault: true };
const NUTRIENTS = [['kcal', 'kcal'], ['protein', 'Eiweiß (g)'], ['carbs', 'Kohlenhydrate (g)'], ['sugar', 'davon Zucker (g)'], ['fat', 'Fett (g)'], ['fiber', 'Ballaststoffe (g)'], ['salt', 'Salz (g)']];
const goals = () => S.nut.goals || DEFAULT_GOALS;
const dayData = (k) => S.nut.days[k] || { date: k, entries: [], water: 0 };
function ensureDay(k) { if (!S.nut.days[k]) S.nut.days[k] = { date: k, entries: [], water: 0 }; return S.nut.days[k]; }
function sumEntries(list) { return list.reduce((s, e) => ({ kcal: s.kcal + (e.kcal || 0), protein: s.protein + (e.protein || 0), carbs: s.carbs + (e.carbs || 0), fat: s.fat + (e.fat || 0) }), { kcal: 0, protein: 0, carbs: 0, fat: 0 }); }
function scaleFood(food, amount) { const f = (amount || 0) / 100, p = food.per100 || {}; return { kcal: Math.round((p.kcal || 0) * f), protein: r1((p.protein || 0) * f), carbs: r1((p.carbs || 0) * f), fat: r1((p.fat || 0) * f) }; }
const macroText = (v) => `E ${fmt(v.protein)} · K ${fmt(v.carbs)} · F ${fmt(v.fat)}`;
function dateLabel(k) {
  const t = dayKey(Date.now());
  const base = keyToDate(k).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return k === t ? 'Heute, ' + base : k === shiftKey(t, -1) ? 'Gestern, ' + base : base;
}

/* barcode decoding from a photo: native BarcodeDetector, else ZXing */
let zxingP = null;
function loadZxing() {
  if (window.ZXing) return Promise.resolve(window.ZXing);
  if (!zxingP) zxingP = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js';
    s.onload = () => (window.ZXing ? res(window.ZXing) : rej(new Error('zxing')));
    s.onerror = () => { zxingP = null; rej(new Error('zxing')); };
    document.head.appendChild(s);
  });
  return zxingP;
}
function loadImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => res({ img, url }); img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
    img.src = url;
  });
}
function toCanvas(img, maxSide) {
  const sc = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.naturalWidth * sc)); c.height = Math.max(1, Math.round(img.naturalHeight * sc));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c;
}
async function decodeBarcode(file) {
  const { img, url } = await loadImage(file);
  try {
    if ('BarcodeDetector' in window) {
      try { const det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] }); const r = await det.detect(img); if (r && r.length) return r[0].rawValue; } catch (e) { /* fall back */ }
    }
    const Z = await loadZxing().catch(() => null);
    if (!Z) return null;
    const hints = new Map();
    hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E]);
    hints.set(Z.DecodeHintType.TRY_HARDER, true);
    const reader = new Z.MultiFormatReader(); reader.setHints(hints);
    for (const side of [1600, 1000, 640]) {
      try {
        const bmp = new Z.BinaryBitmap(new Z.HybridBinarizer(new Z.HTMLCanvasElementLuminanceSource(toCanvas(img, side))));
        const res = reader.decode(bmp); if (res) return res.getText();
      } catch (e) { /* try next size */ }
      await sleep(0);
    }
    return null;
  } finally { URL.revokeObjectURL(url); }
}

function emptyDraft(ean) { return { id: ean || '', ean: ean || '', name: '', brand: '', unit: 'g', portion: '', per100: { kcal: '', protein: '', carbs: '', sugar: '', fat: '', fiber: '', salt: '' } }; }
function draftFrom(food) {
  const d = emptyDraft(food.ean); d.id = food.id; d.name = food.name || ''; d.brand = food.brand || ''; d.unit = food.unit || 'g'; d.portion = food.portion ? fmt(food.portion) : '';
  NUTRIENTS.forEach(([k]) => { const v = food.per100 && food.per100[k]; d.per100[k] = v == null ? '' : fmt(v, 2); });
  return d;
}
function setBusy(a, msg) { a.back = a.step === 'busy' ? a.back : a.step; a.step = 'busy'; a.msg = msg; a.error = null; a.ctl = new AbortController(); render(); return a.ctl; }
function backFromBusy(a, err) { a.step = a.back || 'menu'; a.error = err || null; a.ctl = null; render(); }

async function onBarcodeFile(file) {
  const a = S.ui.nutAdd; if (!a) return;
  a.lastFile = file; setBusy(a, 'Barcode wird gelesen …');
  let code = null;
  try { code = await decodeBarcode(file); } catch (e) { code = null; }
  if (S.ui.nutAdd !== a || a.step !== 'busy') return;
  a.ctl = null;
  if (code) handleEan(code);
  else { a.step = 'scan-fail'; a.error = 'Kein Barcode erkannt. Fotografiere ihn gerade, nah und scharf, oder tippe die Nummer ein.'; render(); }
}
function handleEan(code) {
  const a = S.ui.nutAdd; if (!a) return;
  const ean = String(code || '').replace(/\D/g, '');
  if (ean.length < 6) { a.step = 'scan-fail'; a.error = 'Diese Nummer sieht nicht wie ein Barcode aus.'; render(); return; }
  a.ean = ean; a.error = null;
  const food = S.nut.foods[ean];
  if (food) openAmount(food);
  else lookupOff(ean);
}

/* Open Food Facts: free product database (ODbL) */
async function lookupOff(ean) {
  const a = S.ui.nutAdd; if (!a) return;
  const ctl = setBusy(a, 'Suche in Open Food Facts …');
  const timer = setTimeout(() => ctl.abort(), 9000);
  let prod = null, failed = false;
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${ean}.json?fields=product_name,product_name_de,generic_name_de,brands,nutriments,serving_quantity,product_quantity_unit`, { signal: ctl.signal });
    if (res.ok) { const j = await res.json(); if (j && j.status === 1 && j.product) prod = j.product; }
    else if (res.status !== 404) failed = true;
  } catch (e) { failed = true; }
  clearTimeout(timer);
  if (S.ui.nutAdd !== a || a.step !== 'busy') return;
  a.ctl = null;
  const draft = emptyDraft(ean);
  if (prod) {
    const n = prod.nutriments || {};
    let kcal = num(n['energy-kcal_100g']);
    if (kcal == null && num(n.energy_100g) != null) kcal = Math.round(num(n.energy_100g) / 4.184);
    const name = str(prod.product_name_de) || str(prod.product_name) || str(prod.generic_name_de);
    const brand = str(prod.brands).split(',')[0].trim();
    const unit = /^(ml|cl|l)$/i.test(str(prod.product_quantity_unit)) ? 'ml' : 'g';
    if (kcal != null) {
      const food = {
        id: ean, ean, name: name || 'Produkt ' + ean, brand, unit, portion: num(prod.serving_quantity) || null, source: 'off',
        per100: { kcal: Math.round(kcal), protein: num(n.proteins_100g) || 0, carbs: num(n.carbohydrates_100g) || 0, sugar: num(n.sugars_100g), fat: num(n.fat_100g) || 0, fiber: num(n.fiber_100g), salt: num(n.salt_100g) },
        lastAmount: null, usedAt: Date.now(), uses: 0
      };
      S.nut.foods[ean] = food; saveFood(food); openAmount(food); return;
    }
    draft.name = name; draft.brand = brand; draft.unit = unit;
    a.offNote = 'Open Food Facts kennt das Produkt, hat aber keine Nährwerte dazu.';
  } else {
    a.offNote = failed ? 'Open Food Facts war gerade nicht erreichbar (offline?).' : 'Dieses Produkt ist noch nicht in Open Food Facts.';
  }
  a.step = 'new-product'; a.draft = draft; a.labelRead = false; a.error = null; render();
}

/* Live camera scanner (ZXing) in a full-screen overlay outside #app */
let scanReader = null;
async function startLiveScan() {
  const a = S.ui.nutAdd; if (!a) return;
  const Z = window.ZXing;
  if (!Z || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    a.step = 'scan-fail'; a.error = 'Die Live-Kamera ist hier nicht verfügbar. Mach ein Foto vom Barcode oder tipp die Nummer ein.'; render(); return;
  }
  $('#scanner').hidden = false; $('#scan-msg').textContent = 'Kamera wird gestartet …';
  const hints = new Map();
  hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E]);
  const reader = new Z.BrowserMultiFormatReader(hints, 200);
  scanReader = reader;
  try {
    await reader.decodeFromConstraints({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } }, $('#scan-video'), (res) => {
      if (!res || scanReader !== reader) return;
      const code = res.getText();
      stopLiveScan();
      try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) { /* no vibration */ }
      handleEan(code);
    });
    if (scanReader === reader) $('#scan-msg').textContent = 'Halte den Barcode in den Rahmen';
  } catch (e) {
    if (scanReader !== reader) return;
    stopLiveScan();
    a.step = 'scan-fail';
    a.error = e && e.name === 'NotAllowedError'
      ? 'Kein Kamerazugriff. Erlaube ihn in den iPhone-Einstellungen (Safari → Kamera) oder tipp die Nummer ein.'
      : 'Die Kamera ließ sich nicht starten. Mach ein Foto vom Barcode oder tipp die Nummer ein.';
    render();
  }
}
function stopLiveScan() {
  const r = scanReader; scanReader = null;
  if (r) { try { r.reset(); } catch (e) { /* already stopped */ } }
  const el = $('#scanner'); if (el) el.hidden = true;
}
function openAmount(food) { const a = S.ui.nutAdd; a.step = 'amount'; a.food = food; a.error = null; a.amount = fmt(food.lastAmount || food.portion || 100); render(); }

async function readBarcodeAI() {
  const a = S.ui.nutAdd; if (!a || !a.lastFile) return;
  const smp = await getSample(); if (!smp) return;
  const ctl = setBusy(a, 'Claude liest die Nummer …');
  try {
    const r = await smp.json('Lies die Ziffernfolge unter dem Strichcode (EAN/GTIN) auf dem Foto ab. Antworte nur mit JSON: {"ean":"4006040001234"} oder {"ean":null}, wenn sie nicht lesbar ist.', { images: a.lastFile, signal: ctl.signal, modelTier: 'quick' });
    if (S.ui.nutAdd !== a) return;
    if (r && r.ean) { a.step = 'scan-fail'; handleEan(r.ean); }
    else backFromBusy(a, 'Auch Claude konnte keine Nummer lesen. Tippe sie bitte ein.');
  } catch (e) { if (S.ui.nutAdd === a) backFromBusy(a, aiErr(e)); }
}
async function readLabel(file) {
  const a = S.ui.nutAdd; if (!a || !a.draft) return;
  const smp = await getSample(); if (!smp) return;
  const ctl = setBusy(a, 'Claude liest die Nährwerttabelle …');
  const prompt = [
    'Das Foto zeigt die Verpackung bzw. die Nährwerttabelle eines Lebensmittels. Lies die Nährwerte pro 100 g (bei Getränken pro 100 ml) ab.',
    'Ist nur kJ angegeben, rechne in kcal um (kJ geteilt durch 4,184). Stehen nur Werte pro Portion da und ist die Portionsgröße angegeben, rechne auf 100 g um.',
    'Erkennst du Produktname oder Marke, trag sie ein, sonst leer lassen. Fehlende Werte als null.',
    'Antworte nur mit JSON: {"readable":true,"name":"","brand":"","unit":"g","per100":{"kcal":0,"protein":0,"carbs":0,"sugar":0,"fat":0,"fiber":0,"salt":0},"portion":null}',
    'Ist keine Nährwerttabelle lesbar: {"readable":false}'
  ].join('\n');
  try {
    const r = await smp.json(prompt, { images: file, signal: ctl.signal, modelTier: 'default' });
    if (S.ui.nutAdd !== a) return;
    if (!r || r.readable === false || !r.per100) { backFromBusy(a, 'Auf dem Foto war keine lesbare Nährwerttabelle. Versuch ein schärferes Foto oder trag die Werte selbst ein.'); return; }
    const d = a.draft;
    if (!d.name && r.name) d.name = str(r.name);
    if (!d.brand && r.brand) d.brand = str(r.brand);
    if (r.unit === 'ml') d.unit = 'ml';
    if (r.portion != null && num(r.portion)) d.portion = fmt(num(r.portion));
    NUTRIENTS.forEach(([k]) => { const v = num(r.per100[k]); if (v != null) d.per100[k] = fmt(v, 2); });
    a.labelRead = true;
    backFromBusy(a, null);
  } catch (e) { if (S.ui.nutAdd === a) backFromBusy(a, aiErr(e)); }
}
async function estimateMeal(file) {
  const a = S.ui.nutAdd; if (!a) return;
  const text = str(a.text);
  if (!file && text.length < 3) { a.error = 'Beschreib kurz, was du gegessen hast.'; render(); return; }
  const smp = await getSample(); if (!smp) return;
  const ctl = setBusy(a, file ? 'Claude schaut sich dein Essen an …' : 'Claude schätzt die Nährwerte …');
  const prompt = [
    'Schätze die Nährwerte dieser Mahlzeit' + (file ? ' auf dem Foto' : '') + '.',
    text ? 'Beschreibung: "' + text.slice(0, 2000) + '"' : '',
    'Zerlege sie in einzelne Lebensmittel mit realistischen Mengen in Gramm (Getränke in ml, als "grams" angeben). Nutze übliche Nährwerte für Deutschland. Mengenangaben aus der Beschreibung haben Vorrang.',
    'Antworte nur mit einem JSON-Array: [{"name":"Magerquark","grams":250,"kcal":168,"protein":30,"carbs":10,"fat":0.5}]'
  ].filter(Boolean).join('\n');
  try {
    const opts = { signal: ctl.signal, modelTier: 'default', cache: false };
    if (file) opts.images = file;
    const arr = await smp.json(prompt, opts);
    if (S.ui.nutAdd !== a) return;
    const items = (Array.isArray(arr) ? arr : []).filter((x) => x && x.name).slice(0, 20).map((x) => ({
      name: str(x.name), grams: Math.max(0, Math.round(num(x.grams) || 0)), kcal: Math.max(0, Math.round(num(x.kcal) || 0)),
      protein: r1(Math.max(0, num(x.protein) || 0)), carbs: r1(Math.max(0, num(x.carbs) || 0)), fat: r1(Math.max(0, num(x.fat) || 0))
    }));
    if (!items.length) { backFromBusy(a, 'Claude konnte daraus keine Lebensmittel ableiten. Beschreib es etwas genauer.'); return; }
    a.items = items; a.step = 'estimate'; a.ctl = null; a.error = null; render();
  } catch (e) { if (S.ui.nutAdd === a) backFromBusy(a, aiErr(e)); }
}

function macroBar(label, val, goal) {
  const pct = goal ? Math.min(100, (val / goal) * 100) : 0, over = goal && val > goal * 1.05;
  return `<div class="macro"><div class="macro-top"><span>${label}</span><span class="num">${fmt(val, 0)} / ${fmt(goal, 0)} g</span></div><div class="bar-track"><span class="${over ? 'over' : ''}" style="width:${pct}%"></span></div></div>`;
}
function foodResults() {
  const q = str(S.ui.foodQuery).toLowerCase();
  const list = Object.values(S.nut.foods)
    .filter((f) => !q || (f.name || '').toLowerCase().includes(q) || (f.brand || '').toLowerCase().includes(q) || (f.ean || '').includes(q))
    .sort((x, y) => (y.usedAt || 0) - (x.usedAt || 0)).slice(0, 40);
  if (!list.length) return `<p class="small muted">${Object.keys(S.nut.foods).length ? 'Kein Produkt passt zur Suche.' : 'Noch keine Produkte. Gescannte und gespeicherte Produkte erscheinen hier.'}</p>`;
  return list.map((f) => `<button class="swap-item" type="button" data-act="food-pick" data-id="${esc(f.id)}"><span>${esc(f.name)}${f.brand ? ` <span class="muted">· ${esc(f.brand)}</span>` : ''}</span><small class="num">${fmt(f.per100.kcal, 0)} kcal / 100 ${esc(f.unit || 'g')} · ${macroText(f.per100)}</small></button>`).join('');
}
function addPanel() {
  const a = S.ui.nutAdd, mealName = (MEALS.find((m) => m.id === a.meal) || {}).label || '';
  let body = '';
  if (a.step === 'menu') {
    body = `<p class="small muted">Wie willst du eintragen?</p><div class="add-grid">
      <button class="add-opt" type="button" data-act="scan">${ICON.barcode}<span>Barcode scannen</span></button>
      ${aiState !== 'off' ? `<button class="add-opt" type="button" data-act="nut-step" data-step="describe">${ICON.text}<span>Beschreiben</span></button>` : ''}
      ${aiState !== 'off' && imgOk ? `<button class="add-opt" type="button" data-act="meal-photo">${ICON.camera}<span>Foto vom Essen</span></button>` : ''}
      <button class="add-opt" type="button" data-act="nut-step" data-step="foods">${ICON.list}<span>Meine Produkte</span></button>
      <button class="add-opt" type="button" data-act="nut-step" data-step="manual">${ICON.pen}<span>Manuell</span></button>
    </div>`;
  } else if (a.step === 'busy') {
    body = `<div class="gen-status"><span class="spinner"></span><span class="small">${esc(a.msg)}</span></div>${a.ctl ? '<button class="btn" type="button" data-act="busy-cancel" style="justify-self:start">Abbrechen</button>' : ''}`;
  } else if (a.step === 'scan-fail') {
    body = `<label class="field">Barcode-Nummer<input id="ean-in" inputmode="numeric" autocomplete="off" placeholder="z. B. 4006040001234" value="${esc(a.eanInput || '')}" data-bind="nutf" data-f="eanInput"></label>
      <div class="btn-row"><button class="btn primary" type="button" data-act="ean-lookup">Weiter</button><button class="btn" type="button" data-act="scan">Neues Foto</button>
      ${imgOk && a.lastFile ? '<button class="btn" type="button" data-act="barcode-ai">Claude die Nummer lesen lassen</button>' : ''}</div>`;
  } else if (a.step === 'new-product') {
    const d = a.draft;
    body = `<div class="stack">
      <p class="eyebrow">${d.ean ? 'Neues Produkt · EAN ' + esc(d.ean) : 'Produkt bearbeiten'}</p>
      ${d.ean && !S.nut.foods[d.id] ? `<p class="small muted">${esc(a.offNote || 'Dieses Produkt kennt dein Satzbuch noch nicht.')} Trag die Werte von der Packung ein oder lass Claude das Etikett lesen. Ab dem nächsten Scan erkennt die App es sofort.</p>` : ''}
      ${imgOk && aiState !== 'off' ? `<button class="btn ${a.labelRead ? '' : 'primary'}" type="button" data-act="label-photo">${a.labelRead ? 'Etikett noch einmal von Claude lesen lassen' : 'Etikett von Claude lesen lassen'}</button>` : ''}
      ${a.labelRead ? '<p class="small ok-note">Werte übernommen. Bitte kurz mit der Packung vergleichen.</p>' : ''}
      <div class="day-fields"><label class="field">Name<input id="pd-name" value="${esc(d.name)}" placeholder="z. B. Skyr Natur" data-bind="draft" data-f="name"></label>
      <label class="field">Einheit<select id="pd-unit" data-bind="draft" data-f="unit"><option value="g" ${d.unit === 'g' ? 'selected' : ''}>g</option><option value="ml" ${d.unit === 'ml' ? 'selected' : ''}>ml</option></select></label></div>
      <div class="row2"><label class="field">Marke<input id="pd-brand" value="${esc(d.brand)}" placeholder="optional" data-bind="draft" data-f="brand"></label>
      <label class="field">Portion (${esc(d.unit)})<input id="pd-portion" inputmode="decimal" value="${esc(d.portion)}" placeholder="optional" data-bind="draft" data-f="portion"></label></div>
      <p class="small muted">Nährwerte pro 100 ${esc(d.unit)}</p>
      <div class="edit-grid">${NUTRIENTS.map(([k, l]) => `<label class="field">${l}<input id="pd-${k}" inputmode="decimal" value="${esc(d.per100[k])}" data-bind="draft100" data-f="${k}"></label>`).join('')}</div>
      <button class="btn primary" type="button" data-act="product-save">Speichern und weiter</button>
    </div>`;
  } else if (a.step === 'amount') {
    const f = a.food, unit = f.unit || 'g', v = scaleFood(f, num(a.amount) || 0);
    const quick = [...new Set([f.portion, f.lastAmount, 50, 100, 150, 200, 250].filter((x) => x > 0))].slice(0, 6);
    body = `<div class="stack">
      <div><h3>${esc(f.name)}</h3><p class="small muted num">${f.brand ? esc(f.brand) + ' · ' : ''}100 ${esc(unit)}: ${fmt(f.per100.kcal, 0)} kcal · ${macroText(f.per100)}</p>
        ${f.source === 'off' ? '<p class="off-note">Nährwerte von Open Food Facts (ODbL). Kurz mit der Packung vergleichen.</p>' : ''}</div>
      <div class="chips">${quick.map((q) => `<button class="chip" type="button" data-act="amount-quick" data-val="${q}" aria-pressed="${num(a.amount) === q}">${fmt(q)} ${esc(unit)}${q === f.portion ? ' (Portion)' : ''}</button>`).join('')}</div>
      <label class="field">Menge (${esc(unit)})<input id="nut-amount" inputmode="decimal" value="${esc(a.amount)}" data-bind="nutAmount"></label>
      <p class="amount-preview num" id="amount-preview">= ${fmt(v.kcal, 0)} kcal · ${macroText(v)}</p>
      <button class="btn primary" type="button" data-act="amount-add">Zu ${esc(mealName)} hinzufügen</button>
      <button class="link" type="button" data-act="food-edit" style="justify-self:start">Werte des Produkts bearbeiten</button>
    </div>`;
  } else if (a.step === 'foods') {
    body = `<label class="field">Suchen<input id="food-q" value="${esc(S.ui.foodQuery)}" placeholder="Name, Marke oder Barcode" data-bind="foodq"></label>
      <div class="swap" id="food-results">${foodResults()}</div>
      <button class="link" type="button" data-act="product-new" style="justify-self:start">+ Produkt ohne Barcode anlegen</button>`;
  } else if (a.step === 'describe') {
    body = `<label class="field">Was hast du gegessen?<textarea id="nut-text" placeholder="z. B. 250 g Magerquark mit einer Banane und 30 g Haferflocken" data-bind="nutf" data-f="text">${esc(a.text || '')}</textarea></label>
      <div class="btn-row"><button class="btn primary" type="button" data-act="estimate-run">Nährwerte schätzen</button>${imgOk ? '<button class="btn" type="button" data-act="meal-photo">Mit Foto</button>' : ''}</div>`;
  } else if (a.step === 'estimate') {
    const t = sumEntries(a.items);
    body = `<p class="small muted">Geschätzt von Claude. Prüf die Mengen, bevor du speicherst.</p>
      <ul class="food-list">${a.items.map((it, i) => `<li><div class="food-main"><span class="food-name">${esc(it.name)}</span><span class="small muted num">${fmt(it.grams, 0)} g · ${macroText(it)}</span></div><span class="food-kcal num">${fmt(it.kcal, 0)}</span><button class="icon-btn sm" type="button" aria-label="${esc(it.name)} entfernen" data-act="est-del" data-i="${i}">${ICON.x}</button></li>`).join('')}</ul>
      <p class="small num"><strong>Gesamt ${fmt(t.kcal, 0)} kcal</strong> · ${macroText(t)}</p>
      <button class="btn primary" type="button" data-act="est-add" ${a.items.length ? '' : 'disabled'}>Zu ${esc(mealName)} hinzufügen</button>`;
  } else if (a.step === 'manual') {
    const m = a.manual;
    body = `<div class="stack">
      <div class="day-fields"><label class="field">Lebensmittel<input id="mn-name" value="${esc(m.name)}" placeholder="z. B. Proteinriegel" data-bind="manual" data-f="name"></label>
      <label class="field">Menge (g)<input id="mn-amount" inputmode="decimal" value="${esc(m.amount)}" data-bind="manual" data-f="amount"></label></div>
      <div class="edit-grid">${[['kcal', 'kcal'], ['protein', 'Eiweiß (g)'], ['carbs', 'Kohlenh. (g)'], ['fat', 'Fett (g)']].map(([k, l]) => `<label class="field">${l}<input id="mn-${k}" inputmode="decimal" value="${esc(m[k])}" data-bind="manual" data-f="${k}"></label>`).join('')}</div>
      <p class="small muted">Werte für die ganze Menge, nicht pro 100 g.</p>
      <button class="btn primary" type="button" data-act="manual-add">Zu ${esc(mealName)} hinzufügen</button>
    </div>`;
  }
  return `<div class="add-panel">
    ${a.error ? `<p class="err">${esc(a.error)}</p>` : ''}
    ${body}
    <div class="add-foot">${a.step !== 'menu' && a.step !== 'busy' ? '<button class="link" type="button" data-act="nut-step" data-step="menu">← Andere Methode</button>' : '<span></span>'}<button class="link" type="button" data-act="nut-close">Schließen</button></div>
  </div>`;
}
function mealSection(m, day) {
  const items = day.entries.filter((e) => e.meal === m.id), t = sumEntries(items);
  const open = S.ui.nutAdd && S.ui.nutAdd.meal === m.id;
  return `<section class="meal">
    <div class="meal-head"><div><h3>${m.label}</h3><span class="small muted num">${items.length ? `${fmt(t.kcal, 0)} kcal · ${macroText(t)}` : 'Noch nichts eingetragen'}</span></div>
    ${open ? '' : `<button class="btn" type="button" data-act="nut-add" data-meal="${m.id}">+ Hinzufügen</button>`}</div>
    ${items.length ? `<ul class="food-list">${items.map((e) => `<li><div class="food-main"><span class="food-name">${esc(e.name)}</span><span class="small muted num">${e.amount ? fmt(e.amount, 0) + ' ' + esc(e.unit || 'g') + ' · ' : ''}${macroText(e)}</span></div><span class="food-kcal num">${fmt(e.kcal, 0)}</span><button class="icon-btn sm" type="button" aria-label="${esc(e.name)} entfernen" data-act="entry-del" data-id="${e.id}">${ICON.x}</button></li>`).join('')}</ul>` : ''}
    ${open ? addPanel() : ''}
  </section>`;
}
function initGoalDraft() {
  const g = goals(), b = (S.nut.goals && S.nut.goals.body) || {};
  const pg = S.profile && S.profile.goal;
  return {
    kcal: String(g.kcal), protein: String(g.protein), carbs: String(g.carbs), fat: String(g.fat), water: String(g.water),
    weight: b.weight ? String(b.weight) : '', height: b.height ? String(b.height) : '', age: b.age ? String(b.age) : '',
    sex: b.sex || 'm', activity: b.activity || '1.55', target: b.target || (pg === 'fett' ? 'abnehmen' : pg === 'muskel' || pg === 'kraft' ? 'aufbauen' : 'halten'),
    open: !S.nut.goals, error: null
  };
}
function viewGoals() {
  const d = S.ui.goalDraft;
  const sel = (f, opts) => `<select id="gd-${f}" data-bind="goal" data-f="${f}">${opts.map(([v, l]) => `<option value="${v}" ${d[f] === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  return `<section class="panel">
    <h3>Deine Tagesziele</h3>
    ${d.error ? `<p class="err">${esc(d.error)}</p>` : ''}
    <div class="edit-grid">${[['kcal', 'kcal'], ['protein', 'Eiweiß (g)'], ['carbs', 'Kohlenh. (g)'], ['fat', 'Fett (g)']].map(([k, l]) => `<label class="field">${l}<input id="gd-${k}" inputmode="numeric" value="${esc(d[k])}" data-bind="goal" data-f="${k}"></label>`).join('')}</div>
    <label class="field" style="max-width:12rem">Wasser (ml)<input id="gd-water" inputmode="numeric" value="${esc(d.water)}" data-bind="goal" data-f="water"></label>
    <details class="calc" ${d.open ? 'open' : ''}><summary>Aus Körperdaten berechnen</summary>
      <div class="stack" style="padding-top:10px">
        <div class="edit-grid">
          <label class="field">Gewicht (kg)<input id="gd-weight" inputmode="decimal" value="${esc(d.weight)}" data-bind="goal" data-f="weight"></label>
          <label class="field">Größe (cm)<input id="gd-height" inputmode="numeric" value="${esc(d.height)}" data-bind="goal" data-f="height"></label>
          <label class="field">Alter<input id="gd-age" inputmode="numeric" value="${esc(d.age)}" data-bind="goal" data-f="age"></label>
          <label class="field">Geschlecht${sel('sex', [['m', 'männlich'], ['w', 'weiblich']])}</label>
        </div>
        <div class="row2">
          <label class="field">Alltag & Training${sel('activity', [['1.375', 'wenig aktiv, 2–3× Training'], ['1.55', 'aktiv, 4–5× Training'], ['1.725', 'sehr aktiv, 6× Training'], ['1.9', 'körperlicher Job + Training']])}</label>
          <label class="field">Ziel${sel('target', [['abnehmen', 'Fett verlieren'], ['halten', 'Gewicht halten'], ['aufbauen', 'Muskeln aufbauen']])}</label>
        </div>
        <button class="btn" type="button" data-act="goal-calc" style="justify-self:start">Ziele berechnen</button>
        <p class="small muted">Richtwerte nach der Mifflin-St-Jeor-Formel. Bei Erkrankungen lieber ärztlich oder ernährungsfachlich abklären.</p>
      </div>
    </details>
    <div class="btn-row"><button class="btn primary" type="button" data-act="goal-save">Ziele speichern</button><button class="btn" type="button" data-act="goal-cancel">Abbrechen</button></div>
  </section>`;
}
function weekKcal() {
  const g = goals(), today = dayKey(Date.now());
  const keys = Array.from({ length: 7 }, (_, i) => shiftKey(today, i - 6));
  const vals = keys.map((k) => sumEntries(dayData(k).entries));
  const logged = vals.filter((v) => v.kcal > 0);
  if (!logged.length) return '';
  const avgK = logged.reduce((s, v) => s + v.kcal, 0) / logged.length, avgP = logged.reduce((s, v) => s + v.protein, 0) / logged.length;
  const W = 600, H = 180, pl = 8, pr = 44, pt = 20, pb = 26;
  const max = Math.max(g.kcal * 1.2, ...vals.map((v) => v.kcal));
  const bw = (W - pl - pr) / 7, sy = (y) => pt + (1 - y / max) * (H - pt - pb);
  return `<section class="panel"><div class="section-head"><h3>Letzte 7 Tage</h3><span class="small muted num">Ø ${fmt(avgK, 0)} kcal · Ø ${fmt(avgP, 0)} g Eiweiß</span></div>
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Kalorien der letzten 7 Tage">
      ${vals.map((v, i) => { const x = pl + i * bw + bw * 0.2, w = bw * 0.6, y = v.kcal ? sy(v.kcal) : H - pb - 3; return `<rect class="bar ${v.kcal ? (v.kcal > g.kcal * 1.05 ? 'warn' : '') : 'empty'}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(H - pb - y).toFixed(1)}" rx="3"/>
        <text class="axis-t" x="${(x + w / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(weekday(keyToDate(keys[i]).getTime()))}</text>`; }).join('')}
      <line class="goal-line" x1="${pl}" x2="${W - pr}" y1="${sy(g.kcal).toFixed(1)}" y2="${sy(g.kcal).toFixed(1)}"/>
      <text class="axis-t" x="${W - pr + 6}" y="${(sy(g.kcal) + 4).toFixed(1)}">Ziel</text>
    </svg>
    <p class="small muted">An ${logged.length} von 7 Tagen erfasst.</p></section>`;
}
function viewNutrition() {
  const k = S.ui.nutDate, day = dayData(k), g = goals(), tot = sumEntries(day.entries), today = dayKey(Date.now());
  const left = g.kcal - tot.kcal;
  const cups = Math.max(1, Math.ceil(g.water / 250)), full = Math.floor(day.water / 250);
  return `
  <section class="date-nav">
    <button class="icon-btn" type="button" data-act="nut-day" data-dir="-1" aria-label="Vorheriger Tag"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
    <h2>${esc(dateLabel(k))}</h2>
    <button class="icon-btn" type="button" data-act="nut-day" data-dir="1" aria-label="Nächster Tag" ${k >= today ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
  </section>
  <section class="panel">
    <div class="kcal-row"><div><b class="kcal-big num">${fmt(Math.abs(left), 0)}</b> <span class="muted">kcal ${left >= 0 ? 'übrig' : 'drüber'}</span></div><span class="small muted num">${fmt(tot.kcal, 0)} / ${fmt(g.kcal, 0)} kcal</span></div>
    <div class="bar-track thick"><span class="${left < 0 ? 'over' : ''}" style="width:${Math.min(100, (tot.kcal / g.kcal) * 100)}%"></span></div>
    <div class="macros">${macroBar('Eiweiß', tot.protein, g.protein)}${macroBar('Kohlenhydrate', tot.carbs, g.carbs)}${macroBar('Fett', tot.fat, g.fat)}</div>
    ${S.ui.goalEdit ? '' : g.isDefault ? '<p class="small muted">Das sind Standardziele. <button class="link" type="button" data-act="goal-edit">Eigene Ziele berechnen</button></p>' : '<button class="link" type="button" data-act="goal-edit" style="justify-self:start">Ziele anpassen</button>'}
  </section>
  ${S.ui.goalEdit ? viewGoals() : ''}
  <section class="panel">
    <div class="section-head"><h3>Wasser</h3><span class="small muted num">${fmt(day.water / 1000, 2)} / ${fmt(g.water / 1000, 1)} l</span></div>
    <div class="cups" aria-hidden="true">${Array.from({ length: Math.max(cups, full) }, (_, i) => `<span class="${i < full ? 'on' : ''}"></span>`).join('')}</div>
    <div class="btn-row"><button class="btn" type="button" data-act="water" data-ml="250">+ 250 ml</button><button class="btn" type="button" data-act="water" data-ml="500">+ 500 ml</button>${day.water > 0 ? '<button class="btn ghost" type="button" data-act="water" data-ml="-250">− 250 ml</button>' : ''}</div>
  </section>
  ${MEALS.map((m) => mealSection(m, day)).join('')}
  ${weekKcal()}`;
}

/* ---------- render ---------- */
const VIEWS = { training: viewTraining, plan: viewPlan, ernaehrung: viewNutrition, verlauf: viewHistory, fortschritt: viewProgress, erstellen: viewCreate };
function render() {
  const fn = VIEWS[S.view] || viewTraining;
  app.innerHTML = fn();
  const navView = S.view === 'erstellen' ? 'plan' : S.view;
  document.querySelectorAll('[data-nav]').forEach((b) => { if (b.dataset.nav === navView) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  renderRest();
  renderSheet();
  if (S.gen && S.gen.status === 'running') updateGenStatus();
}
function go(view) {
  if (S.view !== view) {
    stopLiveScan();
    if (S.ui.nutAdd && S.ui.nutAdd.ctl) S.ui.nutAdd.ctl.abort();
    S.view = view; S.ui.confirm = null; S.ui.swap = null; S.ui.nutAdd = null; S.ui.goalEdit = false; S.ui.info = null; window.scrollTo(0, 0);
  }
  try { if (location.hash !== '#' + view) location.hash = view; } catch (e) { /* hash not available */ }
  render();
}
function renderRest() {
  const bar = $('#restbar');
  if (!restT || !S.active) { bar.hidden = true; return; }
  const left = (restT.end - Date.now()) / 1000;
  bar.hidden = false;
  $('#rest-time').textContent = fmtTime(Math.ceil(left));
  $('#rest-label').textContent = 'Pause · danach ' + restT.label;
  $('#rest-fill').style.transform = `scaleX(${Math.max(0, Math.min(1, left / restT.total))})`;
}
function tick() {
  if (S.active) {
    const el = document.getElementById('elapsed');
    if (el) el.textContent = fmtTime((Date.now() - S.active.startedAt) / 1000);
  }
  if (restT) {
    if (Date.now() >= restT.end) { restT = null; beep(); }
    renderRest();
  }
  if (S.gen && S.gen.status === 'running' && !S.gen.chars) updateGenStatus();
}

/* ---------- events ---------- */
function findEx(id) { return S.active && S.active.exercises.find((e) => e.id === id); }
function findPlanEx(dayId, exId) { const d = S.plan && S.plan.days.find((x) => x.id === dayId); return d ? { d, ex: d.exercises.find((e) => e.id === exId) } : {}; }

document.addEventListener('click', (ev) => {
  const nav = ev.target.closest('[data-nav]');
  if (nav) { go(nav.dataset.nav); return; }
  const b = ev.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const a = b.dataset.act, ds = b.dataset;
  switch (a) {
    case 'go': go(ds.to); break;
    case 'go-create': S.ui.tab = ds.tab || 'new'; if (S.gen && S.gen.status !== 'running') S.gen = null; go('erstellen'); break;
    case 'gen-tab': S.ui.tab = ds.tab; if (S.gen && S.gen.status === 'error') S.gen = null; render(); break;
    case 'chip': {
      const gname = ds.group;
      if (ds.multi) { const arr = S.form[gname]; const i = arr.indexOf(ds.val); if (i >= 0) arr.splice(i, 1); else arr.push(ds.val); }
      else S.form[gname] = ds.val;
      render(); break;
    }
    case 'set-ab': S.form.ab = ds.val === '1'; render(); break;
    case 'gen-run': runGen('new'); break;
    case 'import-run': runGen('import'); break;
    case 'gen-stop': if (S.gen && S.gen.ctl) S.gen.ctl.abort(); S.gen = null; render(); break;
    case 'gen-discard': S.gen = null; render(); break;
    case 'gen-accept': {
      if (!S.gen || !S.gen.result) break;
      S.plan = S.gen.result; S.plan.createdAt = Date.now();
      if (S.gen.kind !== 'import') { S.profile = clone(Object.assign({}, S.form, { importText: undefined, updatedAt: Date.now() })); saveProfile(); }
      S.gen = null; S.ui.edit = false; savePlan(); go('training'); break;
    }
    case 'example-load': S.plan = normalizePlan(clone(EXAMPLE_PLAN), 'example'); savePlan(); go('training'); break;
    case 'manual-plan':
      S.plan = { id: uid(), source: 'manual', createdAt: Date.now(), name: 'Mein Trainingsplan', summary: '', progression: '', weeks: 6,
        days: [{ id: uid(), name: 'Tag A', focus: '', exercises: [normEx({ name: 'Übung 1' })] }] };
      S.ui.edit = true; savePlan(); go('plan'); break;
    case 'start-day': startWorkout(ds.day); break;
    case 'set-done': {
      ensureAudio();
      const e = findEx(ds.ex); if (!e) break;
      const s = e.sets[+ds.i];
      if (!s.done) {
        const r = parseRange(e.target.reps);
        if (s.w === '' && e.sug && e.sug.weight) s.w = fmt(e.sug.weight);
        if (s.r === '') { const ph = e.sug && e.sug.reps ? e.sug.reps : r ? r.lo : ''; s.r = ph === '' ? '' : String(ph); }
        if (s.r === '' || num(s.r) == null) { const inp = document.getElementById(`r-${e.id}-${ds.i}`); if (inp) inp.focus(); break; }
        s.done = true;
        const idx = +ds.i;
        // carry weight forward into the next empty set
        const nx = e.sets[idx + 1];
        if (nx && !nx.done && nx.w === '' && s.w !== '') nx.w = s.w;
        const remaining = e.sets.some((x) => !x.done);
        const exIdx = S.active.exercises.indexOf(e);
        let nextEx = remaining ? e : S.active.exercises.slice(exIdx + 1).find((x) => x.sets.some((y) => !y.done));
        const partner = e.ss ? S.active.exercises[exIdx + 1] : null;
        const prevSs = exIdx > 0 && S.active.exercises[exIdx - 1].ss ? S.active.exercises[exIdx - 1] : null;
        if (prevSs && prevSs.sets.some((x) => !x.done)) nextEx = prevSs;
        if (partner && partner.sets.some((x) => !x.done)) { restT = null; }
        else if (nextEx) { restT = { end: Date.now() + e.target.rest * 1000, total: e.target.rest, label: nextEx === e ? `${e.name}, Satz ${e.sets.findIndex((x) => !x.done) + 1}` : nextEx.name }; }
        else restT = null;
      } else s.done = false;
      saveActiveNow(); render(); break;
    }
    case 'add-set': { const e = findEx(ds.ex); if (!e) break; const last = e.sets[e.sets.length - 1]; e.sets.push({ w: last ? last.w : '', r: '', rpe: '', done: false }); saveActiveNow(); render(); break; }
    case 'remove-set': { const e = findEx(ds.ex); if (!e || e.sets.length < 2) break; let i = e.sets.length - 1; for (let j = e.sets.length - 1; j >= 0; j--) if (!e.sets[j].done) { i = j; break; } e.sets.splice(i, 1); saveActiveNow(); render(); break; }
    case 'add-ex-session': {
      const name = str(S.ui.newEx); if (!name) { const inp = document.getElementById('new-ex'); if (inp) inp.focus(); break; }
      S.active.exercises.push(buildActiveEx({ name, sets: 3, reps: '8-12', rpe: 8, rest: 90, notes: '' }));
      S.ui.newEx = ''; saveActiveNow(); render(); break;
    }
    case 'finish-ask': S.ui.confirm = { kind: 'finish' }; render(); break;
    case 'discard-ask': S.ui.confirm = { kind: 'discard' }; render(); break;
    case 'finish-confirm': finishWorkout(); break;
    case 'discard-confirm': S.active = null; restT = null; S.ui.confirm = null; saveActiveNow(); releaseWake(); window.scrollTo(0, 0); render(); break;
    case 'confirm-cancel': S.ui.confirm = null; render(); break;
    case 'rest-plus': if (restT) { restT.end += 15000; restT.total += 15; renderRest(); } break;
    case 'rest-skip': restT = null; renderRest(); break;
    case 'edit-toggle': S.ui.edit = !S.ui.edit; S.ui.swap = null; S.ui.confirm = null; if (!S.ui.edit) { clearTimeout(planTimer); sortDays(S.plan); savePlan(); } render(); break;
    case 'ex-add': { const d = S.plan.days.find((x) => x.id === ds.day); if (!d) break; d.exercises.push(normEx({ name: 'Neue Übung' })); savePlan(); render(); const inp = document.getElementById('en-' + d.exercises[d.exercises.length - 1].id); if (inp) { inp.focus(); inp.select(); } break; }
    case 'ex-del': { const { d } = findPlanEx(ds.day, ds.ex); if (!d) break; d.exercises = d.exercises.filter((e) => e.id !== ds.ex); savePlan(); render(); break; }
    case 'ex-move': { const { d } = findPlanEx(ds.day, ds.ex); if (!d) break; const i = d.exercises.findIndex((e) => e.id === ds.ex), j = i + Number(ds.dir); if (j < 0 || j >= d.exercises.length) break; const [m] = d.exercises.splice(i, 1); d.exercises.splice(j, 0, m); savePlan(); render(); break; }
    case 'day-add': { const lastDay = S.plan.days[S.plan.days.length - 1]; S.plan.days.push({ id: uid(), name: 'Neuer Tag', week: lastDay ? lastDay.week || '' : '', focus: '', exercises: [normEx({ name: 'Neue Übung' })] }); savePlan(); render(); break; }
    case 'day-del': S.plan.days = S.plan.days.filter((d) => d.id !== ds.day); savePlan(); render(); break;
    case 'plan-del-ask': S.ui.confirm = { kind: 'plan-del' }; render(); break;
    case 'plan-del-confirm': S.plan = null; S.ui.edit = false; S.ui.confirm = null; savePlan(); render(); break;
    case 'swap': runSwap(ds.day, ds.ex); break;
    case 'swap-close': S.ui.swap = null; render(); break;
    case 'swap-pick': { const sw = S.ui.swap; if (!sw) break; const { ex } = findPlanEx(sw.dayId, sw.exId); if (ex) { ex.name = ds.name; savePlan(); } S.ui.swap = null; render(); break; }
    /* exercise guide */
    case 'ex-info': openInfo(ds.name, ds.note, false); break;
    case 'info-refresh': if (S.ui.info) openInfo(S.ui.info.name, S.ui.info.note, true); break;
    case 'info-close': { const nm = S.ui.info && S.ui.info.name; S.ui.info = null; render(); const back = nm && [...document.querySelectorAll('[data-act="ex-info"]')].find((x) => x.dataset.name === nm); if (back) back.focus(); break; }
    /* nutrition */
    case 'nut-day': { const nk = shiftKey(S.ui.nutDate, Number(ds.dir)); if (nk <= dayKey(Date.now())) { S.ui.nutDate = nk; S.ui.nutAdd = null; render(); } break; }
    case 'nut-add': if (S.ui.nutAdd && S.ui.nutAdd.ctl) S.ui.nutAdd.ctl.abort(); S.ui.nutAdd = { meal: ds.meal, step: 'menu' }; render(); break;
    case 'nut-close': stopLiveScan(); if (S.ui.nutAdd && S.ui.nutAdd.ctl) S.ui.nutAdd.ctl.abort(); S.ui.nutAdd = null; render(); break;
    case 'nut-step': {
      const na = S.ui.nutAdd; if (!na) break;
      na.step = ds.step; na.error = null;
      if (ds.step === 'manual') na.manual = na.manual || { name: '', amount: '100', kcal: '', protein: '', carbs: '', fat: '' };
      render();
      const focusId = { describe: 'nut-text', foods: 'food-q', manual: 'mn-name' }[ds.step];
      if (focusId) { const el = document.getElementById(focusId); if (el) el.focus(); }
      break;
    }
    case 'busy-cancel': { const na = S.ui.nutAdd; if (!na) break; if (na.ctl) na.ctl.abort(); backFromBusy(na, null); break; }
    case 'scan': startLiveScan(); break;
    case 'scan-cancel': stopLiveScan(); if (S.ui.nutAdd) { S.ui.nutAdd.step = 'menu'; render(); } break;
    case 'scan-manual': { stopLiveScan(); const na = S.ui.nutAdd; if (!na) break; na.step = 'scan-fail'; na.error = null; render(); const el = document.getElementById('ean-in'); if (el) el.focus(); break; }
    case 'scan-photo': { stopLiveScan(); const inp = $('#file-barcode'); inp.value = ''; inp.click(); break; }
    case 'label-photo': readLabel(true); break;
    case 'meal-photo': estimateMeal(true); break;
    /* Claude chat bridge */
    case 'bridge-copy': {
      const j = bridgeJob; if (!j) break;
      const done = () => { if (bridgeJob === j) { j.copied = true; renderBridge(); } };
      const fallback = () => { const det = document.querySelector('#bridge details'); if (det) det.open = true; const ta = document.getElementById('bridge-prompt'); if (ta) { ta.focus(); ta.select(); } };
      try { navigator.clipboard.writeText(j.prompt).then(done, fallback); } catch (e) { fallback(); }
      break;
    }
    case 'bridge-paste': {
      const j = bridgeJob; if (!j) break;
      const fail = () => { if (bridgeJob === j) { j.error = 'Einfügen ging nicht automatisch. Tipp lange ins Feld und wähle „Einfügen“.'; renderBridge(); } };
      try { navigator.clipboard.readText().then((t) => { if (bridgeJob === j) { j.answer = t; j.error = null; renderBridge(); } }, fail); } catch (e) { fail(); }
      break;
    }
    case 'bridge-apply': {
      const j = bridgeJob; if (!j) break;
      const v = parseLoose(j.answer);
      if (v == null || typeof v !== 'object') { j.error = 'In der Antwort sind keine lesbaren Daten. Kopiere Claudes ganze Antwort und füge sie noch einmal ein.'; renderBridge(); break; }
      bridgeJob = null; renderBridge(); j.resolve(v); break;
    }
    case 'bridge-cancel': closeBridge(); break;
    /* data & backup */
    case 'data-open': S.ui.data = { msg: null, err: false, pending: null }; renderData(); break;
    case 'data-close': S.ui.data = null; renderData(); break;
    case 'backup-export': exportBackup(); break;
    case 'backup-pick': { const inp = $('#file-backup'); inp.value = ''; inp.click(); break; }
    case 'backup-discard': if (S.ui.data) { S.ui.data.pending = null; renderData(); } break;
    case 'backup-apply': {
      const d = S.ui.data; if (!d || !d.pending) break;
      applyData(d.pending.data); lsWrite();
      d.pending = null; d.msg = 'Backup geladen.'; d.err = false;
      render(); renderData(); break;
    }
    case 'ean-lookup': handleEan(S.ui.nutAdd && S.ui.nutAdd.eanInput); break;
    case 'barcode-ai': readBarcodeAI(); break;
    case 'product-new': { const na = S.ui.nutAdd; if (!na) break; na.draft = emptyDraft(''); na.draft.id = 'f' + uid(); na.labelRead = false; na.step = 'new-product'; render(); break; }
    case 'food-edit': { const na = S.ui.nutAdd; if (!na || !na.food) break; na.draft = draftFrom(na.food); na.labelRead = false; na.step = 'new-product'; render(); break; }
    case 'food-pick': { const f = S.nut.foods[ds.id]; if (f) openAmount(f); break; }
    case 'product-save': {
      const na = S.ui.nutAdd; if (!na || !na.draft) break;
      const d = na.draft, kcal = num(d.per100.kcal);
      if (kcal == null) { na.error = 'Trag mindestens die Kalorien pro 100 ' + d.unit + ' ein.'; render(); break; }
      const id = d.id || d.ean || 'f' + uid(), old = S.nut.foods[id] || {};
      const per100 = {}; NUTRIENTS.forEach(([nk]) => { per100[nk] = num(d.per100[nk]); }); per100.kcal = kcal;
      ['protein', 'carbs', 'fat'].forEach((nk) => { if (per100[nk] == null) per100[nk] = 0; });
      const food = { id, ean: d.ean || '', name: str(d.name) || (d.ean ? 'Produkt ' + d.ean : 'Lebensmittel'), brand: str(d.brand), unit: d.unit === 'ml' ? 'ml' : 'g', portion: num(d.portion), per100, lastAmount: old.lastAmount || null, usedAt: Date.now(), uses: old.uses || 0 };
      S.nut.foods[id] = food; saveFood(food); na.labelRead = false; openAmount(food); break;
    }
    case 'amount-quick': { const na = S.ui.nutAdd; if (!na) break; na.amount = fmt(Number(ds.val)); render(); break; }
    case 'amount-add': {
      const na = S.ui.nutAdd; if (!na || !na.food) break;
      const amt = num(na.amount); if (!amt || amt <= 0) { na.error = 'Gib eine Menge größer als 0 ein.'; render(); break; }
      const f = na.food, v = scaleFood(f, amt), day = ensureDay(S.ui.nutDate);
      day.entries.push(Object.assign({ id: uid(), meal: na.meal, name: f.name, amount: amt, unit: f.unit || 'g', foodId: f.id, ts: Date.now() }, v));
      f.lastAmount = amt; f.usedAt = Date.now(); f.uses = (f.uses || 0) + 1;
      saveFood(f); saveDay(S.ui.nutDate); S.ui.nutAdd = null; render(); break;
    }
    case 'estimate-run': estimateMeal(null); break;
    case 'est-del': { const na = S.ui.nutAdd; if (!na || !na.items) break; na.items.splice(Number(ds.i), 1); render(); break; }
    case 'est-add': {
      const na = S.ui.nutAdd; if (!na || !na.items || !na.items.length) break;
      const day = ensureDay(S.ui.nutDate);
      na.items.forEach((it) => day.entries.push({ id: uid(), meal: na.meal, name: it.name, amount: it.grams || null, unit: 'g', kcal: it.kcal, protein: it.protein, carbs: it.carbs, fat: it.fat, estimated: true, ts: Date.now() }));
      saveDay(S.ui.nutDate); S.ui.nutAdd = null; render(); break;
    }
    case 'manual-add': {
      const na = S.ui.nutAdd; if (!na || !na.manual) break;
      const m = na.manual;
      if (!str(m.name) || num(m.kcal) == null) { na.error = 'Name und Kalorien sind nötig.'; render(); break; }
      const day = ensureDay(S.ui.nutDate);
      day.entries.push({ id: uid(), meal: na.meal, name: str(m.name), amount: num(m.amount), unit: 'g', kcal: Math.round(num(m.kcal)), protein: r1(num(m.protein) || 0), carbs: r1(num(m.carbs) || 0), fat: r1(num(m.fat) || 0), ts: Date.now() });
      saveDay(S.ui.nutDate); S.ui.nutAdd = null; render(); break;
    }
    case 'entry-del': { const day = S.nut.days[S.ui.nutDate]; if (!day) break; day.entries = day.entries.filter((e) => e.id !== ds.id); saveDay(S.ui.nutDate); render(); break; }
    case 'water': { const day = ensureDay(S.ui.nutDate); day.water = Math.max(0, (day.water || 0) + Number(ds.ml)); saveDaySoon(S.ui.nutDate); render(); break; }
    case 'goal-edit': S.ui.goalDraft = initGoalDraft(); S.ui.goalEdit = true; render(); break;
    case 'goal-cancel': S.ui.goalEdit = false; render(); break;
    case 'goal-calc': {
      const d = S.ui.goalDraft; if (!d) break;
      const w = num(d.weight), h = num(d.height), age = num(d.age);
      d.open = true;
      if (!w || !h || !age) { d.error = 'Für die Berechnung brauche ich Gewicht, Größe und Alter.'; render(); break; }
      const bmr = 10 * w + 6.25 * h - 5 * age + (d.sex === 'w' ? -161 : 5);
      const kcal = Math.round((bmr * Number(d.activity) + (d.target === 'abnehmen' ? -450 : d.target === 'aufbauen' ? 250 : 0)) / 10) * 10;
      const protein = Math.round(w * (d.target === 'abnehmen' ? 2.2 : d.target === 'aufbauen' ? 2.0 : 1.8));
      const fat = Math.round(w * 0.9);
      d.kcal = String(kcal); d.protein = String(protein); d.fat = String(fat);
      d.carbs = String(Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4)));
      d.water = String(Math.max(2000, Math.round((w * 35) / 250) * 250));
      d.error = null; render(); break;
    }
    case 'goal-save': {
      const d = S.ui.goalDraft; if (!d) break;
      const vals = { kcal: num(d.kcal), protein: num(d.protein), carbs: num(d.carbs), fat: num(d.fat), water: num(d.water) };
      if (!vals.kcal || vals.kcal < 800) { d.error = 'Trag ein Kalorienziel von mindestens 800 kcal ein.'; render(); break; }
      ['protein', 'carbs', 'fat'].forEach((nk) => { vals[nk] = Math.max(0, Math.round(vals[nk] || 0)); });
      vals.water = Math.max(500, Math.round(vals.water || 3000));
      vals.kcal = Math.round(vals.kcal);
      vals.body = { weight: num(d.weight), height: num(d.height), age: num(d.age), sex: d.sex, activity: d.activity, target: d.target };
      S.nut.goals = vals; saveGoals(); S.ui.goalEdit = false; render(); break;
    }
    case 'hist-toggle': S.ui.openHist = S.ui.openHist === ds.id ? null : ds.id; S.ui.confirm = null; render(); break;
    case 'hist-del-ask': S.ui.confirm = { kind: 'hist-del', id: ds.id }; render(); break;
    case 'hist-del-confirm': S.workouts = S.workouts.filter((w) => w.id !== ds.id); deleteWorkout(ds.id); S.ui.confirm = null; render(); break;
  }
});

function onBind(ev) {
  const el = ev.target; const kind = el.dataset && el.dataset.bind; if (!kind) return;
  const ds = el.dataset, v = el.type === 'checkbox' ? el.checked : el.value;
  if (kind === 'set') { const e = findEx(ds.ex); if (!e) return; e.sets[+ds.i][ds.f] = v; saveActiveSoon(); }
  else if (kind === 'form') S.form[ds.f] = v;
  else if (kind === 'nutf') { if (S.ui.nutAdd) S.ui.nutAdd[ds.f] = v; }
  else if (kind === 'bridge') { if (bridgeJob) { bridgeJob.answer = v; } }
  else if (kind === 'draft') { const na = S.ui.nutAdd; if (na && na.draft) { na.draft[ds.f] = v; if (ds.f === 'unit' && ev.type === 'change') render(); } }
  else if (kind === 'draft100') { const na = S.ui.nutAdd; if (na && na.draft) na.draft.per100[ds.f] = v; }
  else if (kind === 'manual') { const na = S.ui.nutAdd; if (na && na.manual) na.manual[ds.f] = v; }
  else if (kind === 'goal') { if (S.ui.goalDraft) S.ui.goalDraft[ds.f] = v; }
  else if (kind === 'foodq') { S.ui.foodQuery = v; const box = document.getElementById('food-results'); if (box) box.innerHTML = foodResults(); }
  else if (kind === 'nutAmount') {
    const na = S.ui.nutAdd; if (!na || !na.food) return;
    na.amount = v;
    const pv = document.getElementById('amount-preview'); const sv = scaleFood(na.food, num(v) || 0);
    if (pv) pv.textContent = `= ${fmt(sv.kcal, 0)} kcal · ${macroText(sv)}`;
  }
  else if (kind === 'ui') S.ui[ds.f] = v;
  else if (kind === 'prog') { if (ev.type === 'change') { S.ui.progEx = v; render(); } }
  else if (kind === 'plan') {
    if (ds.f === 'weeks') { const n = parseInt(v, 10); if (n >= 1 && n <= 52) { S.plan.weeks = n; if (ev.type === 'change') render(); } }
    else if (ds.f === 'startDate') { if (/^\d{4}-\d{2}-\d{2}$/.test(v)) S.plan.startDate = keyToDate(v).getTime(); }
    else if (ds.f === 'scale') { S.plan.scale = v === 'rir' ? 'rir' : 'rpe'; if (ev.type === 'change') render(); }
    else if (ds.f === 'repeat') S.plan.repeat = !!v;
    else S.plan[ds.f] = v;
    savePlanSoon();
  } else if (kind === 'rir') {
    if (!Array.isArray(S.plan.rir)) S.plan.rir = [];
    const i = Number(ds.i), s = String(v).trim().replace(',', '.');
    while (S.plan.rir.length <= i) S.plan.rir.push(null);
    S.plan.rir[i] = !parseRir(s) ? null : /^\d+(\.\d+)?$/.test(s) ? Number(s) : s.toUpperCase() === 'D' ? 'D' : s;
    savePlanSoon();
  } else if (kind === 'day') { const d = S.plan.days.find((x) => x.id === ds.day); if (d) { d[ds.f] = ds.f === 'week' ? String(v).trim().toUpperCase().slice(0, 3) : v; savePlanSoon(); } }
  else if (kind === 'ex') {
    const { ex } = findPlanEx(ds.day, ds.ex); if (!ex) return;
    if (ds.f === 'sets') { const n = parseInt(v, 10); if (n >= 1 && n <= 12) ex.sets = n; }
    else if (ds.f === 'rest') { const n = parseInt(v, 10); if (n >= 0 && n <= 900) ex.rest = n; }
    else if (ds.f === 'rpe') { const n = num(v); const r = n == null ? null : isRir() ? 10 - n : n; if (r != null && r >= 1 && r <= 10) ex.rpe = r; }
    else ex[ds.f] = v;
    savePlanSoon();
  }
}
document.addEventListener('input', onBind);
document.addEventListener('change', (ev) => { if (ev.target.tagName === 'SELECT') onBind(ev); });
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    if (bridgeJob) { ev.preventDefault(); closeBridge(); return; }
    if (S.ui.data) { ev.preventDefault(); S.ui.data = null; renderData(); return; }
    if (scanReader) { ev.preventDefault(); stopLiveScan(); return; }
    if (S.ui.info) { ev.preventDefault(); const b = document.getElementById('sheet-close'); if (b) b.click(); return; }
  }
  if (ev.key === 'Enter' && ev.target.id === 'new-ex') { ev.preventDefault(); const b = document.querySelector('[data-act="add-ex-session"]'); if (b) b.click(); }
  if (ev.key === 'Enter' && ev.target.id === 'ean-in') { ev.preventDefault(); handleEan(ev.target.value); }
  if (ev.key === 'Enter' && ev.target.id === 'nut-amount') { ev.preventDefault(); const b = document.querySelector('[data-act="amount-add"]'); if (b) b.click(); }
});
const pickFile = (id, fn) => $(id).addEventListener('change', (e) => { const f = e.target.files && e.target.files[0]; if (f && S.ui.nutAdd) fn(f); });
pickFile('#file-barcode', onBarcodeFile);
pickFile('#file-label', readLabel);
pickFile('#file-meal', estimateMeal);
$('#file-backup').addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0]; if (!f || !S.ui.data) return;
  const d = S.ui.data;
  f.text().then((t) => {
    const obj = parseLoose(t);
    if (!obj || obj.app !== 'satzbuch' || !obj.data) { d.msg = 'Das ist keine Satzbuch-Backup-Datei.'; d.err = true; d.pending = null; renderData(); return; }
    const x = obj.data;
    const foods = x.nut && x.nut.foods ? Object.keys(x.nut.foods).length : 0;
    d.pending = { data: x, summary: `${(x.workouts || []).length} Einheiten, Plan „${(x.plan && x.plan.name) || 'kein Plan'}“, ${foods} Produkte` };
    d.msg = null; d.err = false; renderData();
  }, () => { d.msg = 'Die Datei ließ sich nicht lesen.'; d.err = true; renderData(); });
});

/* ---------- data & backup sheet ---------- */
const APP_VERSION = '1.0.0';
function exportPayload() { return { app: 'satzbuch', version: 1, exportedAt: new Date().toISOString(), data: { profile: S.profile, plan: S.plan, workouts: S.workouts, active: S.active, nut: S.nut, exinfo: S.exinfo } }; }
async function exportBackup() {
  const d = S.ui.data; if (!d) return;
  const name = `satzbuch-backup-${dayKey(Date.now())}.json`;
  const text = JSON.stringify(exportPayload());
  try {
    const file = new File([text], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Satzbuch-Backup' });
      d.msg = 'Backup weitergegeben. Speicher es am besten in iCloud Drive („In Dateien sichern“).'; d.err = false; renderData(); return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  d.msg = 'Backup gespeichert: ' + name; d.err = false; renderData();
}
function renderData() {
  const el = $('#datasheet'), d = S.ui.data;
  if (!d) { el.hidden = true; el.innerHTML = ''; syncSheetLock(); return; }
  el.hidden = false; syncSheetLock();
  const nDays = Object.values(S.nut.days).filter((x) => x && x.entries && x.entries.length).length;
  el.innerHTML = `<div class="sheet-backdrop" data-act="data-close"></div>
    <div class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="data-title">
      <div class="sheet-head"><div><p class="eyebrow">Auf diesem Gerät</p><h2 id="data-title">Daten & Backup</h2></div>
        <button class="icon-btn" type="button" data-act="data-close" aria-label="Schließen">${ICON.x}</button></div>
      <div class="sheet-body">
        <p class="small muted">Alle Daten liegen nur auf diesem iPhone. Speicher ab und zu ein Backup in iCloud Drive, damit nichts verloren geht, falls du die App löschst.</p>
        <div class="data-stats">
          <div class="tile"><b>${S.workouts.length}</b><span>Einheiten</span></div>
          <div class="tile"><b>${Object.keys(S.nut.foods).length}</b><span>Produkte</span></div>
          <div class="tile"><b>${nDays}</b><span>Ernährungstage</span></div>
        </div>
        ${d.msg ? `<p class="${d.err ? 'err' : 'copied'}">${esc(d.msg)}</p>` : ''}
        <button class="btn primary" type="button" data-act="backup-export">Backup speichern</button>
        <section class="stack"><h4>Backup laden</h4>
          <p class="small muted">Zum Beispiel die Datei aus dem Satzbuch-Artifact. Ersetzt die Daten auf diesem Gerät.</p>
          ${d.pending ? `<div class="confirm"><strong>Daten ersetzen?</strong><p class="small">${esc(d.pending.summary)}. Was jetzt auf diesem Gerät gespeichert ist, wird überschrieben.</p>
            <div class="btn-row"><button class="btn danger solid" type="button" data-act="backup-apply">Ersetzen</button><button class="btn" type="button" data-act="backup-discard">Abbrechen</button></div></div>`
          : '<button class="btn" type="button" data-act="backup-pick" style="justify-self:start">Backup-Datei auswählen</button>'}
        </section>
        <p class="small muted">Satzbuch ${APP_VERSION} · Produktdaten von Open Food Facts (ODbL)</p>
      </div>
    </div>`;
}
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* not supported */ }
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (VIEWS[h] && h !== S.view) { S.view = h; S.ui.confirm = null; render(); } });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.active && !wakeLock) requestWake(); });

/* ---------- boot ---------- */
applyData(lsRead());
const h0 = (location.hash || '').slice(1);
S.view = VIEWS[h0] && h0 !== 'erstellen' ? h0 : 'training';
render();
initSample();
initCloud();
setInterval(tick, 500);
})();
