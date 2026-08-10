'use strict';

const PROMO_CARD_ID = 'nova-promo-card';
const PROMO_CARD_CLASS = 'promo-card';
const PRODUCT_GRID_SELECTOR = '#product-grid';
const PRODUCT_CARD_SELECTOR = '.product-card';

function createPromoCard() {
  const promoCard = document.createElement('article');
  promoCard.id = PROMO_CARD_ID;
  promoCard.classList.add(PROMO_CARD_CLASS);

  const heading = document.createElement('h3');
  heading.textContent = 'Summer Special';

  const description = document.createElement('p');
  description.textContent = 'Get 20% off selected products.';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Explore Offer';

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

function activateExperiment() {
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      insertPromoCard,
      { once: true }
    );

    return;
  }

  insertPromoCard();
}

function deactivateExperiment() {
  document.getElementById(PROMO_CARD_ID)?.remove();
}

activateExperiment();
