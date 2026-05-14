import { formatPrice } from "./app.js";

export function createJfyCard(product, isFlashSale) {
  const hasDiscount = product.discount && product.discount !== "0";

  let priceSectionHtml = "";

  if (isFlashSale && hasDiscount) {
    const discountBadge =
      '<span class="item-discount">-' + product.discount + "</span>";
    priceSectionHtml =
      '<div class="home-price d-flex flex-column">' +
      '<div class="home-price-first-line">' +
      '<span class="currency">' +
      product.currency +
      "</span>" +
      '<span class="price">' +
      formatPrice(product.price) +
      "</span>" +
      "</div>" +
      '<div class="fs-card-origin-price">' +
      '<div class="fs-origin-price">' +
      '<span class="currency">' +
      product.currency +
      "</span>" +
      '<span class="price">' +
      formatPrice(product.originalPrice) +
      "</span>" +
      "</div>" +
      discountBadge +
      "</div>" +
      "</div>";
  } else {
    const discount = hasDiscount
      ? '<span class="home-discount"> -' + product.discount + "</span>"
      : "";

    let ratingHtml = "";
    if (product.rating) {
      const ratingWidth = Math.round((product.rating / 5) * 100);
      ratingHtml =
        '<div class="d-flex flex-row align-items-end">' +
        '<div class="card-rec-ratings">' +
        '<div class="card-rec-rating-layer top-layer checked" style="width:' +
        ratingWidth +
        '%;">' +
        '<span class="rating"></span>'.repeat(5) +
        "</div>" +
        '<div class="card-rec-rating-layer">' +
        '<span class="rating"></span>'.repeat(5) +
        "</div>" +
        "</div>" +
        '<div class="card-rec-ratings-comment">(' +
        (Number(product.ratingCount) || "") +
        ")</div>" +
        "</div>";
    }

    priceSectionHtml =
      '<div class="home-price d-flex">' +
      '<div class="home-price-first-line">' +
      '<span class="currency">' +
      product.currency +
      "</span>" +
      '<span class="price">' +
      formatPrice(product.price) +
      "</span>" +
      discount +
      "</div>" +
      "</div>" +
      ratingHtml;
  }

  const productUrl = "product.html?id=" + Number(product.id);
  const a = document.createElement("a");
  a.className = "jfy-item text-decoration-none";
  a.href = productUrl;

  a.innerHTML =
    '<div class="common-img jfy-item-image img-w100p">' +
    '<img src="' +
    product.mainImage +
    '" alt="' +
    product.title +
    '" onerror="this.style.display=\'none\'">' +
    "</div>" +
    '<div class="card-rec-item-desc">' +
    '<div class="card-rec-title two-line-clamp">' +
    product.title +
    "</div>" +
    priceSectionHtml +
    "</div>";

  return a;
}
