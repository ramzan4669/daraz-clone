import {
  STAR_PATH,
  STAR_FILLED_COLOR,
  STAR_EMPTY_COLOR,
  clampRating,
  buildStarsInnerHtml,
  buildSimpleStarsHtml,
  buildSolidStarSvg,
} from "./rating-renderer.js";
import { getCurrentProductId } from "./utils.js";

let currentProduct = null;
let currentPage = 1;
let reviewsPerPage = 20;
let currentFilter = "all";
let currentSort = "relevance";

function toSafeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeReviewRating(rawRating) {
  const rating = clampRating(rawRating);
  // Distribution buckets are integer star levels (1..5)
  return Math.max(1, Math.min(5, Math.round(rating)));
}

function calculateSummaryFromReviews(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      starDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let sum = 0;

  reviews.forEach((review) => {
    const normalized = clampRating(review?.rating);
    const bucket = normalizeReviewRating(review?.rating);
    distribution[String(bucket)] += 1;
    sum += normalized;
    total += 1;
  });

  return {
    averageRating: total ? sum / total : 0,
    totalRatings: total,
    starDistribution: distribution,
  };
}

function getReviewSummary(product) {
  const fromData = product?.reviews?.summary;
  if (fromData && typeof fromData === "object") {
    return {
      averageRating: clampRating(fromData.averageRating),
      totalRatings: Math.max(
        0,
        Math.floor(toSafeNumber(fromData.totalRatings)),
      ),
      starDistribution: Object.fromEntries(
        [1, 2, 3, 4, 5].map((n) => [
          n,
          Math.max(0, Math.floor(toSafeNumber(fromData.starDistribution?.[n]))),
        ]),
      ),
    };
  }
  return calculateSummaryFromReviews(product?.reviews?.reviews || []);
}

function renderStarsForDisplay(rating) {
  return (
    '<div class="i-rate"><div class="container-star" style="width: 166.25px; height: 33.25px;">' +
    buildStarsInnerHtml(rating, "", "review_summary_star") +
    "</div></div>"
  );
}

function renderRatingSummary(summary) {
  const avgRating = document.getElementById("avg-rating");
  const totalRatings = document.getElementById("total-ratings");
  const avgStars = document.getElementById("avg-stars");
  const safeSummary = summary || {};
  const averageRating = clampRating(safeSummary.averageRating);
  const total = Math.max(0, Math.floor(toSafeNumber(safeSummary.totalRatings)));

  if (avgRating) avgRating.textContent = averageRating.toFixed(1);
  if (totalRatings) totalRatings.textContent = total.toLocaleString();
  if (avgStars) avgStars.innerHTML = renderStarsForDisplay(averageRating);
}

function renderStarDistribution(distribution) {
  const container = document.getElementById("star-distribution");
  if (!container) return;
  const safeDistribution = distribution || {};
  const counts = [1, 2, 3, 4, 5].map((n) =>
    Math.max(0, Math.floor(toSafeNumber(safeDistribution[n]))),
  );
  const total = counts.reduce((sum, c) => sum + c, 0);

  const stars = [5, 4, 3, 2, 1].map((value) => ({
    label: value + " star",
    count: counts[value - 1],
    value,
  }));

  let html = "";
  stars.forEach((star) => {
    const percentage = total > 0 ? (star.count / total) * 100 : 0;
    html += `
      <li>
        <div class="container-star progress-title" style="width: 79.8px; height: 15.96px;">
          <div class="i-rate">
            ${[1, 2, 3, 4, 5]
              .map(
                (i) => `
              <div class="rating-star rating-star-readonly">
                <div class="rating-star-item">
                  <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${buildSolidStarSvg(i, star.value)}
                  </svg>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        <span class="progress-wrap">
          <div class="product-review-progress">
            <div class="bar bg"></div>
            <div class="bar fg" style="--fill-percent:${Math.max(0, Math.min(100, percentage)).toFixed(5)};"></div>
          </div>
        </span>
        <span class="percent">${star.count}</span>
      </li>
    `;
  });
  container.innerHTML = html;
}

const LIKE_SVG =
  '<svg class="app-icon-glyph app-icon svg-font like-icon" viewBox="0 0 1024 1024"><path d="M136.533333 849.066667h140.8v-426.666667H136.533333v426.666667z m785.066667-388.266667c0-38.4-34.133333-72.533333-72.533333-72.533333h-226.133334l34.133334-162.133334V213.333333c0-12.8-4.266667-29.866667-17.066667-38.4l-38.4-38.4-230.4 234.666667c-12.8 12.8-21.333333 34.133333-21.333333 51.2v354.133333c0 38.4 34.133333 72.533333 72.533333 72.533334h320c29.866667 0 55.466667-17.066667 64-42.666667l106.666667-251.733333c4.266667-8.533333 4.266667-17.066667 4.266666-25.6v-68.266667h4.266667z"></path></svg>';

const OPER_SVG =
  '<svg class="app-icon-glyph app-icon svg-font oper-icon" viewBox="0 0 1024 1024"><path d="M512 682.666667c46.933333 0 85.333333 38.4 85.333333 85.333333s-38.4 85.333333-85.333333 85.333333-85.333333-38.4-85.333333-85.333333 38.4-85.333333 85.333333-85.333333z m0-85.333334c-46.933333 0-85.333333-38.4-85.333333-85.333333s38.4-85.333333 85.333333-85.333333 85.333333 38.4 85.333333 85.333333-38.4 85.333333-85.333333 85.333333z m0-256c-46.933333 0-85.333333-38.4-85.333333-85.333333s38.4-85.333333 85.333333-85.333333 85.333333 38.4 85.333333 85.333333-38.4 85.333333-85.333333 85.333333z"></path></svg>';

function buildReviewBottomHtml(helpfulCount) {
  return `
        <div class="bottom">
          <span class="left">
            <span class="left-content">
              ${LIKE_SVG}
              <span class="">${helpfulCount}</span>
            </span>
          </span>
          <span class="right">
            <span class="oper-wrap">
              <span>
                ${OPER_SVG}
              </span>
            </span>
          </span>
        </div>`;
}

function renderReviewItem(review) {
  const verifiedImg = review.verified
    ? '<img class="verify-image" width="15" height="16" src="https://img.lazcdn.com/g/tps/tfs/TB1bOqBeb_I8KJjy1XaXXbsxpXa-30-32.png"><span class="verify">Verified Purchase</span>'
    : "";

  let html = `
    <div class="item" data-review-id="${review.id || ""}">
      <div class="top">
        <div class="container-star star-container left" style="width: 83.125px; height: 16.625px;">
          ${buildSimpleStarsHtml(review.rating)}
        </div>
        <span class="title right">${formatDate(review.date)}</span>
      </div>
      <div class="middle">
        <span>${review.reviewerName}</span>
        <span>${verifiedImg}</span>
      </div>
      <div class="item-content">
        <div class="content">${review.content}</div>
  `;

  if (review.images && review.images.length > 0) {
    html += `
      <div class="review-image">
        <div class="review-image-list">
          ${review.images
            .map(
              (img) => `
            <div class="product-common-image review-image-item">
              <div class="lazyload-wrapper">
                <div class="image" style="background-image: url('${img}');" onerror="this.parentElement.parentElement.style.display='none'"></div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  html += `
        ${buildReviewBottomHtml(review.helpfulCount || 0)}
        <div class="dialogs"></div>
      </div>
  `;

  if (review.sellerReply) {
    html += `
      <div class="seller-reply-wrapper">
        <div class="item-content item-content-seller-reply">
          <div class="item-title">
            <img class="seller-reply-badge" src="https://img.lazcdn.com/g/tps/tfs/TB1dNTKpqQoBKNjSZJnXXaw9VXa-24-24.png_80x80q80.png_.webp">
            <span>Seller Response - ${formatDate(review.sellerReply.date)}</span>
          </div>
          <div class="content">${review.sellerReply.content}</div>
          ${buildReviewBottomHtml(0)}
          <div class="dialogs"></div>
        </div>
      </div>
    `;
  }

  html += "</div>";
  return html;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return day + " " + month + " " + year;
}

function filterAndSortReviews(reviews) {
  let filtered = [...reviews];

  if (currentFilter !== "all") {
    const starValue = parseInt(currentFilter, 10);
    filtered = filtered.filter((r) => r.rating === starValue);
  }

  switch (currentSort) {
    case "most-recent":
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "rating-high-low":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "rating-low-high":
      filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      break;
    default:
      break;
  }

  return filtered;
}

function renderReviews(reviews) {
  const container = document.getElementById("reviews-list");
  if (!container) return;

  if (!Array.isArray(reviews) || reviews.length === 0) {
    container.innerHTML = '<div class="reviews-loading">No reviews yet</div>';
    return;
  }

  const processedReviews = filterAndSortReviews(reviews);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const pageReviews = processedReviews.slice(startIndex, endIndex);

  let html = "";
  pageReviews.forEach((review) => {
    html += renderReviewItem(review);
  });

  container.innerHTML = html;

  renderPagination(processedReviews.length);
}

function renderPagination(totalReviews) {
  const container = document.getElementById("pagination-container");
  if (!container) return;

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  if (totalPages <= 1) {
    container.querySelector(".pager-pages").innerHTML = "";
    return;
  }

  const pagesContainer = container.querySelector(".pager-pages");
  let html =
    '<button type="button" class="pager-btn pager-btn-normal pager-btn-medium pager-item prev" ' +
    (currentPage === 1 ? "disabled" : "") +
    ' data-page="' +
    (currentPage - 1) +
    '"><i class="ui-icon ui-icon-arrow-left ui-icon-medium ui-icon-first"></i></button>';

  html += '<div class="pager-list">';
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  pageNumbers.forEach((page) => {
    if (page === "...") {
      html += '<span class="pager-ellipsis">...</span>';
    } else {
      const isCurrent = page === currentPage ? "current" : "";
      html +=
        '<button type="button" class="pager-btn pager-btn-normal pager-btn-medium pager-item ' +
        isCurrent +
        '" data-page="' +
        page +
        '">' +
        page +
        "</button>";
    }
  });
  html += "</div>";

  html +=
    '<button type="button" class="pager-btn pager-btn-normal pager-btn-medium pager-item next" ' +
    (currentPage === totalPages ? "disabled" : "") +
    ' data-page="' +
    (currentPage + 1) +
    '"><i class="ui-icon ui-icon-arrow-right ui-icon-medium ui-icon-last"></i></button>';

  pagesContainer.innerHTML = html;

  pagesContainer.querySelectorAll("[data-page]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goToPage(Number(btn.dataset.page));
    });
  });
}

function getPageNumbers(current, total) {
  const pages = [];
  const delta = 2;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);

    if (current > delta + 2) {
      pages.push("...");
    }

    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - delta - 1) {
      pages.push("...");
    }

    pages.push(total);
  }

  return pages;
}

function goToPage(page) {
  const reviews = currentProduct?.reviews?.reviews;
  if (!Array.isArray(reviews)) return;
  const totalPages = Math.max(
    1,
    Math.ceil(filterAndSortReviews(reviews).length / reviewsPerPage),
  );
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderReviews(currentProduct.reviews.reviews);
  scrollToReviews();
}

function scrollToReviews() {
  const reviewsSection = document.getElementById("reviews-section");
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openDropdown(dropdown) {
  if (!dropdown) return;
  dropdown.classList.remove("closing", "opening");
  dropdown.classList.add("show");
  void dropdown.offsetWidth;
  dropdown.classList.add("opening");
  dropdown.addEventListener("animationend", function onOpenEnd(e) {
    if (e.animationName === "expandInDown") {
      dropdown.classList.remove("opening");
      dropdown.removeEventListener("animationend", onOpenEnd);
    }
  });
}

function closeDropdown(dropdown) {
  if (!dropdown || !dropdown.classList.contains("show")) return;
  dropdown.classList.remove("opening");
  dropdown.classList.add("closing");
  dropdown.addEventListener("animationend", function onCloseEnd(e) {
    if (e.animationName === "expandOutUp") {
      dropdown.classList.remove("show", "closing");
      dropdown.removeEventListener("animationend", onCloseEnd);
    }
  });
}

function setDropdownState(dropdown, show) {
  if (show) openDropdown(dropdown);
  else closeDropdown(dropdown);
}

function wireDropdown(oper, dropdown, other) {
  if (!oper || !dropdown) return;
  oper.addEventListener("click", (e) => {
    e.stopPropagation();
    const show = !dropdown.classList.contains("show");
    setDropdownState(dropdown, show);
    if (show && other) setDropdownState(other, false);
  });
}

function wireOptions(selector, key, setVal, labelId, dropdown) {
  const options = document.querySelectorAll(selector);
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      setVal(option.dataset[key]);
      currentPage = 1;
      options.forEach((opt) => {
        opt.classList.remove("active");
      });
      option.classList.add("active");
      document.getElementById(labelId).textContent = option.textContent;
      if (dropdown) setDropdownState(dropdown, false);
      if (currentProduct && currentProduct.reviews) {
        renderReviews(currentProduct.reviews.reviews);
      }
    });
  });
}

function initDropdowns() {
  const filterOper = document.getElementById("filter-oper");
  const filterDropdown = document.getElementById("filter-dropdown");
  const sortOper = document.getElementById("sort-oper");
  const sortDropdown = document.getElementById("sort-dropdown");

  wireDropdown(filterOper, filterDropdown, sortDropdown);
  wireDropdown(sortOper, sortDropdown, filterDropdown);

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    [
      [filterOper, filterDropdown],
      [sortOper, sortDropdown],
    ].forEach(([oper, dd]) => {
      if (dd && !oper.contains(e.target) && !dd.contains(e.target)) {
        setDropdownState(dd, false);
      }
    });
  });

  wireOptions(
    ".filter-option",
    "filter",
    (v) => (currentFilter = v),
    "filter-current",
    filterDropdown,
  );
  wireOptions(
    ".sort-option",
    "sort",
    (v) => (currentSort = v),
    "sort-current",
    sortDropdown,
  );
}

export function initReviews(products) {
  const productId = getCurrentProductId();
  if (!products || products.length === 0) return;

  currentProduct = products.find((p) => p.id === productId) || products[0];

  if (!currentProduct || !currentProduct.reviews) {
    const reviewsSection =
      document.getElementById("reviews-section") ||
      document.querySelector(".product-info-review");
    if (reviewsSection) reviewsSection.style.display = "none";
    return;
  }

  const reviewItems = currentProduct.reviews.reviews || [];
  const summary = getReviewSummary(currentProduct);
  renderRatingSummary(summary);
  renderStarDistribution(summary.starDistribution || {});
  renderReviews(reviewItems);

  const titleEl = document.getElementById("reviews-title");
  if (titleEl) {
    titleEl.textContent = `Ratings & Reviews of ${currentProduct.title}`;
  }

  initDropdowns();
}
