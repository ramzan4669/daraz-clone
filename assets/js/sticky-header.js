const header = document.querySelector(".head");
const headTop = document.querySelector(".head-top");
const gapElement = document.querySelector(".gap-div");
const scrollContainer = document.getElementById("recyclerview") || window;

let isCompact = false;
let isGapHidden = false;

function getScrollY() {
  return scrollContainer === window
    ? window.scrollY
    : scrollContainer.scrollTop;
}

function updateHeader() {
  const scrollY = getScrollY();

  // Match Daraz: collapse immediately on any scroll
  if (scrollY > 0) isCompact = true;
  else if (scrollY === 0) isCompact = false;

  if (scrollY > 0) isGapHidden = true;
  else if (scrollY === 0) isGapHidden = false;

  if (gapElement) {
    gapElement.classList.toggle("gap-hidden", isGapHidden);
  }

  if (headTop) {
    headTop.classList.toggle("head-top-hidden", isCompact);
  }

  if (header) {
    header.classList.toggle("head-compact", isCompact);
  }
}

if (header || headTop || gapElement) {
  updateHeader();
  scrollContainer.addEventListener("scroll", updateHeader, { passive: true });
}
