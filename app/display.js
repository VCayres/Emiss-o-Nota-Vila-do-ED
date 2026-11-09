/* Presentation only: fullscreen never initializes, finishes or resets an LMS attempt. */
(() => {
  'use strict';
  const button = document.getElementById('fullscreen-toggle');
  const label = document.getElementById('fullscreen-label');
  const status = document.getElementById('display-status');
  const root = document.documentElement;
  let busy = false;
  const active = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  function sync() {
    const full = active();
    label.textContent = full ? 'Sair da tela cheia' : 'Tela cheia';
    button.setAttribute('aria-pressed', String(full));
    button.disabled = busy;
  }
  function unavailable() {
    status.textContent = 'A tela cheia não está disponível nesta janela. No curso, essa opção precisa estar liberada pelo responsável. Você pode continuar a atividade aqui.';
  }
  async function toggle() {
    if (busy) return;
    status.textContent = '';
    const full = active();
    const action = full ? document.exitFullscreen || document.webkitExitFullscreen : root.requestFullscreen || root.webkitRequestFullscreen;
    const permitted = document.fullscreenEnabled ?? document.webkitFullscreenEnabled;
    if (!action || !full && permitted === false) { unavailable(); sync(); return; }
    busy = true; sync();
    try {
      await action.call(full ? document : root);
    } catch (_) {
      if (!active()) unavailable();
    } finally {
      busy = false; sync();
    }
  }
  button.addEventListener('click', toggle);
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && active()) toggle(); });
  sync();
})();
