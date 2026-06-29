import { getProductsData } from "./utils.js";

export function initHotKeywords() {
  getProductsData().then(function (d) {
    if (!d || !d.hotKeywords) return;
    const container = document.querySelector('.hot-keywords-container');
    if (!container) return;
    container.innerHTML = d.hotKeywords
      .map(function (k) { return '<a href="/">' + k + '</a>'; })
      .join('<span class="sep">&nbsp;&nbsp;|&nbsp;&nbsp;</span>');
  });
}

export function initCategoriesDropdown() {
  const catLabel = document.querySelector(".site-menu-nav-category-label");
  const catDiv = document.querySelector(".site-menu-nav-category");
  const menu = document.querySelector(".site-menu-nav-menu");
  if (!catLabel || !catDiv || !menu) return;

  let hideTimeout = null;

  function showMenu() {
    clearTimeout(hideTimeout);
    catDiv.classList.add("label-hovered");
  }

  function hideMenu() {
    hideTimeout = setTimeout(function () {
      catDiv.classList.remove("label-hovered");
    }, 150);
  }

  catLabel.addEventListener("mouseenter", showMenu);
  catLabel.addEventListener("mouseleave", hideMenu);

  menu.addEventListener("mouseenter", function () {
    clearTimeout(hideTimeout);
  });
  menu.addEventListener("mouseleave", hideMenu);
}
