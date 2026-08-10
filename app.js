'use strict';

// Storefront and experiment behaviour will be added task by task.

function createPromoCard(){
    const promoCard = document.querySelector('[wingify-promo-card]');
    if(promoCard)return promoCard;


    
    const newCard = document.createElement('article');
    newCard.setAttribute('id', "nova-promo-card");
    newCard.classList.add('promo-card', 'product-card');

    const header = document.createElement('h3');
    header.textContent = "Summer Special";

    const p = document.createElement('p');
    p.textContent = "Get 20% off selected products."

    const button = document.createElement('button');

    button.textContent = "Explore Offer";
    button.setAttribute('type', 'button');
    button.addEventListener('click', ()=>{
        console.log("promotional button clicked!");
    })

    newCard.append(header, p, button);

    return newCard;

}

function insertElement(){
    const activePromoCard = document.querySelector('#nova-promo-card');
    if(activePromoCard)return;

    const newPromoCard = createPromoCard();

    const grid = document.querySelector('#product-grid');
    if(!grid)return;
    const secondProductCard = grid.querySelector('[data-product-id="product-2"]');
    if(!secondProductCard)return;
    secondProductCard.after(newPromoCard);


}

function activateExperiment(){
    const productGrid = document.querySelector('#product-grid');
    if(!productGrid){
        document.addEventListener('DOMContentLoaded', insertElement, {once:true});
        return;
    }

    insertElement();
}

function deactivateExperiment(){
    const activePromoCard = document.querySelector('#nova-promo-card');
    if(activePromoCard)activePromoCard.remove();
}

activateExperiment();