(function (root) {
  'use strict';
  function discover(start) {
    const seen = new Set();
    function walk(win) {
      for (let i = 0; win && i < 20 && !seen.has(win); i++) {
        seen.add(win);
        try { if (win.API && typeof win.API.LMSInitialize === 'function') return win.API; } catch (_) {}
        try { if (win.parent === win) break; win = win.parent; } catch (_) { break; }
      }
      return null;
    }
    const found = walk(start);
    if (found) return found;
    try { return walk(start.opener); } catch (_) { return null; }
  }
  function sessionTime(ms) {
    const cs = Math.min(3599999999, Math.max(0, Math.floor(ms / 10)));
    return `${String(Math.floor(cs / 360000)).padStart(4, '0')}:${String(Math.floor(cs / 6000) % 60).padStart(2, '0')}:${String(Math.floor(cs / 100) % 60).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
  }
  class Bridge {
    constructor(win = root, now = () => Date.now()) {
      this.win = win; this.now = now; this.started = now(); this.api = discover(win); this.active = false; this.finished = false; this.passed = false; this.error = ''; this.errorCode = ''; this.onError = null;
      this.mode = this.api ? 'lms' : 'demo';
    }
    fail(message, code = '') { this.error = message; this.errorCode = code; if (this.onError) this.onError(message); }
    call(method, ...args) {
      try {
        const result = this.api[method](...args);
        const code = String(this.api.LMSGetLastError());
        if (code !== '0' || (method !== 'LMSGetValue' && String(result) !== 'true')) {
          this.fail(`Falha no registro Moodle (${method}, código ${code}). Tente salvar novamente antes de sair.`, code); return null;
        }
        return result;
      } catch (_) { this.fail(`Comunicação Moodle indisponível (${method}). Tente salvar novamente antes de sair.`); return null; }
    }
    init() {
      if (!this.api) {
        try { return JSON.parse(this.win.localStorage.getItem('vila-ed-demo-v1') || 'null'); } catch (_) { this.fail('O navegador não permitiu recuperar o progresso local.'); return null; }
      }
      if (this.call('LMSInitialize', '') === null) return null;
      this.active = true;
      const status = this.call('LMSGetValue', 'cmi.core.lesson_status');
      if (status === null) { this.active = false; return null; }
      this.passed = status === 'passed';
      const entry = this.call('LMSGetValue', 'cmi.core.entry');
      if (entry === null) { this.active = false; return null; }
      let saved = null;
      // A new attempt must not inherit old suspend_data; Moodle resume uses entry=resume.
      if (entry !== 'ab-initio' || this.passed) {
        const data = this.call('LMSGetValue', 'cmi.suspend_data');
        if (data === null) { this.active = false; return null; }
        try { saved = data ? JSON.parse(data) : null; } catch (_) { this.fail('O progresso salvo não pôde ser lido. A aprovação existente foi preservada.'); }
      }
      if (!this.passed) this.call('LMSSetValue', 'cmi.core.lesson_status', 'incomplete');
      this.call('LMSCommit', '');
      return saved;
    }
    save(state) {
      if (this.finished) return false;
      this.error = ''; this.errorCode = '';
      const json = JSON.stringify(state);
      if (new TextEncoder().encode(json).length > 4096) { this.fail('O progresso excedeu o limite de 4096 bytes. Não feche a atividade.'); return false; }
      if (this.mode === 'demo') {
        try { this.win.localStorage.setItem('vila-ed-demo-v1', json); return true; } catch (_) { this.fail('Não foi possível salvar neste navegador. Mantenha a atividade aberta.'); return false; }
      }
      if (!this.active) { this.fail('O Moodle não iniciou a comunicação. Reabra a atividade pelo curso.'); return false; }
      let ok = true;
      const set = (key, value) => { if (this.call('LMSSetValue', key, String(value)) === null) ok = false; };
      set('cmi.suspend_data', json);
      set('cmi.core.lesson_location', `${state.step}:${state.merchant || ''}`);
      set('cmi.core.session_time', sessionTime(this.now() - this.started));
      set('cmi.core.exit', 'suspend');
      if (state.completed || this.passed) {
        set('cmi.core.score.min', 0); set('cmi.core.score.max', 100); set('cmi.core.score.raw', 100);
        set('cmi.core.lesson_status', 'passed');
      } else set('cmi.core.lesson_status', 'incomplete');
      if (this.call('LMSCommit', '') === null) ok = false;
      if (ok && state.completed) this.passed = true;
      return ok;
    }
    finish(state) {
      if (this.finished) return true;
      if (!this.save(state)) return false;
      if (this.mode === 'lms' && this.call('LMSFinish', '') === null) return false;
      this.finished = true; this.active = false; return true;
    }
  }
  root.VilaScorm = { Bridge, discover, sessionTime };
  if (typeof module !== 'undefined') module.exports = root.VilaScorm;
})(typeof window === 'undefined' ? globalThis : window);
