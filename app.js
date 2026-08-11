'use strict';

const PROMO_CARD_ID = 'nova-promo-card';
const PROMO_CARD_CLASS = 'promo-card';
const PROMO_CTA_CLASS = 'promo-cta-button';
const PRODUCT_GRID_SELECTOR = '#product-grid';
const PRODUCT_CARD_SELECTOR = '.product-card';
const ADD_TO_CART_SELECTOR = '.add-to-cart-button';
const PROMO_CTA_SELECTOR = `.${PROMO_CTA_CLASS}`;

let trackedGrid = null;
let experimentObserver = null;
let reconcileScheduled = false;
let isExperimentActive = false;

function handleGridClick(event) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const grid = event.currentTarget;

  if (!(grid instanceof Element)) {
    return;
  }

  const addToCartButton = event.target.closest(
    ADD_TO_CART_SELECTOR
  );

  if (
    addToCartButton &&
    grid.contains(addToCartButton)
  ) {
    const productCard = addToCartButton.closest(
      PRODUCT_CARD_SELECTOR
    );

    if (!productCard || !grid.contains(productCard)) {
      return;
    }

    console.log(
      `Add to cart: ${productCard.dataset.productId}`
    );

    return;
  }

  const promoButton = event.target.closest(
    PROMO_CTA_SELECTOR
  );

  if (!promoButton || !grid.contains(promoButton)) {
    return;
  }

  const promoCard = promoButton.closest(
    `#${PROMO_CARD_ID}`
  );

  if (!promoCard || !grid.contains(promoCard)) {
    return;
  }

  console.log(`Promo clicked: ${promoCard.id}`);
}

function attachGridTracking() {
  const productGrid = document.querySelector(
    PRODUCT_GRID_SELECTOR
  );

  if (!productGrid || trackedGrid === productGrid) {
    return;
  }

  detachGridTracking();
  productGrid.addEventListener('click', handleGridClick);
  trackedGrid = productGrid;
}

function detachGridTracking() {
  if (!trackedGrid) {
    return;
  }

  trackedGrid.removeEventListener(
    'click',
    handleGridClick
  );
  trackedGrid = null;
}

function createPromoCard() {
  const promoCard = document.createElement('article');
  promoCard.id = PROMO_CARD_ID;
  promoCard.classList.add(PROMO_CARD_CLASS);

  const heading = document.createElement('h3');
  heading.textContent = 'Summer Special';

  const description = document.createElement('p');
  description.textContent =
    'Get 20% off selected products.';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Explore Offer';
  button.classList.add(PROMO_CTA_CLASS);

  promoCard.append(heading, description, button);

  return promoCard;
}

function insertPromoCard() {
  if (document.getElementById(PROMO_CARD_ID)) {
    return;
  }

  const productGrid = document.querySelector(
    PRODUCT_GRID_SELECTOR
  );

  if (!productGrid) {
    return;
  }

  const productCards = productGrid.querySelectorAll(
    PRODUCT_CARD_SELECTOR
  );
  const secondProductCard = productCards[1];

  if (!secondProductCard) {
    return;
  }

  secondProductCard.after(createPromoCard());
}

function simulateProductGridRerender() {
  const productGrid = document.querySelector(PRODUCT_GRID_SELECTOR);
  if (!productGrid) return;

  const replacementGrid = productGrid.cloneNode(true);

  productGrid.replaceWith(replacementGrid);
}

function initializeExperiment() {
  isExperimentActive = true;
  insertPromoCard();
  attachGridTracking();
  queueMicrotask(() => {
    reconcileScheduled = false;
    reconcileExperiment();
  });
}

function activateExperiment() {
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      startExperimentObserver,
      { once: true }
    );

    return;
  }

  startExperimentObserver();
}

function deactivateExperiment() {
  document.removeEventListener(
    'DOMContentLoaded',
    initializeExperiment
  );
  document.getElementById(PROMO_CARD_ID)?.remove();
  detachGridTracking();
  reconcileScheduled = false;
  isExperimentActive = false;

}

function startExperimentObserver() {

  const productSection = document.querySelector('.products-section');
  if (!productSection) return;
  let experimentObserver = new MutationObserver(() => {
    initializeExperiment();
  })

  experimentObserver.observe(productSection, {
    subtree: true,
    childList: true
  });

  initializeExperiment();
}

function stopExperimentObserver() {
  if (experimentObserver) experimentObserver.disconnect();
  deactivateExperiment();
}

function reconcileExperiment() {
  if (reconcileScheduled) {
    return;
  }
  reconcileScheduled = true;
  simulateProductGridRerender();
}


activateExperiment();
