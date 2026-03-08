// storage.js — localStorage persistence for all app state
// Called after shared.js loads S, and after data files populate it.

const STORAGE_KEY = 'pm_state_v1';

// ─── SAVE ────────────────────────────────────────
// Call this after any mutation to S or YAG
function saveState() {
  try {
    const payload = {
      tasks: S.tasks,
      teamTasks: S.teamTasks,
      analytics: S.analytics,
      crm: S.crm,
      interviews: S.interviews.map(iv => ({
        rank: iv.rank,
        status: iv.status,
        notes: iv.notes,
      })),
      books: {
        mission: S.books.mission.map(b => ({ done: b.done, notes: b.notes || '' })),
        wgu: S.books.wgu.map(b => ({ done: b.done, status: b.status, notes: b.notes })),
        faith: S.books.faith.map(b => ({ done: b.done, notes: b.notes || '' })),
      },
      cal: CAL.map(ph => ({ posts: ph.posts.map(p => ({ st: p.st })) })),
      yag: YAG.map(q => ({ items: q.items.map(it => ({ done: it.done })) })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch(e) {
    console.warn('Save failed:', e);
  }
}

// ─── LOAD ────────────────────────────────────────
// Merges saved state back into the live data structures
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);

    // Tasks
    if (p.tasks) {
      Object.keys(p.tasks).forEach(type => {
        if (S.tasks[type]) S.tasks[type] = p.tasks[type];
      });
    }

    // Team tasks
    if (p.teamTasks) {
      Object.keys(p.teamTasks).forEach(k => {
        if (S.teamTasks[k]) S.teamTasks[k] = p.teamTasks[k];
      });
    }

    // Analytics
    if (p.analytics) {
      S.analytics.metrics.forEach(m => {
        const saved = p.analytics.metrics && p.analytics.metrics.find(sm => sm.key === m.key);
        if (saved) {
          m.monthly = saved.monthly;
          m.notes = saved.notes;
        }
      });
    }

    // CRM
    if (p.crm) S.crm = p.crm;

    // Interviews — only restore mutable fields (status, notes)
    if (p.interviews) {
      p.interviews.forEach(sv => {
        const iv = S.interviews.find(i => i.rank === sv.rank);
        if (iv) {
          iv.status = sv.status;
          iv.notes = sv.notes;
        }
      });
    }

    // Books — mission
    if (p.books && p.books.mission) {
      p.books.mission.forEach((sv, i) => {
        if (S.books.mission[i]) {
          S.books.mission[i].done = sv.done;
          S.books.mission[i].notes = sv.notes || '';
        }
      });
    }

    // Books — wgu
    if (p.books && p.books.wgu) {
      p.books.wgu.forEach((sv, i) => {
        if (S.books.wgu[i]) {
          S.books.wgu[i].done = sv.done;
          S.books.wgu[i].status = sv.status;
          S.books.wgu[i].notes = sv.notes;
        }
      });
    }

    // Books — faith
    if (p.books && p.books.faith) {
      p.books.faith.forEach((sv, i) => {
        if (S.books.faith[i]) {
          S.books.faith[i].done = sv.done;
          S.books.faith[i].notes = sv.notes || '';
        }
      });
    }

    // Calendar post statuses
    if (p.cal) {
      p.cal.forEach((ph, pi) => {
        if (CAL[pi]) {
          ph.posts.forEach((post, i) => {
            if (CAL[pi].posts[i]) CAL[pi].posts[i].st = post.st;
          });
        }
      });
    }

    // Year at a Glance
    if (p.yag) {
      p.yag.forEach((q, qi) => {
        if (YAG[qi]) {
          q.items.forEach((it, ii) => {
            if (YAG[qi].items[ii]) YAG[qi].items[ii].done = it.done;
          });
        }
      });
    }

  } catch(e) {
    console.warn('Load failed:', e);
  }
}

// ─── CLEAR ───────────────────────────────────────
function clearState() {
  if (confirm('Reset ALL progress? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}
