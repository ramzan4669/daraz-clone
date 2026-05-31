import { getCurrentProductId } from './app.js';

var QNA_ICON_Q =
  '<svg class="icon-font icon-font-svg svg-font qna-icon qna-icon-q" viewBox="0 0 1024 1024">' +
    '<path d="M170.666667 85.333333c-46.933333 0-85.333333 38.4-85.333334 85.333334v768l170.666667-170.666667h597.333333c46.933333 0 85.333333-38.4 85.333334-85.333333V170.666667c0-46.933333-38.4-85.333333-85.333334-85.333334H170.666667z m512 320c0 34.133333-4.266667 64-17.066667 89.6-12.8 25.6-25.6 42.666667-46.933333 59.733334l59.733333 46.933333-34.133333 38.4-76.8-59.733333c-8.533333 4.266667-21.333333 4.266667-34.133334 4.266666-29.866667 0-55.466667-8.533333-76.8-21.333333s-38.4-34.133333-51.2-59.733333c-12.8-29.866667-21.333333-59.733333-21.333333-93.866667v-21.333333c0-34.133333 4.266667-64 17.066667-93.866667 12.8-25.6 29.866667-46.933333 51.2-59.733333s51.2-21.333333 81.066666-21.333334 55.466667 8.533333 76.8 21.333334 38.4 34.133333 51.2 59.733333 21.333333 59.733333 21.333334 93.866667v17.066666z m-64-17.066666c0-38.4-8.533333-72.533333-21.333334-93.866667-17.066667-21.333333-38.4-29.866667-64-29.866667s-46.933333 12.8-64 34.133334c-12.8 21.333333-21.333333 51.2-21.333333 89.6v21.333333c0 38.4 8.533333 68.266667 21.333333 89.6s38.4 34.133333 64 34.133333c29.866667 0 51.2-8.533333 64-29.866666 12.8-21.333333 21.333333-51.2 21.333334-93.866667v-21.333333z" fill="currentColor"></path>' +
  '</svg>';

var QNA_ICON_A =
  '<svg class="icon-font icon-font-svg svg-font qna-icon qna-icon-a" viewBox="0 0 1024 1024">' +
    '<path d="M853.333333 85.333333H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333334v768l170.666667-170.666667h597.333333c46.933333 0 85.333333-38.4 85.333334-85.333333V170.666667c0-46.933333-38.4-85.333333-85.333334-85.333334z m-260.266666 439.466667h-140.8l-29.866667 85.333333H358.4l136.533333-362.666666h55.466667l136.533333 362.666666h-64l-29.866666-85.333333zM469.333333 473.6h106.666667l-51.2-149.333333-55.466667 149.333333z" fill="currentColor"></path>' +
  '</svg>';

function renderLoginTips() {
  return (
    '<div class="qna-login-tips">' +
      '<span>' +
        '<a class="product-link product-link-size-m product-link-theme-blue"><span>Login</span></a>' +
        ' or ' +
        '<a class="product-link product-link-size-m product-link-theme-blue"><span>Register</span></a>' +
        ' to ask questions' +
      '</span>' +
    '</div>'
  );
}

function renderEmptyState() {
  return (
    '<div class="qna-empty">' +
      '<svg class="app-icon-glyph app-icon svg-font qna-empty-icon">' +
        '<use xlink:href="#appicon_questionSymbol"></use>' +
      '</svg>' +
      '<div class="qna-empty-text">There are no questions yet.</div>' +
    '</div>'
  );
}

function renderQuestionItem(item, index) {
  var question = item.question || '';
  var customerName = item.customerName || 'Anonymous';
  var questionTime = item.questionTime || '';
  var answer = item.answer ? item.answer : '';
  var sellerName = item.sellerName || '';
  var answerTime = item.answerTime || '';

  var answerBlock = answer
    ? (
      '<div class="qna-item-group">' +
        QNA_ICON_A +
        '<div class="qna-content">' + answer + '</div>' +
        '<div class="qna-meta">' + sellerName + (answerTime ? ' - ' + answerTime : '') + '</div>' +
      '</div>'
    )
    : (
      '<div class="qna-item-group">' +
        '<div class="qna-meta">No answer yet</div>' +
      '</div>'
    );

  return (
    '<li class="qna-item" data-question-id="' + (item.itemQuestionId || index) + '">' +
      '<div class="qna-item-group">' +
        QNA_ICON_Q +
        '<div class="qna-content">' + question + '</div>' +
        '<div class="qna-meta">' + customerName + (questionTime ? ' - ' + questionTime : '') + '</div>' +
      '</div>' +
      answerBlock +
    '</li>'
  );
}

function renderPopulatedState(items, sellerName, totalItems) {
  var listHtml = items.map(function (item, idx) {
    return renderQuestionItem(item, idx);
  }).join('');

  var sectionTitle = sellerName
    ? 'Other questions answered by ' + sellerName + ' (' + totalItems + ')'
    : '';

  return (
    renderLoginTips() +
    '<div>' +
      (sectionTitle
        ? '<div class="qna-section-title">' + sectionTitle + '</div>'
        : '') +
      '<ul class="qna-list" data-spm="qa">' + listHtml + '</ul>' +
    '</div>'
  );
}

function renderQnA(product) {
  var container = document.getElementById('qna-container');
  if (!container) return;

  var titleEl = document.querySelector('#qna-section .product-info-section-title.outer-title');
  if (!titleEl) return;

  var questions = product && product.questions;
  var items = questions && Array.isArray(questions.items) ? questions.items : [];
  var totalItems = questions && typeof questions.totalItems === 'number' ? questions.totalItems : items.length;

  titleEl.textContent = 'Questions about this product (' + totalItems + ')';

  if (totalItems > 0 && items.length > 0) {
    var firstAnswer = items[0];
    var sellerName = firstAnswer && firstAnswer.sellerName ? firstAnswer.sellerName : (product.seller || '');
    container.innerHTML = renderPopulatedState(items, sellerName, totalItems);
  } else {
    container.innerHTML = renderLoginTips() + renderEmptyState();
  }
}

export function initQnA(products) {
  var productId = getCurrentProductId();
  if (!products || products.length === 0) return;
  var product = products.find(function (p) {
    return p && p.id === productId;
  }) || products[0];
  renderQnA(product);
}
