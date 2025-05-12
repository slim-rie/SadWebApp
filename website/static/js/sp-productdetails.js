document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    if (!productName) {
        document.getElementById('productTitle').textContent = 'Product Not Found';
        return;
    }

    // Fetch product details from API
    let product = null;
    try {
        const response = await fetch(`/api/productdetails?product=${encodeURIComponent(productName)}`);
        if (response.ok) {
            product = await response.json();
    } else {
            document.getElementById('productTitle').textContent = 'Product Not Found';
            return;
        }
    } catch (error) {
        document.getElementById('productTitle').textContent = 'Error loading product';
        return;
    }

    // Render product details
    document.getElementById('productBreadcrumb').textContent = product.name;
    document.getElementById('productTitle').textContent = product.name;

        const mainImage = document.getElementById('mainProductImage');
    mainImage.src = product.image;
    mainImage.alt = product.name;

    // Only one image for now
        const thumbnailGallery = document.getElementById('thumbnailGallery');
        thumbnailGallery.innerHTML = '';
        const mainThumbnail = document.createElement('div');
        mainThumbnail.className = 'thumbnail active';
    mainThumbnail.innerHTML = `<img src="${product.image}" alt="Main Thumbnail" class="thumbnail-img active">`;
        thumbnailGallery.appendChild(mainThumbnail);

    // Default rating and sold count
    const rating = 4.5;
    const sold = 0;

        const ratingContainer = document.getElementById('productRating');
        ratingContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
        if (i <= Math.floor(rating)) {
                star.className = 'fas fa-star';
        } else if (i - 0.5 <= rating) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            ratingContainer.appendChild(star);
        }
    document.getElementById('ratingValue').textContent = rating.toFixed(1);
        document.getElementById('reviewCount').textContent = "100+ reviews";
    document.getElementById('soldCount').textContent = sold + ' sold';

        document.getElementById('productPrice').textContent = '₱ ' + product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('stockInfo').textContent = product.stock + ' pieces available';
        document.getElementById('productDescription').innerHTML = product.description;

    // Specifications table
        const specsTableBody = document.getElementById('specsTableBody');
        specsTableBody.innerHTML = '';
    if (product.model_number) {
            const row = document.createElement('tr');
        row.innerHTML = `<td class="spec-label">Model</td><td class="spec-value">${product.model_number}</td>`;
            specsTableBody.appendChild(row);
    }
    if (product.category_id) {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="spec-label">Category ID</td><td class="spec-value">${product.category_id}</td>`;
        specsTableBody.appendChild(row);
    }

    // Initialize quantity selector
    initializeQuantitySelector(product.stock);
        initializeTabs();

    // Add to cart functionality
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    addToCartBtn.addEventListener('click', function () {
        const productName = document.getElementById('productTitle').textContent;
        const productPrice = parseFloat(document.getElementById('productPrice').textContent.replace('₱', '').replace(',', ''));
        const productImage = document.getElementById('mainProductImage').src;
        const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn && product.product_id) {
            // Logged in: send to backend
            fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.product_id, quantity: productQuantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product added to cart!');
                    window.location.href = '/cart';
                } else {
                    alert('Failed to add to cart: ' + (data.message || 'Unknown error'));
                }
            });
        } else {
            // Guest: use localStorage
            const cartItem = {
                id: productName,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: productQuantity
            };
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItemIndex = cartItems.findIndex(item => item.id === cartItem.id);
            if (existingItemIndex !== -1) {
                cartItems[existingItemIndex].quantity += productQuantity;
            } else {
                cartItems.push(cartItem);
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert('Product added to cart!');
            window.location.href = '/cart';
        }
    });

    if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function () {
            if (productName) {
                window.location.href = `/transaction?product=${encodeURIComponent(productName)}`;
        } else {
                window.location.href = '/transaction';
            }
        });
    }
});

    function initializeQuantitySelector(maxStock) {
        const quantityInput = document.getElementById('quantityInput');
        const minusButton = document.querySelector('.quantity-btn.minus');
        const plusButton = document.querySelector('.quantity-btn.plus');

        quantityInput.value = 1; 
        quantityInput.readOnly = true; 

        minusButton.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value, 10);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusButton.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value, 10);
            if (currentValue < maxStock) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
        button.addEventListener('click', function () {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + 'Tab').classList.add('active');
            });
        });
    }