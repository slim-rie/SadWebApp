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

    if (isLoggedIn) {
        // Fetch cart items from backend
        fetch('/api/cart')
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    cartItems = data.items.map(item => ({
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
                cartItems = [];
                renderCart(cartItems);
            });
    } else {
        cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        renderCart(cartItems);
    }

    function updateCartUI(cartItems) {
        if (cartItems.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="/sewingmachines" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
        } else {
            const selectedItems = cartItems.filter(item => item.selected);
            const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const selectedCount = selectedItems.length;

            cartContent.innerHTML = `
                <h1 class="cart-title">Shopping Cart</h1>
                <div class="cart-items">
                    <div class="cart-header">
                        <div class="header-select">
                            <input type="checkbox" id="selectAll" ${cartItems.every(item => item.selected) ? 'checked' : ''}>
                        </div>
                        <div>Product</div>
                        <div>Unit Price</div>
                        <div>Quantity</div>
                        <div>Total Price</div>
                        <div>Actions</div>
                    </div>
                    ${cartItems.map(item => `
                        <div class="cart-item">
                            <div class="item-select">
                                <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''} data-id="${item.id}">
                            </div>
                            <div class="item-info">
                                <img src="${item.image}" alt="${item.name}" class="item-image">
                                <div class="item-details">
                                    <h3>${item.name}</h3>
                                </div>
                            </div>
                            <div class="item-price">₱${item.price.toFixed(2)}</div>
                            <div class="item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                            <div class="item-total">₱${(item.price * item.quantity).toFixed(2)}</div>
                            <div class="item-actions">
                                <button class="remove-btn" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Selected Items (${selectedCount}):</span>
                        <span>₱${selectedTotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping Fee:</span>
                        <span>₱0.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>₱${selectedTotal.toFixed(2)}</span>
                    </div>
                    <button class="checkout-btn" ${selectedCount === 0 ? 'disabled' : ''}>
                        Proceed to Checkout
                    </button>
                </div>
            `;

            setupCartActions();
        }
    }

    function setupCartActions() {
        const decreaseButtons = document.querySelectorAll('.decrease');
        const increaseButtons = document.querySelectorAll('.increase');
        const removeButtons = document.querySelectorAll('.remove-item');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const selectItems = document.querySelectorAll('.select-item');
        const selectAll = document.getElementById('selectAll');
        const selectAllBottom = document.getElementById('selectAllBottom');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');

        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const item = this.closest('.cart-item');
                const id = parseInt(item.dataset.id);
                const quantityInput = item.querySelector('.quantity-input');
                if (quantityInput.value > 1) {
                    quantityInput.value--;
                    updateItemQuantity(id, parseInt(quantityInput.value));
                }
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const item = this.closest('.cart-item');
                const id = parseInt(item.dataset.id);
                const quantityInput = item.querySelector('.quantity-input');
                if (quantityInput.value < 99) {
                    quantityInput.value++;
                    updateItemQuantity(id, parseInt(quantityInput.value));
                }
            });
        });

        quantityInputs.forEach(input => {
            input.addEventListener('change', function () {
                const item = this.closest('.cart-item');
                const id = parseInt(item.dataset.id);
                let value = parseInt(this.value);

                if (isNaN(value) || value < 1) {
                    value = 1;
                    this.value = 1;
                }
                if (value > 99) {
                    value = 99;
                    this.value = 99;
                }

                updateItemQuantity(id, value);
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const item = this.closest('.cart-item');
                const id = parseInt(item.dataset.id);

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
                    
                    const allSelected = cartItems.every(item => item.selected);
                    selectAll.checked = allSelected;
                    selectAllBottom.checked = allSelected;
                    
                    updateCartUI(cartItems);
                }
            });
        });

        selectAll.addEventListener('change', function () {
            const isChecked = this.checked;
            
            cartItems.forEach(item => item.selected = isChecked);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            selectItems.forEach(checkbox => checkbox.checked = isChecked);
            selectAllBottom.checked = isChecked;
            
            updateCartUI(cartItems);
        });

        selectAllBottom.addEventListener('change', function () {
            const isChecked = this.checked;
            
            cartItems.forEach(item => item.selected = isChecked);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            selectItems.forEach(checkbox => checkbox.checked = isChecked);
            selectAll.checked = isChecked;
            
            updateCartUI(cartItems);
        });

        deleteSelectedBtn.addEventListener('click', function () {
            const selectedItemIds = cartItems.filter(item => item.selected).map(item => item.id);
            
            if (selectedItemIds.length === 0) {
                alert('Please select at least one item to delete.');
                return;
            }
            
            if (confirm(`Are you sure you want to delete ${selectedItemIds.length} selected item(s)?`)) {
                cartItems = cartItems.filter(item => !item.selected);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartUI(cartItems);
            }
        });

        proceedToCheckoutBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedItems = cartItems.filter(item => item.selected);

            if (selectedItems.length === 0) {
                alert('Please select at least one item to proceed to checkout.');
                return;
            }

            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                // Show login modal
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'block';
                }
                return;
            }

            localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
            window.location.href = '/transaction';
        });
    }

    function updateItemQuantity(id, quantity) {
        const itemIndex = cartItems.findIndex(item => item.id === id);

        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity = quantity;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartUI(cartItems);
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

    usernameDisplay.textContent = isLoggedIn ? username : 'Guest';

    userIcon.addEventListener('click', function (event) {
        event.stopPropagation(); 
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', function () {
        dropdownMenu.style.display = 'none';
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = '/'; 
        });
    }

    document.getElementById('loginBtn').addEventListener('click', function() {
        window.location.href = '/sign-up';
    });
});