/* ============================================================
   ReTrO StItChEs — login / signup page logic
   ============================================================ */

function switchAuthTab(which) {
  const isLogin = which === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('login-form').style.display = isLogin ? 'block' : 'none';
  document.getElementById('signup-form').style.display = isLogin ? 'none' : 'block';
  document.getElementById('login-error').textContent = '';
  document.getElementById('signup-error').textContent = '';
}

function redirectAfterAuth() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  window.location.href = next ? decodeURIComponent(next) : 'index.html';
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
  showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`);
  redirectAfterAuth();
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
  showToast(`Account created — welcome, ${result.user.name.split(' ')[0]}!`);
  redirectAfterAuth();
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader('');
  renderFooter();
  if (STORE.currentUser()) {
    // Already logged in — no need to show the auth form
    redirectAfterAuth();
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'signup') switchAuthTab('signup');
});
