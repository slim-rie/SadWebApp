document.addEventListener('DOMContentLoaded', function () {
    const cartContent = document.getElementById('cartContent');

    const sampleProducts = [
        {
            id: 1,
            name: "SHUNFA SF-5550 Single needle highspeed machine",
            price: 14599,
            image: "/static/pictures/SHUNFA SF-5550 Single needle highspeed machine.png",
            quantity: 1
        },
        {
            id: 2,
            name: "Singer Sewing Machine",
            price: 15799,
            image: "/static/pictures/singer-machine.jpg",
            quantity: 1
        },
        {
            id: 3,
            name: "Janome Sewing Machine",
            price: 10999,
            image: "/static/pictures/janome-machine.jpg",
            quantity: 1
        },
        {
            id: 4,
            name: "Juki Sewing Machine",
            price: 19999,
            image: "/static/pictures/juki-machine.jpg",
            quantity: 1
        }
    ];

    if (!localStorage.getItem('cartItems') || JSON.parse(localStorage.getItem('cartItems')).length === 0) {
        localStorage.setItem('cartItems', JSON.stringify(sampleProducts));
    }

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems.forEach(item => {
        if (item.selected === undefined) {
            item.selected = true;
        }
    });

    function updateCartUI(cartItems) {
        if (cartItems.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="sewingmachines.html" class="continue-shopping">Continue Shopping</a>
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
                        <div class="cart-item" data-id="${item.id}">
                            <input type="checkbox" class="select-item" data-id="${item.id}" ${item.selected ? 'checked' : ''}>
                            <div class="product-info">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="product-details">
                                    <h4>${item.name}</h4>
                                </div>
                            </div>
                            <div class="item-price">₱${item.price.toLocaleString()}</div>
                            <div class="item-quantity">
                                <div class="quantity-selector">
                                    <button class="quantity-btn decrease">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
                                    <button class="quantity-btn increase">+</button>
                                </div>
                            </div>
                            <div class="item-total">₱${(item.price * item.quantity).toLocaleString()}</div>
                            <div class="remove-item">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="total-row">
                        <div class="select-actions">
                            <label>
                                <input type="checkbox" id="selectAllBottom" ${cartItems.every(item => item.selected) ? 'checked' : ''}>
                                <span>Select All</span>
                            </label>
                            <button class="delete-selected" id="deleteSelectedBtn">Delete</button>
                        </div>
                        <div class="total-text">
                            Total (${selectedCount} Item${selectedCount !== 1 ? 's' : ''}): ₱${selectedTotal.toLocaleString()}
                        </div>
                    </div>
                    <button class="checkout-btn" id="proceedToCheckoutBtn">Proceed to Checkout</button>
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

        proceedToCheckoutBtn.addEventListener('click', function () {
            const selectedItems = cartItems.filter(item => item.selected);

            if (selectedItems.length === 0) {
                alert('Please select at least one item to proceed to checkout.');
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
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartUI(cartItems);
    }

    updateCartUI(cartItems);
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

    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html'; 
    });
});