let products = [];
let cart = [];

const productGrid = document.getElementById('product-grid');

async function fetchProducts() {
  try {
    const response = await fetch('./data.json');
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error('Error fetching data.json:', error);
  }
}

function renderProducts() {
  productGrid.innerHTML = products.map((product, index) => {
    const cartItem = cart.find(item => item.name === product.name);
    const quantity = cartItem ? cartItem.quantity : 0;
    const isSelected = quantity > 0;

    return `
      <div class="product-card ${isSelected ? 'selected' : ''}">
        <div class="product-image-container">
          <picture>
            <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
            <source media="(min-width: 600px)" srcset="${product.image.tablet}">
            <img src="${product.image.mobile}" alt="${product.name}" class="product-image">
          </picture>

          ${
            isSelected
              ? `
            <div class="quantity-controls">
              <button class="btn-qty btn-decrement" data-index="${index}">-</button>
              <span class="qty-count">${quantity}</span>
              <button class="btn-qty btn-increment" data-index="${index}">+</button>
            </div>
            `
              : `
            <button class="add-to-cart-btn" data-index="${index}">
              <img src="./assets/images/icon-add-to-cart.svg" alt="">
              Add to Cart
            </button>
            `
          }
        </div>

        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <span class="product-price">$${product.price.toFixed(2)}</span>
      </div>
    `;
  }).join('');
}

fetchProducts();