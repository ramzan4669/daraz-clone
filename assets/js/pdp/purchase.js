const SKU_CHECK_SVG =
  '<svg class="app-icon-glyph app-icon svg-font" viewBox="0 0 1024 1024"><use href="#appicon_checkOrange"></use></svg>';

export function updateSKUSelection(product) {
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

export function updateCartButtons(product) {
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

export function initQuantityControls() {
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
