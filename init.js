// init.js — Application bootstrap
// Runs last, after all modules are loaded.

// ─── KEYBOARD SHORTCUTS ──────────────────────────
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDM();});

// ─── AUTH CHECK ──────────────────────────────────
checkAuth();

// ─── CLOCK ───────────────────────────────────────
tick();
setInterval(tick,30000);

// ─── RENDER ALL PAGES ────────────────────────────
renderTasks();
renderCal();
renderInt();
renderTeam();
renderAnalytics();
renderEdu();
renderCRM();
renderYAG();
