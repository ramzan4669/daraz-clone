export const STAR_PATH =
  'M9 14.5805L13.2069 17.2685C13.8201 17.6603 14.6009 17.1155 14.4449 16.4047L13.3152 11.2589L17.1344 7.75247C17.6568 7.27284 17.3621 6.40099 16.6558 6.33678L11.6669 5.88326L9.7586 1.1132C9.48464 0.428413 8.51536 0.428414 8.2414 1.1132L6.33305 5.88326L1.34422 6.33678C0.637946 6.40099 0.343204 7.27284 0.865624 7.75247L4.68484 11.2589L3.55511 16.4047C3.39907 17.1155 4.17991 17.6603 4.79308 17.2685L9 14.5805Z';

export const STAR_FILLED_COLOR = 'rgb(255, 200, 60)';
export const STAR_EMPTY_COLOR = 'rgb(230, 232, 234)';

export function clampRating(rating) {
  return Math.max(0, Math.min(5, Number(rating) || 0));
}

export function buildStarSvg(starIndex, rating, prefix) {
  const r = clampRating(rating);
  const fullGold = starIndex <= Math.floor(r);
  const isPartial = starIndex === Math.ceil(r) && r % 1 !== 0;
  const fillPercentage = isPartial ? Math.floor((r % 1) * 100) : 100;

  const grayPath =
    '<path fill-rule="evenodd" clip-rule="evenodd" d="' +
    STAR_PATH + '" style="fill: ' + STAR_EMPTY_COLOR + ';"></path>';

  let svgInner = '';
  if (fullGold) {
    svgInner = grayPath +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="' + STAR_PATH +
      '" style="fill: ' + STAR_FILLED_COLOR + ';"></path>';
  } else if (isPartial) {
    const maskId = prefix + '_' + starIndex + '_' + fillPercentage +
      '_' + Math.random().toString(36).slice(2, 8);
    svgInner =
      '<defs><mask id="' + maskId + '">' +
      '<rect x="0" y="0" width="100%" height="100%" fill="white"></rect>' +
      '<rect x="' + fillPercentage + '%" y="0" width="100%" height="100%" fill="black"></rect>' +
      '</mask></defs>' + grayPath +
      '<path mask="url(#' + maskId + ')" fill-rule="evenodd" clip-rule="evenodd" d="' +
      STAR_PATH + '" style="fill: ' + STAR_FILLED_COLOR + ';"></path>';
  } else {
    svgInner = grayPath;
  }

  return '<svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    svgInner + '</svg>';
}

export function buildStarsInnerHtml(rating, extraStarClass, prefix) {
  let inner = '';
  const starClass = 'rating-star rating-star-readonly' + (extraStarClass ? ' ' + extraStarClass : '');
  for (let i = 1; i <= 5; i++) {
    inner +=
      '<div class="' + starClass + '">' +
      '<div class="rating-star-item">' +
      buildStarSvg(i, rating, prefix || 'star') +
      '</div></div>';
  }
  return inner;
}

export function buildSimpleStarsHtml(rating) {
  let html = '<div class="i-rate">';
  const r = clampRating(rating);
  for (let i = 1; i <= 5; i++) {
    html +=
      '<div class="rating-star rating-star-readonly">' +
      '<div class="rating-star-item">' +
      buildStarSvg(i, r, 'simple_star') +
      '</div></div>';
  }
  html += '</div>';
  return html;
}

export function buildSolidStarSvg(starIndex, targetValue) {
  return '<path fill-rule="evenodd" clip-rule="evenodd" d="' + STAR_PATH +
    '" style="fill: ' + (starIndex <= targetValue ? STAR_FILLED_COLOR : STAR_EMPTY_COLOR) + ';"></path>';
}

export function buildStarsPdpHtml(rating) {
  if (rating == null || rating === '') return '';

  return (
    '<div class="i-rate rating-product-header">' +
    '<div class="container-star container-star-product-header">' +
    buildStarsInnerHtml(rating, 'product-header-star', 'product_star_mask') +
    '</div></div>'
  );
}
