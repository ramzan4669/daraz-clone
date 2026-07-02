/*
 * Shared site header (top bar) partial.
 *
 * This is a deliberate, classic (non-module) script so it can be loaded as a
 * synchronous <script src="..."> in the <head>. The page then calls
 * getHeaderTopHtml(product) from a synchronous inline <script> placed exactly
 * where the header top bar must appear, via document.write(). Writing the
 * markup synchronously during parsing keeps <header> a direct child of
 * #main-scroll (so Bootstrap sticky-top still works) and avoids any layout
 * shift / flash, because the header is in the DOM before the parser advances
 * past that point. The returned string is byte-for-byte identical to the
 * previously hand-written top-bar markup of each page (verified by diff).
 */
function getHeaderTopHtml(product) {
  var headMainClass = product ? 'head-main product-header' : 'head-main';
  var searchClass = product
    ? 'position-relative'
    : 'position-relative overflow-hidden';
  var hotKeywords = product
    ? '\n          <div class="hot-keywords-container d-flex"></div>'
    : '';

  // Built at the product page's 6-space base indent.
  var html =
'      <div class="d-flex justify-content-end align-items-end head-top m-auto">\n' +
'        <a href="/">SAVE MORE ON APP</a>\n' +
'        <a href="/">SELL ON DARAZ</a>\n' +
'        <a href="/">HELP &amp; SUPPORT</a>\n' +
'        <a href="/" class="auth-trigger">LOGIN</a>\n' +
'        <a href="/" class="signup-trigger">SIGN UP</a>\n' +
'        <a href="/" lang="ur" dir="rtl">زبان تبدیل کریں</a>\n' +
'      </div>\n' +
'      <div class="d-flex align-items-end ' + headMainClass + ' m-auto">\n' +
'        <a href="/" class="nav-logo">\n' +
'          <img\n' +
'            src="https://lzd-img-global.slatic.net/us/domino/3b870cb043c7f8a9741cbf66329e294e.png"\n' +
'            alt="Daraz.pk"\n' +
'            class="logo-img"\n' +
'          />\n' +
'        </a>\n' +
'        <div class="head-search ' + searchClass + '">\n' +
'          <input type="search" readonly placeholder="Search in Daraz" />\n' +
'          <a href="/" class="search-button end-0 position-absolute"></a>' + hotKeywords + '\n' +
'        </div>\n' +
'        <a href="/" class="header-cart">\n' +
'          <svg\n' +
'            width="30"\n' +
'            height="30"\n' +
'            viewBox="0 0 32 32"\n' +
'            fill="none"\n' +
'            xmlns="http://www.w3.org/2000/svg"\n' +
'          >\n' +
'            <path\n' +
'              fill-rule="evenodd"\n' +
'              clip-rule="evenodd"\n' +
'              d="M4.51345 5H1.33325V3H6.15306L7.21972 8.33333H30.5315L27.5012 25H8.51345L4.51345 5ZM7.61972 10.3333L10.1531 23H25.832L28.135 10.3333H7.61972Z"\n' +
'              fill="white"\n' +
'            />\n' +
'            <path\n' +
'              d="M11.9999 28C11.9999 28.7364 11.403 29.3333 10.6666 29.3333C9.93021 29.3333 9.33325 28.7364 9.33325 28C9.33325 27.2636 9.93021 26.6667 10.6666 26.6667C11.403 26.6667 11.9999 27.2636 11.9999 28Z"\n' +
'              fill="white"\n' +
'            />\n' +
'            <path\n' +
'              d="M25.3333 29.3333C26.0696 29.3333 26.6666 28.7364 26.6666 28C26.6666 27.2636 26.0696 26.6667 25.3333 26.6667C24.5969 26.6667 23.9999 27.2636 23.9999 28C23.9999 28.7364 24.5969 29.3333 25.3333 29.3333Z"\n' +
'              fill="white"\n' +
'            />\n' +
'          </svg>\n' +
'        </a>\n' +
'      </div>';

  // The home page indents the header contents by an extra 2 spaces.
  if (!product) {
    html = html.split('\n').map(function (line) {
      return line.length ? '  ' + line : line;
    }).join('\n');
  }
  return html;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getHeaderTopHtml: getHeaderTopHtml };
}
