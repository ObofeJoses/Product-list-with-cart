let products = [];
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartContent = document.getElementById('cart-content');
const cartItemsContainer = document.getElementById('cart-items');
const orderTotalEl = document.getElementById('order-total');
const confirmOrderBtn = document.getElementById('confirm-order-btn');

// Modal Elements
const modalBackdrop = document.getElementById('modal-backdrop');
const modalItemsContainer = document.getElementById('modal-items');
const modalOrderTotal = document.getElementById('modal-order-total');
const startNewOrderBtn = document.getElementById('start-new-order-btn');

// Fetch Products from data.json
async function fetchProducts() {
  try {
    const response = await fetch('./data.json');
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error('Error fetching data.json:', error);
  }
}

// Render Product Grid
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
            <source media="(min-width: 768px)" srcset="${product.image.tablet}">
            <img src="${product.image.mobile}" alt="${product.name}" class="product-image">
          </picture>

          ${
            isSelected
              ? `
            <div class="quantity-controls">
              <button class="btn-qty btn-decrement" data-index="${index}" aria-label="Decrease quantity">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0z"/></svg>
              </button>
              <span class="qty-count">${quantity}</span>
              <button class="btn-qty btn-increment" data-index="${index}" aria-label="Increase quantity">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25z"/></svg>
              </button>
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

  attachProductEventListeners();
}

// Update Cart Sidebar & State
function updateCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalCount;
  orderTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartContent.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    cartContent.classList.remove('hidden');

    cartItemsContainer.innerHTML = cart.map(item => `
      <li class="cart-item">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-item-numbers">
            <span class="cart-item-qty">${item.quantity}x</span>
            <span class="cart-item-unit-price">@ $${item.price.toFixed(2)}</span>
            <span class="cart-item-total-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button class="btn-remove-item" data-name="${item.name}" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1z"/></svg>
        </button>
      </li>
    `).join('');

    attachCartEventListeners();
  }
}

// Event Listeners: Product Grid
function attachProductEventListeners() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.currentTarget.dataset.index;
      cart.push({ ...products[idx], quantity: 1 });
      renderProducts();
      updateCart();
    };
  });

  document.querySelectorAll('.btn-increment').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.currentTarget.dataset.index;
      const cartItem = cart.find(item => item.name === products[idx].name);
      if (cartItem) cartItem.quantity++;
      renderProducts();
      updateCart();
    };
  });

  document.querySelectorAll('.btn-decrement').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.currentTarget.dataset.index;
      const itemIdx = cart.findIndex(item => item.name === products[idx].name);
      if (itemIdx > -1) {
        if (cart[itemIdx].quantity > 1) {
          cart[itemIdx].quantity--;
        } else {
          cart.splice(itemIdx, 1);
        }
      }
      renderProducts();
      updateCart();
    };
  });
}

// Event Listeners: Cart Items
function attachCartEventListeners() {
  document.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.onclick = (e) => {
      const name = e.currentTarget.dataset.name;
      cart = cart.filter(item => item.name !== name);
      renderProducts();
      updateCart();
    };
  });
}

// Modal Interaction
confirmOrderBtn.addEventListener('click', () => {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  modalItemsContainer.innerHTML = cart.map(item => `
    <li class="modal-item">
      <div class="modal-item-info">
        <img src="${item.image.thumbnail}" alt="${item.name}" class="modal-item-thumb">
        <div>
          <h4>${item.name}</h4>
          <div class="cart-item-numbers">
            <span class="cart-item-qty">${item.quantity}x</span>
            <span class="cart-item-unit-price">@ $${item.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <strong class="modal-item-total">$${(item.price * item.quantity).toFixed(2)}</strong>
    </li>
  `).join('');

  modalOrderTotal.textContent = `$${totalPrice.toFixed(2)}`;
  modalBackdrop.classList.remove('hidden');
});

startNewOrderBtn.addEventListener('click', () => {
  cart = [];
  modalBackdrop.classList.add('hidden');
  renderProducts();
  updateCart();
});

// Initialise Application
fetchProducts();