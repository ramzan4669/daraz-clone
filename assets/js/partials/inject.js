import { authModalHtml } from './auth-modal.js';
import { messagesButtonHtml } from './messages-button.js';
import { getFooterHtml } from './footer.js';

const authMount = document.getElementById('auth-modal-mount');
if (authMount) authMount.innerHTML = authModalHtml;

const msgMount = document.getElementById('messages-button-mount');
if (msgMount) msgMount.innerHTML = messagesButtonHtml;

const footerMount = document.getElementById('footer-mount');
if (footerMount) {
  const includeThird = document.body.classList.contains('home-page');
  footerMount.innerHTML = getFooterHtml(includeThird);
}
