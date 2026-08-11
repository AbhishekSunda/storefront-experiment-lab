'use strict';

const PROMO_CARD_ID = 'nova-promo-card';
const PROMO_CARD_CLASS = 'promo-card';
const PROMO_CTA_CLASS = 'promo-cta-button';
const PRODUCT_GRID_SELECTOR = '#product-grid';
const PRODUCT_CARD_SELECTOR = '.product-card';
const PRODUCTS_SECTION_SELECTOR = '.products-section';
const ADD_TO_CART_SELECTOR = '.add-to-cart-button';
const PROMO_CTA_SELECTOR = `.${PROMO_CTA_CLASS}`;
const RERENDER_BUTTON_SELECTOR =
  '#simulate-rerender-button';

let trackedGrid = null;
let experimentObserver = null;
let reconcileScheduled = false;
let isExperimentActive = false;

const VALID_VIEWS = [
  'home',
  'products',
  'cart'
];

const DEFAULT_VIEW = 'products';

function getCurrentView() {
  const searchParams = new URLSearchParams(
    window.location.search
  );
  const currentView = searchParams.get('view');

  if (VALID_VIEWS.includes(currentView)) {
    return currentView;
  }

  return DEFAULT_VIEW;
}

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

function attachGridTracking(productGrid) {
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

function insertPromoCard(productGrid) {
  if (
    !productGrid ||
    document.getElementById(PROMO_CARD_ID)
  ) {
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
  const currentGrid = document.querySelector(
    PRODUCT_GRID_SELECTOR
  );

  if (!currentGrid) {
    return;
  }

  const replacementGrid = currentGrid.cloneNode(true);

  replacementGrid
    .querySelector(`#${PROMO_CARD_ID}`)
    ?.remove();

  currentGrid.replaceWith(replacementGrid);
}

function attachRerenderSimulator() {
  const rerenderButton = document.querySelector(
    RERENDER_BUTTON_SELECTOR
  );

  if (!rerenderButton) {
    return;
  }

  rerenderButton.addEventListener(
    'click',
    simulateProductGridRerender
  );
}

function scheduleReconciliation() {
  if (!isExperimentActive || reconcileScheduled) {
    return;
  }

  reconcileScheduled = true;

  queueMicrotask(() => {
    reconcileScheduled = false;
    reconcileExperiment();
  });
}

function reconcileExperiment() {
  if (!isExperimentActive) {
    return;
  }

  const currentGrid = document.querySelector(
    PRODUCT_GRID_SELECTOR
  );

  if (!currentGrid) {
    detachGridTracking();
    return;
  }

  attachGridTracking(currentGrid);
  insertPromoCard(currentGrid);
}

function startExperimentObserver() {
  if (experimentObserver) {
    return;
  }

  const productsSection = document.querySelector(
    PRODUCTS_SECTION_SELECTOR
  );

  if (!productsSection) {
    return;
  }

  experimentObserver = new MutationObserver(() => {
    scheduleReconciliation();
  });

  experimentObserver.observe(productsSection, {
    childList: true,
    subtree: true
  });
}

function stopExperimentObserver() {
  experimentObserver?.disconnect();
  experimentObserver = null;
}

function initializeExperiment() {
  if (!isExperimentActive) {
    return;
  }

  attachRerenderSimulator();
  reconcileExperiment();
  startExperimentObserver();
}

function activateExperiment() {
  isExperimentActive = true;

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeExperiment,
      { once: true }
    );

    return;
  }

  initializeExperiment();
}

function deactivateExperiment() {
  isExperimentActive = false;

  document.removeEventListener(
    'DOMContentLoaded',
    initializeExperiment
  );

  stopExperimentObserver();
  reconcileScheduled = false;
  document.getElementById(PROMO_CARD_ID)?.remove();
  detachGridTracking();
}

activateExperiment();
