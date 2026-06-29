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

export function initDrift() {
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

export function updateGallery(product) {
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
