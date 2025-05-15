let cartItems = [];

document.addEventListener('DOMContentLoaded', function () {
    const cartContent = document.getElementById('cartContent');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function renderCart(cartItemsArg) {
        cartItems = cartItemsArg;
        cartItems.forEach(item => {
            if (item.selected === undefined) {
                item.selected = true;
            }
        });
        updateCartUI(cartItems);
    }

    // Always try to fetch from backend first
    fetch('/api/cart')
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                // Not logged in, use localStorage
                return { items: JSON.parse(localStorage.getItem('cartItems')) || [] };
            }
            return response.json();
        })
        .then(data => {
            if (data.items) {
                // Remove out-of-stock items for logged-in users
                cartItems = data.items.filter(item => item.stock_quantity === undefined || item.stock_quantity > 0).map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image_url,
                    quantity: item.quantity,
                    selected: true
                }));
                renderCart(cartItems);
            } else {
                cartItems = [];
                renderCart(cartItems);
            }
        })
        .catch(() => {
            // For guests: fetch latest prices for products in localStorage cart
            let localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (localCart.length > 0) {
                // Collect product names (or IDs if available)
                const productNames = localCart.map(item => encodeURIComponent(item.name));
                fetch(`/api/products?names=${productNames.join(',')}`)
                    .then(res => res.json())
                    .then(products => {
                        // Map product names to latest prices
                        localCart = localCart.map(item => {
                            const latest = products.find(p => p.name === item.name);
                            if (latest) {
                                item.price = latest.price;
                            }
                            return item;
                        });
                        renderCart(localCart);
                    })
                    .catch(() => {
                        renderCart(localCart);
                    });
            } else {
                renderCart(localCart);
            }
        });

    function updateCartUI(cartItems) {
        console.log('updateCartUI called with:', cartItems);
        if (cartItems.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="/sewingmachines" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            return;
        }

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const selectedItems = cartItems.filter(item => item.selected);
        const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        function renderSummary(shippingFee) {
            const grandTotal = subtotal + (selectedItems.length > 0 ? shippingFee : 0);
            cartContent.innerHTML = `
                <div class="cart-items">
                    <div class="cart-header">
                        <div class="header-select"><input type="checkbox" id="selectAll" ${cartItems.every(item => item.selected) ? 'checked' : ''}></div>
                        <div>Product</div>
                        <div>Price</div>
                        <div>Quantity</div>
                        <div>Total</div>
                        <div></div>
                    </div>
                    ${cartItems.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''} data-id="${item.id}">
                            <div class="product-info">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="product-details">
                                    <h4>${item.name}</h4>
                                    <div style="color: #888; font-size: 0.95em;">Item# ${item.product_id || ''}</div>
                                </div>
                            </div>
                            <div class="item-price">₱${item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                            <div class="item-quantity">
                                <div class="quantity-selector">
                                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                </div>
                            </div>
                            <div class="item-total">₱${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                            <span class="remove-item" data-id="${item.id}" title="Remove"><i class="fas fa-trash"></i></span>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="summary-header">Order Summary</div>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₱${subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>₱${selectedItems.length > 0 ? shippingFee.toLocaleString(undefined, {minimumFractionDigits:2}) : '₱0.00'}</span>
                    </div>
                    <div class="total-row">
                        <span>Total</span>
                        <span class="total-text">₱${grandTotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                    </div>
                    <button class="checkout-btn">Checkout</button>
                </div>
            `;
            setupCartActions();
        }

        if (isLoggedIn) {
            fetch('/api/shipping-fee')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        renderSummary(data.shipping_fee);
                    } else {
                        renderSummary(30); // fallback
                    }
                })
                .catch(() => renderSummary(30));
        } else {
            renderSummary(30); // static for guests
        }
    }

    function setupCartActions() {
        const decreaseButtons = document.querySelectorAll('.quantity-btn.minus');
        const increaseButtons = document.querySelectorAll('.quantity-btn.plus');
        const removeLinks = document.querySelectorAll('.remove-item');
        const selectItems = document.querySelectorAll('.item-checkbox');
        const selectAll = document.getElementById('selectAll');
        const checkoutBtn = document.querySelector('.checkout-btn');

        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const itemIndex = cartItems.findIndex(item => item.id === id);
                if (itemIndex !== -1 && cartItems[itemIndex].quantity > 1) {
                    updateItemQuantity(id, cartItems[itemIndex].quantity - 1);
                }
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const itemIndex = cartItems.findIndex(item => item.id === id);
                if (itemIndex !== -1) {
                    updateItemQuantity(id, cartItems[itemIndex].quantity + 1);
                }
            });
        });

        removeLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);
                if (confirm('Are you sure you want to remove this item from your cart?')) {
                    removeCartItem(id);
                }
            });
        });

        selectItems.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const id = parseInt(this.dataset.id);
                const isChecked = this.checked;
                const itemIndex = cartItems.findIndex(item => item.id === id);
                if (itemIndex !== -1) {
                    cartItems[itemIndex].selected = isChecked;
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartUI(cartItems);
                }
            });
        });

        if (selectAll) {
            selectAll.addEventListener('change', function () {
                const isChecked = this.checked;
                cartItems.forEach(item => item.selected = isChecked);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartUI(cartItems);
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                // You can redirect to your checkout page or show a modal
                window.location.href = '/transaction';
            });
        }
    }

    function updateItemQuantity(id, quantity) {
        const itemIndex = cartItems.findIndex(item => item.id === id);

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            // Update quantity in backend
            fetch(`/api/cart/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: quantity > cartItems[itemIndex].quantity ? 'increase' : 'decrease' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Failed to update quantity: ' + (data.message || 'Unknown error'));
                }
            });
        } else {
            if (itemIndex !== -1) {
                cartItems[itemIndex].quantity = quantity;
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartUI(cartItems);
            }
        }
    }

    function removeCartItem(id) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            // Remove from backend
            fetch(`/api/cart/${id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove from UI by re-fetching cart
                    location.reload();
                } else {
                    alert('Failed to remove item from cart: ' + (data.message || 'Unknown error'));
                }
            });
        } else {
            cartItems = cartItems.filter(item => item.id !== id);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartUI(cartItems);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username') || 'Guest';

    if (usernameDisplay) {
        usernameDisplay.textContent = isLoggedIn ? username : 'Guest';
    }

    if (userIcon && dropdownMenu) {
        userIcon.addEventListener('click', function (event) {
            event.stopPropagation(); 
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', function () {
            dropdownMenu.style.display = 'none';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = '/'; 
        });
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = '/sign-up';
        });
    }
});