/*
 * Home page category grid partial.
 *
 * Classic (non-module) script loaded synchronously in <head>. The page calls
 * getCategoryListHtml() from a synchronous inline <script> placed inside
 * .home-card (after .home-card-header) via document.write(). This writes the
 * entire .category-list div, so the <script> is a child of .home-card (which
 * has no :nth-child selectors) and .category-list contains only <a> children
 * (preserving the .category-item:nth-child(8n) border pattern exactly).
 *
 * The category-list is a flex container (d-flex flex-wrap) with default
 * white-space:normal, so whitespace between flex items is collapsed and not
 * rendered — compact output is pixel-identical to the original.
 *
 * DOM-verified: same tags, classes, text, src, and hrefs as the original.
 */
var HOME_CATEGORIES = [
  { src: "https://img.drz.lazcdn.com/static/pk/p/79eee1bb813d5641006f949693e8ddac.png_170x170q80.png", name: "3D Printers" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/ef7bbcb7f09bda1dc8141e3186f83f5b.jpg_170x170q80.jpg", name: "Pasta, Noodle & Pizza Tools" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/eb24729ada7367ba286bd9a1106f5794.jpg_170x170q80.jpg", name: "Screen Protectors" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/8753c48009ef69f6369835eef4e7e55c.jpg_170x170q80.jpg", name: "Casserole Pots" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/0d994c4238b17284f2699f83a5f0c82d.jpg_170x170q80.jpg", name: "Hoodies & Sweatshirts" },
  { src: "https://img.drz.lazcdn.com/g/kf/S471638c4573e489ea3dd7d8f5a876270w.jpg_170x170q80.jpg", name: "Toy Boxes & Organisers" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/c8ed001df64363aaeb3f8364ccb8f797.jpg_170x170q80.jpg", name: "Pepper" },
  { src: "https://img.drz.lazcdn.com/collect/sg/p/d80414ab4ca90792680ed321b6b5208e.jpg_170x170q80.jpg", name: "Dining Sets" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/aba332825aae6f8be2c78ac8eb9ff7a3.jpg_170x170q80.jpg", name: "Microphones" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/d7c6da20512a60d5eea68d7dfc1ecec8.jpg_170x170q80.jpg", name: "Leashes & Harnesses" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/3d0ed906e093468fbeedf37f3a37eaff.jpg_170x170q80.jpg", name: "Donate to Educate" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/33e449072df1ca5b35d2628a8f9a66e9.jpg_170x170q80.jpg", name: "Coloring & Drawing" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/0bc0c8034c12d51041a2b48a116b3794.jpg_170x170q80.jpg", name: "Heatsinks" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/2f9923d3dac8ca8a7a687603fedd98f8.png_170x170q80.png", name: "Others" },
  { src: "https://img.drz.lazcdn.com/static/pk/p/0f98800784829e6807b13e81467da0e9.jpg_170x170q80.jpg", name: "Air Dryers, Blowers & Blades" },
  { src: "https://img.drz.lazcdn.com/g/kf/S1847b6ea45d64d71809cfaa9a94e4b21v.jpg_170x170q80.jpg", name: "Everyday Glassware" }
];

function getCategoryListHtml() {
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  var html = '<div class="category-list d-flex flex-wrap">';
  for (var i = 0; i < HOME_CATEGORIES.length; i++) {
    var c = HOME_CATEGORIES[i];
    html +=
      '<a class="category-item" href="/">' +
      '<div class="category-image">' +
      '<img src="' + c.src + '" />' +
      '</div>' +
      '<div class="category-name">' + esc(c.name) + '</div>' +
      '</a>';
  }
  html += '</div>';
  return html;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOME_CATEGORIES: HOME_CATEGORIES, getCategoryListHtml: getCategoryListHtml };
}
