// init.js — Application bootstrap
// Runs last, after all modules and data files are loaded.

// ─── KEYBOARD SHORTCUTS ──────────────────────────
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDM(); });

// ─── AUTH CHECK ──────────────────────────────────
checkAuth();

// ─── LOAD SAVED STATE ────────────────────────────
loadState();

// ─── CLOCK ───────────────────────────────────────
tick();
setInterval(tick, 30000);

// ─── RENDER ALL PAGES ────────────────────────────
renderTasks();
renderCal();
renderInt();
renderTeam();
renderAnalytics();
renderEdu();
renderCRM();
renderYAG();

// ─── AUTO-SAVE on any interaction ────────────────
let _saveTimer = null;
function scheduleSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(saveState, 400);
}
document.addEventListener('click', scheduleSave);
document.addEventListener('input', scheduleSave);
document.addEventListener('change', scheduleSave);
