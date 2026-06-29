import { createJfyCard } from "./shared-product-card.js";
import { formatPrice, getCurrentProductId } from "./app.js";
import { buildStarsPdpHtml } from "./rating-renderer.js";

const SKU_CHECK_SVG =
  '<svg class="app-icon-glyph app-icon svg-font" viewBox="0 0 1024 1024"><path d="M1023.6802 0v1023.3604H0.3198L1023.6802 0z" fill="#F57224"></path><path d="M652.072455 910.790756l-173.971268-173.331668 49.249219-49.249219 124.722049 124.722049 263.515303-263.515303 48.609619 49.249219-312.124922 312.124922z" fill="#FFFFFF"></path></svg>';

function thumbnailFor(src) {
  return src
    .replace(/_720x720q80/g, "_80x80q80")
    .replace(/_120x120q80/g, "_80x80q80");
}

function largeFor(src) {
  return src
    .replace(/_80x80q80/g, "_720x720q80")
    .replace(/_120x120q80/g, "_720x720q80");
}

function createDrift(img) {
  return new window.Drift(img, {
    paneContainer: document.getElementById("zoom-pane-container"),
    hoverBoundingBox: true,
  });
}

function initDrift() {
  const img = document.getElementById("gallery-main-img");
  if (window.driftInstance) window.driftInstance.destroy();
  if (img && img.src && window.Drift) {
    window.driftInstance = createDrift(img);
  }
}

function updateArrowDisabledState(track) {
  const slides = Array.from(track.querySelectorAll(".gallery-thumbnail"));
  const activeIndex = slides.findIndex(function (s) {
    return s.classList.contains("gallery-thumbnail-state-active");
  });
  const prevBtn = document.querySelector(".thumb-slider-prev");
  const nextBtn = document.querySelector(".next-slick-next");

  if (prevBtn) prevBtn.classList.toggle("disabled", activeIndex <= 0);
  if (nextBtn)
    nextBtn.classList.toggle("disabled", activeIndex >= slides.length - 1);
}

function createThumbnailClickHandler(mainImg, src, track) {
  return function () {
    const fullSrc = largeFor(src);
    if (mainImg) {
      mainImg.src = fullSrc;
      mainImg.dataset.zoom = fullSrc;
      if (window.driftInstance) {
        window.driftInstance.destroy();
        if (window.Drift) {
          window.driftInstance = createDrift(mainImg);
        }
      }
    }
    track.querySelectorAll(".gallery-thumbnail").forEach(function (t) {
      t.classList.remove("gallery-thumbnail-state-active");
    });
    this.classList.add("gallery-thumbnail-state-active");
    updateArrowDisabledState(track);
  };
}

function buildThumbnailElement(src, index, product, mainImg, track) {
  const slide = document.createElement("div");
  slide.className =
    "thumb-slider-slide thumb-slider-active gallery-thumbnail" +
    (index === 0 ? " gallery-thumbnail-state-active" : "");
  slide.setAttribute("data-index", index);
  slide.setAttribute("style", "outline: none; width: 52px;");

  const wrapper = document.createElement("div");
  wrapper.className = "gallery-image-wrapper";

  const img = document.createElement("img");
  img.className = "product-info-common-image gallery-thumbnail-image";
  img.alt = product.title + ". ";
  img.src = src;
  img.onerror = function () {
    slide.style.display = "none";
  };

  wrapper.appendChild(img);
  slide.appendChild(wrapper);
  slide.addEventListener(
    "click",
    createThumbnailClickHandler(mainImg, src, track),
  );

  return slide;
}

function buildVideoThumbnailElement(product, mainImg, track, index) {
  const slide = document.createElement("div");
  slide.className =
    "thumb-slider-slide thumb-slider-active gallery-thumbnail gallery-thumbnail-video";
  slide.setAttribute("data-index", index);
  slide.setAttribute("style", "outline: none; width: 52px;");

  const wrapper = document.createElement("div");
  wrapper.className = "gallery-image-wrapper";

  const videoThumb =
    product.videoThumbnail || product.thumbnails[0] || product.mainImage;
  const img = document.createElement("img");
  img.className = "product-info-common-image gallery-thumbnail-image";
  img.alt = product.title + " video. ";
  img.src = videoThumb;
  img.onerror = function () {
    slide.style.display = "none";
  };

  const playIcon = document.createElement("span");
  playIcon.className = "gallery-video-play";
  playIcon.innerHTML =
    '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="#fff"/></svg>';

  wrapper.appendChild(img);
  wrapper.appendChild(playIcon);
  slide.appendChild(wrapper);

  slide.addEventListener("click", function () {
    if (mainImg && product.videoUrl) {
      mainImg.src = product.videoUrl;
      mainImg.removeAttribute("data-zoom");
    }
    track.querySelectorAll(".gallery-thumbnail").forEach(function (t) {
      t.classList.remove("gallery-thumbnail-state-active");
    });
    slide.classList.add("gallery-thumbnail-state-active");
  });

  return slide;
}

function updateGallery(product) {
  const mainImg = document.getElementById("gallery-main-img");
  if (mainImg) {
    mainImg.src = product.mainImage;
    mainImg.alt = product.title;
    mainImg.dataset.zoom = largeFor(product.mainImage);
  }

  const track = document.getElementById("gallery-track");
  if (track) {
    track.innerHTML = "";
    let slideIndex = 0;
    if (product.videoUrl) {
      track.appendChild(
        buildVideoThumbnailElement(product, mainImg, track, slideIndex++),
      );
    }
    product.thumbnails.forEach(function (src, i) {
      track.appendChild(
        buildThumbnailElement(src, slideIndex++, product, mainImg, track),
      );
    });

    const prevBtn = document.querySelector(".thumb-slider-prev");
    const nextBtn = document.querySelector(".next-slick-next");
    if (prevBtn) prevBtn.style.display = "block";
    if (nextBtn) nextBtn.style.display = "block";
    updateArrowDisabledState(track);
  }
}

function updateTitle(product) {
  document.title = product.title;
  const titleEl = document.getElementById("product-title");
  if (titleEl) titleEl.textContent = product.title;
}

function updatePdpChrome(product) {
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

function updatePrice(product) {
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

function updateRating(product) {
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

function updateBrand(product) {
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

function updateSKUSelection(product) {
  const skuProps = document.querySelectorAll(".sku-selector .sku-prop");
  if (!skuProps.length) return;

  const colorOptions = Array.isArray(product.colorOptions)
    ? product.colorOptions
    : [];
  const variantOptions = Array.isArray(product.storageOptions)
    ? product.storageOptions
    : [];
  const variantLabel = product.storageLabel || "Storage Capacity";

  const fallbackImage =
    product.mainImage ||
    (Array.isArray(product.images) && product.images[0]) ||
    "";

  function normalizeImageUrl(url) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("//")) return "https:" + trimmed;
    return trimmed;
  }

  const colorProp = skuProps[0];
  function renderColorOptions() {
    if (!colorOptions.length) {
      colorProp.style.display = "none";
      return;
    }

    const selectedOption =
      colorOptions.find(function (option) {
        return option.selected;
      }) || colorOptions[0];

    colorProp.style.display = "";
    colorProp.innerHTML =
      '<div class="product-info-section sku-prop-selection"><h6 class="section-title">' +
      (product.colorLabel || "Color Family") +
      "</h6>" +
      '<div class="section-content"><div class="sku-prop-content-header"><span class="sku-name">' +
      selectedOption.name +
      "</span></div>" +
      '<div class="sku-prop-content sku-prop-content-color">' +
      colorOptions
        .map(function (option, index) {
          const className = option.selected
            ? "sku-variable-img-wrap-selected"
            : "sku-variable-img-wrap";
          const check = option.selected
            ? '<span class="svg-icon svg-icon-name-option-checked sku-variable-img-icon">' +
              SKU_CHECK_SVG +
              "</span>"
            : "";
          const image =
            normalizeImageUrl(option.image) ||
            normalizeImageUrl(fallbackImage);
          return (
            '<span class="' +
            className +
            '" data-index="' +
            index +
            '" title="' +
            option.name +
            '"><div class="product-common-image sku-variable-img"><div class="lazyload-wrapper"><img class="image" alt="' +
            option.name +
            '" src="' +
            image +
            '" onerror="this.onerror=null;this.src=\'' +
            normalizeImageUrl(fallbackImage) +
            "';\"></div></div>" +
            check +
            "</span>"
          );
        })
        .join("") +
      '</div></div></div><span class="product-center-target"></span>';
  }

  renderColorOptions();
  if (colorOptions.length && !colorProp.dataset.colorListener) {
    colorProp.dataset.colorListener = "true";
    colorProp.addEventListener("click", function (e) {
      const wrap = e.target.closest(
        ".sku-variable-img-wrap, .sku-variable-img-wrap-selected"
      );
      if (!wrap) return;
      const index = Number(wrap.getAttribute("data-index"));
      if (isNaN(index) || index < 0 || index >= colorOptions.length) return;
      colorOptions.forEach(function (option, i) {
        option.selected = i === index;
      });
      renderColorOptions();
    });
  }

  const storageProp = skuProps[1];
  function renderStorageOptions() {
    if (!storageProp || !variantOptions.length) {
      if (storageProp) storageProp.style.display = "none";
      return;
    }

    let selectedIndex =
      typeof product.selectedStorageIndex === "number"
        ? product.selectedStorageIndex
        : 0;
    if (selectedIndex < 0 || selectedIndex >= variantOptions.length) {
      selectedIndex = 0;
      product.selectedStorageIndex = 0;
    }

    storageProp.style.display = "";
    storageProp.innerHTML =
      '<div class="product-info-section sku-prop-selection"><h6 class="section-title">' +
      variantLabel +
      "</h6>" +
      '<div class="section-content"><div class="sku-prop-content-header"><span class="sku-name">' +
      variantOptions[selectedIndex] +
      "</span></div>" +
      '<div class="sku-prop-content sku-prop-content-storage">' +
      variantOptions
        .map(function (option, index) {
          const className =
            index === selectedIndex
              ? "sku-variable-name-selected"
              : "sku-variable-name";
          const check =
            index === selectedIndex
              ? '<span class="svg-icon svg-icon-name-option-checked sku-variable-name-icon">' +
                SKU_CHECK_SVG +
                "</span>"
              : "";
          return (
            '<span class="' +
            className +
            '" data-index="' +
            index +
            '" title="' +
            option +
            '"><span class="sku-variable-name-text">' +
            option +
            "</span>" +
            check +
            "</span>"
          );
        })
        .join("") +
      '</div></div></div><span class="product-center-target"></span>';
  }

  renderStorageOptions();
  if (
    storageProp &&
    variantOptions.length &&
    !storageProp.dataset.storageListener
  ) {
    storageProp.dataset.storageListener = "true";
    storageProp.addEventListener("click", function (e) {
      const wrap = e.target.closest(
        ".sku-variable-name, .sku-variable-name-selected"
      );
      if (!wrap) return;
      const index = Number(wrap.getAttribute("data-index"));
      if (isNaN(index) || index < 0 || index >= variantOptions.length) return;
      product.selectedStorageIndex = index;
      renderStorageOptions();
    });
  }
}

function sellerShopUrl(product) {
  return (
    "/shop/" +
    (product.seller || "seller").replace(/\s+/g, "-").toLowerCase() +
    "/"
  );
}

function updateSellerInfo(product) {
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

function updateCartButtons(product) {
  const cartConcern = document.querySelector(".product-cart-concern");
  if (!cartConcern) return;

  const inStock = product.inStock !== false;
  if (inStock) {
    cartConcern.innerHTML =
      '<button class="add-to-cart-buy-now-btn product-button product-button-type-text product-button-theme-primary product-button-size-xl" type="button">' +
      '<span class="product-button-text"><span>Buy Now</span></span>' +
      "</button>" +
      '<button class="add-to-cart-buy-now-btn product-button product-button-type-text product-button-theme-orange product-button-size-xl" type="button">' +
      '<span class="product-button-text"><span>Add to Cart</span></span>' +
      "</button>";
  } else {
    cartConcern.innerHTML =
      '<div class="product-out-of-stock">Out of stock</div>' +
      '<button class="add-to-cart-buy-now-btn product-button product-button-type-text product-button-theme-wishlist product-button-size-xl" type="button">' +
      '<span class="product-button-text"><span><i class="wishlist-heart">♡</i> Add to Wishlist</span></span>' +
      "</button>";
  }
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

function renderRelatedProducts(products, currentId) {
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function splitDescription(description) {
  return (description || "")
    .split(/\r?\n|•/)
    .map(function (line) {
      return line.replace(/\s+/g, " ").trim();
    })
    .filter(function (line) {
      return line.length > 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line);
    })
    .slice(0, 80);
}

function looksLikeKeyValue(text) {
  const specKeywords = [
    "Model",
    "Color",
    "Size",
    "Weight",
    "Material",
    "Dimensions",
    "Bluetooth",
    "Warranty",
    "Compatibility",
    "Package",
    "Features",
    "Battery",
    "Display",
    "Audio",
    "General",
    "Product",
    "Connectivity",
    "Specifications",
    "Details",
  ];
  const hasKeyword = new RegExp(
    "\\b(?:" + specKeywords.join("|") + ")\\b",
    "i",
  ).test(text);
  return hasKeyword && /\s{2,}/.test(text);
}

function parseKeyValuePairs(text) {
  if (!looksLikeKeyValue(text)) return [];

  const sectionHeaders = [
    "Specifications",
    "General",
    "Product Details",
    "Connectivity Features",
    "Display",
    "Audio",
    "Battery",
    "Dimensions",
    "Compatibility",
    "In the Box",
    "Features",
    "Warranty",
    "Package Contents",
    "Product Information",
  ];

  const tokens = text
    .split(/\s{2,}/)
    .map(function (t) {
      return t.trim();
    })
    .filter(Boolean);
  const filtered = tokens.filter(function (t) {
    return sectionHeaders.indexOf(t) === -1;
  });

  const pairs = [];
  const startIndex = filtered.length % 2 === 0 ? 0 : 1;
  for (let i = startIndex; i < filtered.length - 1; i += 2) {
    pairs.push({ key: filtered[i], value: filtered[i + 1] });
  }
  return pairs;
}

function buildDetailImagesHtml(detailImages, productTitle) {
  if (!detailImages.length) return "";
  return (
    '<div class="product-detail__images">' +
    detailImages
      .map(function (src, index) {
        return (
          '<img src="' +
          escapeHtml(src) +
          '" alt="' +
          escapeHtml(productTitle) +
          " detail " +
          (index + 1) +
          '" loading="lazy" decoding="async">'
        );
      })
      .join("") +
    "</div>"
  );
}

function extractKeyValuePairs(detailSections) {
  const pairs = [];
  detailSections.forEach(function (section) {
    const items =
      Array.isArray(section) && Array.isArray(section[1]) ? section[1] : [];
    items.forEach(function (item) {
      pairs.push.apply(pairs, parseKeyValuePairs(item));
    });
  });
  return pairs;
}

function buildDetailHighlightsHtml(detailSections, descriptionItems) {
  const items = [];
  const seenText = new Set();
  const seenTextCompact = new Set();
  const seenKV = new Set();
  const allKVPairs = extractKeyValuePairs(detailSections);
  const tableWillRender = allKVPairs.length >= 2;

  function normalizeText(text) {
    return String(text).replace(/\s+/g, " ").trim().toLowerCase();
  }

  function compactText(text) {
    return String(text).toLowerCase().replace(/\s+/g, "");
  }

  function addText(content) {
    const normalized = normalizeText(content);
    const compact = compactText(content);
    if (!compact) return;
    // Exact duplicate (ignoring whitespace differences)
    if (seenTextCompact.has(compact)) return;
    // Paragraph fully contained in an already-kept paragraph (whitespace-insensitive)
    for (const existing of seenTextCompact) {
      if (existing.includes(compact) && existing.length >= compact.length * 2)
        return;
    }
    seenText.add(normalized);
    seenTextCompact.add(compact);
    items.push({ type: "text", content: content });
  }

  function addKV(key, value) {
    const signature = normalizeText(key) + "::" + normalizeText(value);
    if (seenKV.has(signature)) return;
    seenKV.add(signature);
    items.push({ type: "kv", key: key, value: value });
  }

  descriptionItems.forEach(function (item) {
    addText(item);
  });

  detailSections.forEach(function (section) {
    const itemsArr =
      Array.isArray(section) && Array.isArray(section[1]) ? section[1] : [];
    itemsArr.forEach(function (item) {
      const kvPairs = parseKeyValuePairs(item);
      if (kvPairs.length > 0) {
        // Avoid duplicating specs that will already appear in the Specifications table
        if (!tableWillRender) {
          kvPairs.forEach(function (pair) {
            addKV(pair.key, pair.value);
          });
        }
      } else {
        addText(item);
      }
    });
  });

  if (!items.length) return "";

  return (
    '<div class="product-detail__highlights">' +
    '<article class="product-detail__article">' +
    items
      .map(function (item) {
        if (item.type === "kv") {
          return (
            "<p><strong>" +
            escapeHtml(item.key) +
            ":</strong> " +
            escapeHtml(item.value) +
            "</p>"
          );
        }
        return "<p>" + escapeHtml(item.content) + "</p>";
      })
      .join("") +
    "</article></div>"
  );
}

function buildDetailTableHtml(detailSections) {
  const pairs = extractKeyValuePairs(detailSections);
  if (pairs.length < 2) return "";

  return (
    '<div class="product-detail__table-wrap">' +
    '<h3 class="product-detail__table-title">Specifications:</h3>' +
    '<table class="product-detail__table">' +
    '<tr><td class="product-detail__table-head">Spec Heading</td><td class="product-detail__table-head">Spec Details</td></tr>' +
    pairs
      .map(function (pair) {
        return (
          "<tr><td>" +
          escapeHtml(pair.key) +
          "</td><td>" +
          escapeHtml(pair.value) +
          "</td></tr>"
        );
      })
      .join("") +
    "</table></div>"
  );
}

function initDetailCollapse(detailContent, detailContentInner, toggleBtn) {
  const COLLAPSED_HEIGHT = 720;

  function applyCollapse(needsCollapse) {
    if (needsCollapse) {
      detailContent.classList.add("is-collapsed");
      detailContent.classList.remove("is-expanded");
      detailContent.style.maxHeight = COLLAPSED_HEIGHT + "px";
      toggleBtn.style.display = "inline-block";
    } else {
      detailContent.classList.remove("is-collapsed");
      detailContent.classList.add("is-expanded");
      detailContent.style.maxHeight = "none";
      toggleBtn.style.display = "none";
    }
  }

  function checkCollapse() {
    applyCollapse(detailContentInner.scrollHeight > COLLAPSED_HEIGHT);
  }

  let userInteracted = false;

  // Initial check before images finish loading so the fade appears immediately.
  checkCollapse();

  let collapseTimeout = null;
  const images = detailContentInner.querySelectorAll("img");
  if (images.length === 0) {
    checkCollapse();
  } else {
    let loadedCount = 0;
    const onLoad = function () {
      loadedCount++;
      if (!userInteracted && loadedCount === images.length)
        requestAnimationFrame(checkCollapse);
    };
    images.forEach(function (img) {
      img.complete
        ? loadedCount++
        : (img.addEventListener("load", onLoad),
          img.addEventListener("error", onLoad));
    });
    collapseTimeout = setTimeout(function () {
      if (!userInteracted) checkCollapse();
    }, 3000);
  }

  let expandTimeout = null;
  let expandTransitionHandler = null;

  toggleBtn.addEventListener("click", function () {
    userInteracted = true;
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      collapseTimeout = null;
    }
    const expanded = detailContent.classList.toggle("is-expanded");
    detailContent.classList.toggle("is-collapsed", !expanded);

    // Cancel any pending expand cleanup from a previous click.
    if (expandTimeout) {
      clearTimeout(expandTimeout);
      expandTimeout = null;
    }
    if (expandTransitionHandler) {
      detailContent.removeEventListener(
        "transitionend",
        expandTransitionHandler,
      );
      expandTransitionHandler = null;
    }

    if (expanded) {
      // Expand: animate from the collapsed height to the full content height,
      // then remove max-height so the section can grow if content changes.
      const fullHeight = detailContentInner.scrollHeight;
      detailContent.style.maxHeight = fullHeight + "px";

      expandTransitionHandler = function () {
        if (detailContent.classList.contains("is-expanded")) {
          detailContent.style.maxHeight = "none";
        }
        if (expandTransitionHandler) {
          detailContent.removeEventListener(
            "transitionend",
            expandTransitionHandler,
          );
          expandTransitionHandler = null;
        }
        if (expandTimeout) {
          clearTimeout(expandTimeout);
          expandTimeout = null;
        }
      };
      detailContent.addEventListener("transitionend", expandTransitionHandler);
      // Fallback in case the transitionend event never fires.
      expandTimeout = setTimeout(expandTransitionHandler, 350);
    } else {
      // Collapse: first capture the full height so the browser can interpolate
      // from it down to the collapsed height, then force a reflow and animate.
      const fullHeight = detailContentInner.scrollHeight;
      detailContent.style.maxHeight = fullHeight + "px";
      detailContent.offsetHeight; // force reflow so the transition can start from fullHeight
      detailContent.style.maxHeight = COLLAPSED_HEIGHT + "px";
    }

    toggleBtn.textContent = expanded ? "VIEW LESS" : "VIEW MORE";
  });
}

function renderProductDetails(product) {
  const existing = document.querySelector(".product-detail__section");
  if (existing) existing.remove();

  const container = document.getElementById("container");
  if (!container) return;

  const detailSections = Array.isArray(product.details) ? product.details : [];
  const descriptionItems = splitDescription(product.description);

  const detailImages = Array.isArray(product.detailImages)
    ? product.detailImages.filter(function (src, i, arr) {
        return typeof src === "string" && src.trim() && arr.indexOf(src) === i;
      })
    : [];

  const highlightsHtml = buildDetailHighlightsHtml(
    detailSections,
    descriptionItems,
  );
  const tableHtml = buildDetailTableHtml(detailSections);
  const imagesHtml = buildDetailImagesHtml(detailImages, product.title);

  const hasContent = highlightsHtml || tableHtml || imagesHtml;
  const fallbackHtml =
    '<article class="product-detail__article"><p>No detailed description available.</p></article>';

  const detailSection = document.createElement("section");
  detailSection.className = "product-detail__section";
  detailSection.innerHTML =
    '<h2 class="product-detail__title">Product details of ' +
    escapeHtml(product.title) +
    "</h2>" +
    '<div class="product-detail__body">' +
    '<div class="product-detail__content">' +
    '<div class="product-detail__content-inner">' +
    (hasContent
      ? highlightsHtml + tableHtml + imagesHtml
      : fallbackHtml) +
    '</div><div class="product-detail__fade"></div></div>' +
    '<div class="product-detail__actions">' +
    '<button class="product-detail__view-more" type="button">VIEW MORE</button>' +
    "</div></div>";

  const reviewsSection = document.getElementById("reviews-section");
  if (reviewsSection && reviewsSection.parentNode) {
    reviewsSection.parentNode.insertBefore(detailSection, reviewsSection);
  } else {
    container.parentNode.insertBefore(detailSection, container.nextSibling);
  }

  const detailContent = detailSection.querySelector(".product-detail__content");
  const detailContentInner = detailSection.querySelector(
    ".product-detail__content-inner",
  );
  const toggleBtn = detailSection.querySelector(".product-detail__view-more");

  if (detailContent && detailContentInner && toggleBtn) {
    initDetailCollapse(detailContent, detailContentInner, toggleBtn);
  }
}

function renderBreadcrumb(product) {
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

function initQuantityControls() {
  const down = document.getElementById("qty-down");
  const up = document.getElementById("qty-up");
  const input = document.getElementById("qty-input");
  const hidden = document.querySelector('input[name="buyParams"]');
  if (!input) return;

  const min = Number(input.min) || 1;
  const max = Number(input.max) || 99;

  function updateValue(newVal) {
    let val = Math.max(min, Math.min(max, newVal));
    input.value = String(val);
    if (hidden) {
      try {
        const data = JSON.parse(hidden.value);
        if (data.items && data.items[0]) {
          data.items[0].quantity = val;
          hidden.value = JSON.stringify(data);
        }
      } catch (_) {
        // ignore malformed JSON
      }
    }
  }

  if (down) {
    down.addEventListener("click", function (e) {
      e.preventDefault();
      updateValue(Number(input.value || min) - 1);
    });
  }

  if (up) {
    up.addEventListener("click", function (e) {
      e.preventDefault();
      updateValue(Number(input.value || min) + 1);
    });
  }

  input.addEventListener("change", function () {
    updateValue(Number(input.value || min));
  });

  input.addEventListener("input", function () {
    updateValue(Number(input.value || min));
  });
}

export function injectProductPageData(products, breadcrumbCategories) {
  const productId = getCurrentProductId();

  let product;
  if (productId) {
    product = products.find(function (p) {
      return p.id === productId;
    });
  }
  if (!product) product = products[0];
  if (!product) return;

  product.breadcrumbCategories = breadcrumbCategories;

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
