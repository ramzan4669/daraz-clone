import {
  injectHomepageProducts,
  injectFlashSaleProducts,
} from "./homepage-grid.js";
import { injectProductPageData } from "./product-detail.js";
import { initReviews } from "./reviews-renderer.js";
import { initQnA } from "./qna-renderer.js";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs";

// ponytail: merged from price-formatter.js, url-helpers.js, data-loader.js, hot-keywords-render.js
// circular imports are safe — live bindings, all calls happen at runtime after DOMContentLoaded
export function formatPrice(price) {
  if (!price && price !== 0) return '';
  return Number(price).toLocaleString('en-PK');
}

export function getCurrentProductId() {
  const n = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  return Number.isNaN(n) ? null : n;
}

const DATA_URL = 'data/products.json';
let dataPromise = null;
export function getProductsData() {
  return dataPromise = dataPromise || fetch(DATA_URL)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .catch(e => { console.error('Products load failed:', e.message); dataPromise = null; return null; });
}

function initHotKeywords() {
  getProductsData().then(function (d) {
    if (!d || !d.hotKeywords) return;
    const container = document.querySelector('.hot-keywords-container');
    if (!container) return;
    container.innerHTML = d.hotKeywords
      .map(function (k) { return '<a href="/">' + k + '</a>'; })
      .join('<span>|</span>');
  });
}

function initCategoriesDropdown() {
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

function init() {
  const isProductPage = window.location.pathname.includes("product.html");

  if (isProductPage) {
    getProductsData().then(function (d) {
      if (!d) return;
      injectProductPageData(d.products, d.breadcrumbCategories);
      initReviews(d.products);
      initQnA(d.products);
    });
    initHotKeywords();
  } else {
    getProductsData().then(function (d) {
      if (!d) return;
      injectFlashSaleProducts(d.products);
      injectHomepageProducts(d.products);
    });

    injectHeroSlides();

    new Swiper(".hero-swiper", {
      loop: true,
      speed: 300,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: ".hero-swiper .swiper-pagination",
        clickable: true,
        type: "bullets",
      },
      navigation: {
        nextEl: ".hero-swiper .swiper-button-next",
        prevEl: ".hero-swiper .swiper-button-prev",
      },
    });

    initLiftNav();
  }

  initCategoriesDropdown();
}

const heroSlides = [
  {
    src: "39cc303b-41ad-4cb7-ac23-9d8ce76b9c8c_PK-1976-688.jpg",
    alt: "Tech Tuesday",
  },
  {
    src: "cff38faf-af9a-450e-a29c-35f824d279ba_PK-1976-688.jpg",
    alt: "Hot Deal 4.4",
  },
  {
    src: "ce239e0d-6444-4f63-be6d-548f40afded9_PK-1976-688.jpg",
    alt: "Flash Sale",
  },
  {
    src: "6c15c569-a023-4554-a07a-6e48d251eb6d_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "73d433aa-f0c8-49f6-bb3e-5ed5d9f1aaeb_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "8c2b123f-d24e-44d0-8604-297b686a1526_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "07c76b0c-c48a-4a83-ad38-09feced8b7b1_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "9982ee88-54cf-4e98-aaf0-b48516e573e5_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "535dd818-e979-4b11-82e2-42e0f220e18f_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "6cd12443-88f0-437e-aeab-771aba83bdb1_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "3f4723db-7f0b-468e-9ae5-5f2107ab896c_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "9f2509d8-af12-4a79-ac8c-e31a4515f44c_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "557cbe5f-9f30-40e5-af39-d490242bbdc4_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "6d797d8b-7619-4c66-b2ad-0f3f8a5926d1_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
  {
    src: "947cfc0e-a6ec-4c42-b0e9-5ca7b9be607c_PK-1976-688.jpg",
    alt: "Sale Banner",
  },
];

function injectHeroSlides() {
  const wrapper = document.querySelector(".hero-swiper .swiper-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = heroSlides
    .map(
      (slide) => `
        <div class="swiper-slide">
          <a href="/">
            <img
              src="https://img.lazcdn.com/us/domino/${slide.src}"
              alt="${slide.alt}"
              class="w-100"
            />
          </a>
        </div>
      `,
    )
    .join("");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function initLiftNav() {
  const liftNav = document.getElementById("lift-nav");
  if (!liftNav) return;

  const scrollContainer = document.getElementById("recyclerview") || window;
  function getScrollY() {
    return scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
  }
  function scrollTo(y) {
    scrollContainer.scrollTo({ top: y, behavior: "smooth" });
  }

  const scrollToTopBox = liftNav.querySelector(".scroll-to-top-box");
  const categoriesIcon = liftNav.querySelector('[icon-id="hp-categories"]');
  const jfyIcon = liftNav.querySelector('[icon-id="hp-just-for-you"]');
  const fsIcon = liftNav.querySelector('[icon-id="hp-flash-sale"]');
  const categoriesBox = categoriesIcon?.closest(".lift-nav-box");
  const jfyBox = jfyIcon?.closest(".lift-nav-box");
  const fsBox = fsIcon?.closest(".lift-nav-box");

  scrollContainer.addEventListener("scroll", function () {
    const show = getScrollY() > 100;
    liftNav.classList.toggle("show", show);
    if (scrollToTopBox) scrollToTopBox.classList.toggle("show", show);
  });

  if (scrollToTopBox) {
    scrollToTopBox.addEventListener("click", function () {
      scrollTo(0);
    });
  }

  if (!categoriesIcon || !jfyIcon || !fsIcon) return;

  const navItems = [
    { id: "js_categories", icon: categoriesIcon, box: categoriesBox },
    { id: "js_jfy", icon: jfyIcon, box: jfyBox },
    { id: "js_flashSale", icon: fsIcon, box: fsBox },
  ];

  const header = document.querySelector(".head");
  const headerHeight = header ? header.offsetHeight : 0;

  navItems.forEach(function (item) {
    if (!item.box) return;
    item.box.addEventListener("click", function () {
      const section = document.getElementById(item.id);
      if (!section) return;
      const sectionTop =
        section.getBoundingClientRect().top + getScrollY() - headerHeight;
      scrollTo(sectionTop);
    });
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navItems.forEach(function (item) {
        if (item.icon) item.icon.classList.remove("active");
      });
      const active = navItems.find(function (n) {
        return n.id === entry.target.id;
      });
      if (active && active.icon) active.icon.classList.add("active");
    });
  }, { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 });

  navItems.forEach(function (item) {
    const section = document.getElementById(item.id);
    if (section) observer.observe(section);
  });
}
