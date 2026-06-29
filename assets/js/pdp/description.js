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

export function renderProductDetails(product) {
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
