import { formatPrice } from "../utils.js";
import { buildStarsPdpHtml } from "../rating-renderer.js";
import { createJfyCard } from "../shared-product-card.js";

export function updateTitle(product) {
  document.title = product.title;
  const titleEl = document.getElementById("product-title");
  if (titleEl) titleEl.textContent = product.title;
}

export function updatePdpChrome(product) {
  const wrap = document.querySelector(".product-info-badge-wrapper");
  if (wrap) {
    const prev = wrap.querySelector(".product-store-entry-badge");
    if (prev) prev.remove();
    if (product.mallEntryIcon) {
      const a = document.createElement("a");
      a.className = "product-store-entry-badge";
      a.href = "#";
      a.innerHTML =
        '<img src="' +
        product.mallEntryIcon +
        '" alt="" width="22" height="22" decoding="async">';
      wrap.insertBefore(a, wrap.firstChild);
    }
  }

  const modInst = document.getElementById("module_installment");
  if (!modInst) return;
  if (!product.installmentLine) {
    modInst.innerHTML = "";
    return;
  }
  modInst.innerHTML =
    '<div class="product-info-section product-info-installment-section">' +
    '<h6 class="section-title">Installment</h6>' +
    '<div class="section-content product-info-installment-body">' +
    '<span class="product-info-installment-chip">Installment</span>' +
    '<span class="product-info-installment-cal">' +
    '<svg width="22" height="22" viewBox="0 0 1024 1024" fill="none"><path d="M810.7 170.7H213.3c-47.1 0-85.3 38.2-85.3 85.3v512c0 47.1 38.2 85.3 85.3 85.3h597.3c47.1 0 85.3-38.2 85.3-85.3V256c0-47.1-38.2-85.3-85.3-85.3zm42.6 597.3c0 23.6-19 42.7-42.6 42.7H213.3c-23.6 0-42.7-19-42.7-42.7V341.3h682.7V768zM298.7 85.3h42.7v85.3H298.7V85.3zm384 0h42.7v85.3h-42.7V85.3z" fill="#9E9E9E"/></svg>' +
    "</span>" +
    '<span class="product-info-installment-desc">' +
    product.installmentLine +
    "</span>" +
    "</div></div>";
}

export function updatePrice(product) {
  const priceEl = document.getElementById("product-price");
  if (!priceEl) return;

  let html = "";
  if (product.priceBanner) {
    html +=
      '<img class="product-info-price-topbanner" src="' +
      product.priceBanner +
      '" alt="promotion">';
  }
  html += '<div class="product-product-price">';
  html +=
    '<span class="notranslate product-price product-price-type-normal product-price-color-orange product-price-size-xl">';
  html += product.currency + " " + formatPrice(product.price);
  html += "</span>";

  if (
    product.originalPrice &&
    Number(product.originalPrice) > Number(product.price)
  ) {
    html += '<div class="origin-block">';
    html +=
      '<span class="notranslate product-price product-price-type-deleted product-price-color-lightgray product-price-size-xs">';
    html += product.currency + " " + formatPrice(product.originalPrice);
    html += "</span>";

    if (product.discount && parseFloat(product.discount) > 0) {
      html +=
        '<span class="product-product-price-discount">-' +
        product.discount +
        "</span>";
    }
    html += "</div>";
  }
  html += "</div>";

  priceEl.innerHTML = html;
}

export function updateRating(product) {
  const reviewSection = document.getElementById("product-rating");
  if (!reviewSection) return;

  const summary = product?.reviews?.summary;
  const rating = summary ? summary.averageRating : product.rating;
  const ratingCount = summary ? summary.totalRatings : product.ratingCount;

  if (!rating) {
    reviewSection.innerHTML =
      '<a class="product-link product-link-size-s product-link-theme-blue product-review-summary-link">No Ratings</a>';
    return;
  }

  const starsHtml = buildStarsPdpHtml(rating);

  reviewSection.innerHTML =
    '<div class="product-review-summary-stars product-stars-size-s">' +
    starsHtml +
    "</div>" +
    '<a class="product-link product-link-size-s product-link-theme-blue product-review-summary-link">' +
    Number(ratingCount) +
    " Ratings</a>" +
    '<div class="product-review-summary-divider"></div>' +
    '<a class="product-link product-link-size-s product-link-theme-blue product-review-summary-link">' +
    5 +
    " Answered Questions</a>";
}

export function updateBrand(product) {
  const brandEl = document.getElementById("product-brand");
  if (!brandEl) return;

  const brandName = product.brand || "No Brand";
  const freeShippingHtml = product.freeShipping
    ? '<div class="product-product-brand-freeship">Free Shipping</div>'
    : "";
  brandEl.innerHTML =
    '<span class="product-product-brand-name">Brand: </span>' +
    '<a class="product-link product-link-size-s product-link-theme-blue product-product-brand-brand-link" target="_self" href="/">' +
    brandName +
    "</a>" +
    '<div class="product-product-brand-divider"></div>' +
    '<a class="product-link product-link-size-s product-link-theme-blue product-product-brand-suggestion-link" target="_self" href="/" style="max-width: calc(100% - 97px);">More Mobiles from ' +
    brandName +
    "</a>" +
    freeShippingHtml;
}

function sellerShopUrl(product) {
  return (
    "/shop/" +
    (product.seller || "seller").replace(/\s+/g, "-").toLowerCase() +
    "/"
  );
}

export function updateSellerInfo(product) {
  const sellerLink = document.getElementById("seller-link");
  if (sellerLink) {
    sellerLink.textContent = product.seller || "";
    sellerLink.href = sellerShopUrl(product);
  }

  const sellerBadge = document.getElementById("seller-badge");
  if (sellerBadge && product.sellerBadge) {
    sellerBadge.src = product.sellerBadge;
    sellerBadge.style.display = "block";
  }

  const sellerRatings = document.getElementById("seller-ratings");
  if (sellerRatings) {
    if (product.sellerRating != null) {
      sellerRatings.textContent = product.sellerRating + "%";
      sellerRatings.classList.toggle("rating-positive", product.sellerRating >= 90);
    } else {
      sellerRatings.parentElement.style.display = "none";
    }
  }

  const sellerShips = document.getElementById("seller-ships");
  if (sellerShips) {
    sellerShips.textContent = "100%";
  }

  const sellerStoreLink = document.getElementById("seller-store-link");
  if (sellerStoreLink) {
    sellerStoreLink.href = sellerShopUrl(product);
  }

  const chatNow = document.getElementById("seller-chat-now");
  if (chatNow) {
    // optional; show only when provided
    if (product.chatNow) {
      chatNow.style.display = "";
      chatNow.href = product.chatNow;
    } else {
      chatNow.style.display = "none";
    }
  }

  const chatResponse = document.getElementById("seller-chat-response");
  if (chatResponse) {
    const value = product.chatResponseRate;
    chatResponse.textContent = value ? String(value) : "Not enough data";
  }

  const tagsWrap = document.getElementById("seller-tags");
  const tagMall = document.getElementById("seller-tag-mall");
  const tagFlagship = document.getElementById("seller-tag-flagship");
  if (tagsWrap && tagMall && tagFlagship) {
    const isMall = Boolean(product.isMall);
    const isFlagship = Boolean(product.isFlagship);
    tagMall.style.display = isMall ? "inline-block" : "none";
    tagFlagship.style.display = isFlagship ? "inline-block" : "none";
    tagsWrap.style.display = isMall || isFlagship ? "flex" : "none";
  }

  const deliveryFee = document.getElementById("delivery-fee");
  if (deliveryFee) {
    if (product.freeShipping) {
      deliveryFee.textContent = "Free";
    } else {
      deliveryFee.textContent = "Rs. 405";
    }
  }

  const deliveryTime = document.querySelector(".delivery-option-item-time");
  if (deliveryTime && product.deliveryTime)
    deliveryTime.textContent = product.deliveryTime;

  const warrantyTitle = document.querySelector(
    ".delivery-option-item-type-no-warranty .delivery-option-item-title",
  );
  if (warrantyTitle && product.warrantyLabel)
    warrantyTitle.textContent = product.warrantyLabel;
}

function fisherYatesShuffle(arr) {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  return shuffled;
}

export function renderRelatedProducts(products, currentId) {
  const existing = document.querySelector(".product-related");
  if (existing) existing.remove();

  const reviews = document.querySelector(".product-info-review");
  const container = document.querySelector(".product-main .container-main");
  if (!container) return;

  const relatedSection = document.createElement("div");
  relatedSection.className = "product-related mx-auto";
  relatedSection.innerHTML =
    '<h3 class="product-related-title">You may also like</h3>';

  const relatedGrid = document.createElement("div");
  relatedGrid.className = "card-rec-wrapper d-flex flex-row flex-wrap";

  const filtered = products.filter(function (p) {
    return p.id !== currentId;
  });
  const shuffled = fisherYatesShuffle(filtered).slice(0, 4);

  shuffled.forEach(function (p) {
    relatedGrid.appendChild(createJfyCard(p));
  });

  relatedSection.appendChild(relatedGrid);
  const qnaSection = document.getElementById("qna-section");
  if (qnaSection && qnaSection.parentNode) {
    qnaSection.parentNode.insertBefore(relatedSection, qnaSection.nextSibling);
  } else if (reviews && reviews.parentNode) {
    reviews.parentNode.insertBefore(relatedSection, reviews.nextSibling);
  } else if (container) {
    container.appendChild(relatedSection);
  }
}

export function renderBreadcrumb(product) {
  const breadcrumbList = document.getElementById("breadcrumb");
  if (!breadcrumbList) return;

  const categories = product.breadcrumbCategory;
  let breadcrumbData = null;

  // Try breadcrumbOverride first
  if (product.breadcrumbOverride && Array.isArray(product.breadcrumbOverride)) {
    breadcrumbData = product.breadcrumbOverride;
  }
  // Try breadcrumbCategories lookup
  else if (product.breadcrumbCategories && categories) {
    const catData = product.breadcrumbCategories[categories];
    if (catData && Array.isArray(catData)) {
      breadcrumbData = catData;
    }
  }

  // If no breadcrumb data exists, use a minimal breadcrumb with just the product title
  if (!breadcrumbData || !Array.isArray(breadcrumbData)) {
    breadcrumbData = [product.title];
  } else {
    // Always append product title to ensure it shows in breadcrumb
    breadcrumbData = breadcrumbData.slice(); // Create a copy to avoid mutating original
    breadcrumbData.push(product.title);
  }

  const html = breadcrumbData
    .map(function (name, index) {
      const isLast = index === breadcrumbData.length - 1;
      if (isLast) {
        return (
          '<li class="breadcrumb-item">' +
          '<span class="breadcrumb-item-text">' +
          '<span class="breadcrumb-item-anchor breadcrumb-item-anchor-last">' +
          name +
          "</span>" +
          "</span>" +
          "</li>"
        );
      }
      return (
        '<li class="breadcrumb-item">' +
        '<span class="breadcrumb-item-text">' +
        '<span class="breadcrumb-item-anchor">' +
        name +
        "</span>" +
        '<div class="breadcrumb-right-arrow"></div>' +
        "</span>" +
        "</li>"
      );
    })
    .join("");

  breadcrumbList.innerHTML = html;
}
