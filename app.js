let cart = [];

const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalAmount = document.getElementById('total-amount');
const confirmOrderBtn = document.getElementById('confirm-order');
const modal = document.getElementById('modal');
const startNewOrderBtn = document.getElementById('start-new-order');

function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container ${cart.some(item => item.id === product.id) ? 'in-cart' : ''}">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="product-image"
                    onerror="this.onerror=null; this.src='assets/images/image-${product.category.toLowerCase()}-desktop.jpg';"
                >
                <div class="product-controls">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart">
                        Add to Cart
                    </button>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">
                            <img src="assets/images/icon-decrement-quantity.svg" alt="Decrease quantity">
                        </button>
                        <span id="quantity-${product.id}">1</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${product.id})">
                            <img src="assets/images/icon-increment-quantity.svg" alt="Increase quantity">
                        </button>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function getQuantity(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    return parseInt(quantityElement.textContent);
}

function setQuantity(productId, quantity) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    quantityElement.textContent = quantity;
    
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
        updateCart();
    }
}

function increaseQuantity(productId) {
    const currentQuantity = getQuantity(productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        setQuantity(productId, currentQuantity + 1);
    }
}

function decreaseQuantity(productId) {
    const currentQuantity = getQuantity(productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && currentQuantity > 1) {
        setQuantity(productId, currentQuantity - 1);
    } else if (cartItem && currentQuantity === 1) {
        removeFromCart(productId);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = getQuantity(productId);
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity
        });
        const productCard = document.querySelector(`[data-product-id="${productId}"] .product-image-container`);
        if (productCard) {
            productCard.classList.add('in-cart');
        }
    }
    
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    const productCard = document.querySelector(`[data-product-id="${productId}"] .product-image-container`);
    if (productCard) {
        productCard.classList.remove('in-cart');
    }
    setQuantity(productId, 1);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span class="cart-item-quantity">${item.quantity}x</span>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <img src="assets/images/icon-remove-item.svg" alt="Remove item">
            </button>
        </div>
    `).join('');
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

function confirmOrder() {
    if (cart.length === 0) {
        alert('Please add items to your cart first');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Order Confirmed</h2>
            <p>We hope you enjoy your food!</p>
            
            <div class="modal-order-details">
                <div class="modal-order-items">
                    ${cart.map(item => `
                        <div class="modal-order-item">
                            <img src="${item.image}" alt="${item.name}"
                                 onerror="this.onerror=null; this.src='assets/images/image-${item.category.toLowerCase()}-desktop.jpg';">
                            <div class="modal-item-details">
                                <div class="modal-item-name">${item.name}</div>
                                <div class="modal-item-quantity">${item.quantity}x @ $${item.price.toFixed(2)}</div>
                            </div>
                            <div class="modal-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-order-total">
                    <span>Order Total</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            
            <button id="start-new-order" onclick="startNewOrder()">Start New Order</button>
        </div>
    `;
}

function startNewOrder() {
    cart = [];
    updateCart();
    modal.style.display = 'none';
    
    products.forEach(product => {
        setQuantity(product.id, 1);
        const productCard = document.querySelector(`[data-product-id="${product.id}"] .product-image-container`);
        if (productCard) {
            productCard.classList.remove('in-cart');
        }
    });
}

confirmOrderBtn.addEventListener('click', confirmOrder);
startNewOrderBtn.addEventListener('click', startNewOrder);

renderProducts(); 