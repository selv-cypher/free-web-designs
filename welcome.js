/* ============================================================
   ReTrO StItChEs — entry gate (login/signup-or-skip) shown before
   the home page. Demo only: accounts live in this browser only.
   ============================================================ */

const ENTRY_SEEN_KEY = 'retro_stitches_entry_seen';

function switchAuthTab(which) {
  const isLogin = which === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
  document.getElementById('signup-form').style.display = isLogin ? 'none' : 'block';
  document.getElementById('login-error').textContent = '';
  document.getElementById('signup-error').textContent = '';
}

function markEntrySeen() {
  try { sessionStorage.setItem(ENTRY_SEEN_KEY, '1'); } catch (e) {}
}

function skipEntry() {
  markEntrySeen();
  window.location.href = 'index.html';
}

function handleLoginSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const result = STORE.login(form.email.value, form.password.value);
  const errEl = document.getElementById('login-error');
  if (!result.ok) {
    errEl.textContent = result.error;
    return;
  }
  errEl.textContent = '';
  markEntrySeen();
  window.location.href = 'index.html';
}

function handleSignupSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const result = STORE.signup(form.name.value, form.email.value, form.password.value);
  const errEl = document.getElementById('signup-error');
  if (!result.ok) {
    errEl.textContent = result.error;
    return;
  }
  errEl.textContent = '';
  markEntrySeen();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (STORE.currentUser()) {
    markEntrySeen();
    window.location.href = 'index.html';
  }
});
