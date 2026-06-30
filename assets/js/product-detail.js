import { getCurrentProductId, getProductsData } from "./utils.js";
import { updateGallery, initDrift } from "./pdp/gallery.js";
import { updateTitle, updatePdpChrome, updatePrice, updateRating, updateBrand, updateSellerInfo, renderRelatedProducts, renderBreadcrumb } from "./pdp/sections.js";
import { updateSKUSelection, updateCartButtons, initQuantityControls } from "./pdp/purchase.js";
import { renderProductDetails } from "./pdp/description.js";
import { initReviews } from "./reviews-renderer.js";
import { initQnA } from "./qna-renderer.js";
import { initHotKeywords, initCategoriesDropdown } from "./site-chrome.js";

export function injectProductPageData(products) {
  const productId = getCurrentProductId();

  let product;
  if (productId) {
    product = products.find(function (p) {
      return p.id === productId;
    });
  }
  if (!product) product = products[0];
  if (!product) return;

  updateGallery(product);
  initDrift();
  updateTitle(product);
  updatePdpChrome(product);
  updatePrice(product);
  updateRating(product);
  updateBrand(product);
  updateSKUSelection(product);
  updateSellerInfo(product);
  updateCartButtons(product);
  renderProductDetails(product);
  renderRelatedProducts(products, product.id);
  renderBreadcrumb(product);

  const qtyInput = document.getElementById("qty-input");
  if (qtyInput && typeof product.maxQuantity === "number") {
    qtyInput.max = product.maxQuantity;
    qtyInput.value = String(
      Math.max(
        Number(qtyInput.min) || 1,
        Math.min(
          Number(qtyInput.value) || 1,
          product.maxQuantity
        )
      )
    );
  }

  initQuantityControls();
}

function init() {
  getProductsData().then(function (d) {
    if (!d) return;
    injectProductPageData(d.products);
    initReviews(d.products);
    initQnA(d.products);
  });
  initHotKeywords();
  initCategoriesDropdown();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
