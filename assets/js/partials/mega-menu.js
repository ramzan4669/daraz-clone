/*
 * Mega-menu category tree template (product page only).
 *
 * ES module imported by inject.js. getMegaMenuTreeHtml() returns the <li>
 * tree; inject.js writes it into the #mega-menu-mount placeholder <li>
 * (inside <ul class="site-menu-root">) via outerHTML, so the <li>s become
 * direct children of the <ul>. The dropdown is visibility:hidden until
 * hover, so there is zero layout shift. CATEGORIES is imported from
 * categories-data.js.
 *
 * The generated DOM is structurally identical to the original hand-written
 * tree: same tags, classes, text, and hrefs (verified by DOM comparison).
 * Whitespace between block-level elements is omitted (rendering-irrelevant
 * since every <a> is display:block and inner <span> is display:inline-block).
 */
import { CATEGORIES } from './categories-data.js';

export function getMegaMenuTreeHtml() {
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function grandItem(item) {
    return (
      '<li class="site-menu-grand-item">' +
      '<a href="/"><span>' + esc(item.name) + '</span></a>' +
      '</li>'
    );
  }

  function subItem(item) {
    var html =
      '<li class="site-menu-sub-item">' +
      '<a href="/"><span>' + esc(item.name) + '</span></a>';
    if (item.children && item.children.length) {
      html += '<ul class="site-menu-grand">';
      for (var i = 0; i < item.children.length; i++) {
        html += grandItem(item.children[i]);
      }
      html += '</ul>';
    }
    html += '</li>';
    return html;
  }

  function rootItem(item) {
    var html =
      '<li class="site-menu-root-item">' +
      '<div class="site-menu-root-item-link"><span>' + esc(item.name) + '</span></div>';
    if (item.children && item.children.length) {
      html += '<ul class="site-menu-sub">';
      for (var i = 0; i < item.children.length; i++) {
        html += subItem(item.children[i]);
      }
      html += '</ul>';
    }
    html += '</li>';
    return html;
  }

  var html = '';
  for (var i = 0; i < CATEGORIES.length; i++) {
    html += rootItem(CATEGORIES[i]);
  }
  return html;
}
