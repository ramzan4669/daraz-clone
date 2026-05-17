import { createJfyCard } from './shared-product-card.js';

export function injectFlashSaleProducts(products) {
  const fsSection = document.getElementById('js_flashSale');
  if (!fsSection) return;

  const fsContent = fsSection.querySelector('.flash-sale-content');
  if (!fsContent) return;

  fsContent.innerHTML = '';

  const contentHeader = document.createElement('div');
  contentHeader.className = 'card-flash-content-header';
  contentHeader.innerHTML =
    '<div class="card-flash-header-wrap d-flex align-items-center">' +
      '<div class="card-flash-header-pad">' +
        '<div class="fs-status-text">On Sale Now</div>' +
      '</div>' +
    '</div>' +
    '<a class="shop-more-btn" href="/">' +
      '<span>SHOP ALL PRODUCTS</span>' +
    '</a>';
  fsContent.appendChild(contentHeader);

  const wrapper = document.createElement('div');
  wrapper.className = 'card-rec-wrapper';

  const fsProducts = products.slice(24, 30);
  fsProducts.forEach(function (product) {
    wrapper.appendChild(createJfyCard(product, true));
  });

  fsContent.appendChild(wrapper);
}

const JFY_INITIAL = 24;
const JFY_BATCH = 12;

let jfyProducts = [];
let jfyVisibleCount = 0;

function appendJfyProducts(wrapper, endIndex) {
  for (let i = jfyVisibleCount; i < endIndex; i++) {
    wrapper.appendChild(createJfyCard(jfyProducts[i]));
  }
  jfyVisibleCount = endIndex;
}

export function injectHomepageProducts(products) {
  const jfySection = document.getElementById('js_jfy');
  if (!jfySection) return;

  const wrapper = jfySection.querySelector('.card-rec-wrapper');
  if (!wrapper) return;

  jfyProducts = products || [];
  jfyVisibleCount = 0;
  wrapper.innerHTML = '';

  const initialEnd = Math.min(JFY_INITIAL, jfyProducts.length);
  appendJfyProducts(wrapper, initialEnd);

  let loadMoreContainer = jfySection.querySelector('.jfy-card-load-more');
  if (!loadMoreContainer) {
    loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'jfy-card-load-more';
    loadMoreContainer.innerHTML = '<div class="load-more-button">Load More</div>';
    const containerMain = jfySection.querySelector('.container-main');
    if (containerMain) {
      containerMain.appendChild(loadMoreContainer);
    } else {
      jfySection.appendChild(loadMoreContainer);
    }
  }

  const loadMoreButton = loadMoreContainer.querySelector('.load-more-button');
  if (loadMoreButton) {
    // ponytail: clone node to avoid duplicate listeners if re-injected
    const freshButton = loadMoreButton.cloneNode(true);
    loadMoreButton.replaceWith(freshButton);
    freshButton.addEventListener('click', function () {
      if (jfyVisibleCount >= jfyProducts.length) return;
      const nextEnd = Math.min(jfyVisibleCount + JFY_BATCH, jfyProducts.length);
      appendJfyProducts(wrapper, nextEnd);
      if (jfyVisibleCount >= jfyProducts.length) {
        loadMoreContainer.style.display = 'none';
      }
    });
  }

  loadMoreContainer.style.display = jfyVisibleCount >= jfyProducts.length ? 'none' : 'block';
}
