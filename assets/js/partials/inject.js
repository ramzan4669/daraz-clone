import { authModalHtml } from './auth-modal.js';
import { messagesButtonHtml } from './messages-button.js';
import { getFooterHtml } from './footer.js';
import { getHeaderTopHtml } from './header.js';
import { getCategoryListHtml } from './home-categories.js';
import { getMegaMenuTreeHtml } from './mega-menu.js';

const authMount = document.getElementById('auth-modal-mount');
if (authMount) authMount.innerHTML = authModalHtml;

const msgMount = document.getElementById('messages-button-mount');
if (msgMount) msgMount.innerHTML = messagesButtonHtml;

const footerMount = document.getElementById('footer-mount');
if (footerMount) {
  const includeThird = document.body.classList.contains('home-page');
  footerMount.innerHTML = getFooterHtml(includeThird);
}

// Header top bar (both pages). Reserved min-height in header.css prevents
// layout shift while this deferred module fills the mount.
const headerMount = document.getElementById('header-top-mount');
if (headerMount) {
  const isProduct = document.body.classList.contains('product-page');
  headerMount.innerHTML = getHeaderTopHtml(isProduct);
}

// Home category grid (index.html only).
const catMount = document.getElementById('category-list-mount');
if (catMount) {
  catMount.innerHTML = getCategoryListHtml();
}

// Mega-menu tree (product.html only). The mount is a placeholder <li> inside
// <ul class="site-menu-root">; outerHTML replaces it with the real <li> tree
// (a <div> mount inside a <ul> would be invalid HTML).
const megaMenuMount = document.getElementById('mega-menu-mount');
if (megaMenuMount) {
  megaMenuMount.outerHTML = getMegaMenuTreeHtml();
}
