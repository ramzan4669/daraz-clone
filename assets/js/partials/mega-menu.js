/*
 * Mega-menu category tree template (product page only).
 *
 * Classic (non-module) script loaded synchronously in <head> AFTER
 * categories-data.js (which defines the global CATEGORIES array).
 * The page calls getMegaMenuTreeHtml() from a synchronous inline <script>
 * placed inside <ul class="site-menu-root"> via document.write(), so the
 * <li> tree is in the DOM before the parser advances. The dropdown is
 * visibility:hidden until hover, so there is zero layout shift.
 *
 * The generated DOM is structurally identical to the original hand-written
 * tree: same tags, classes, text, and hrefs (verified by DOM comparison).
 * Whitespace between block-level elements is omitted (rendering-irrelevant
 * since every <a> is display:block and inner <span> is display:inline-block).
 */
function getMegaMenuTreeHtml() {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getMegaMenuTreeHtml: getMegaMenuTreeHtml };
}
