document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('product_id');
    if (!productId) {
        // Try to extract from URL path: /product/(
        const match = window.location.pathname.match(/\/product\/(\d+)/);
        if (match) {
            productId = match[1];
        }
    }
    if (!productId) {
        document.getElementById('productTitle').textContent = 'Product Not Found';
        return;
    }
    const productName = urlParams.get('product');

    let apiUrl = '';
    if (productId) {
        apiUrl = `/api/productdetails?product_id=${encodeURIComponent(productId)}`;
    } else if (productName) {
        apiUrl = `/api/productdetails?product=${encodeURIComponent(productName)}`;
    } else {
        document.getElementById('productTitle').textContent = 'Product Not Found';
        return;
    }

    // Fetch product details from API
    let product = null;
    try {
        const response = await fetch(apiUrl);
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
    document.getElementById('productPrice').textContent = '₱ ' + (product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00');
    document.getElementById('stockInfo').textContent = (product.total_stock || 0) + ' pieces available';
    document.getElementById('productDescription').innerHTML = product.description || '';

    // Render Material and Size as before (if present)
    // ... (existing code for material/size) ...

    // Add after fetching product details and rendering the main info
    // --- Dynamic Variant Options ---
    let totalStock = 0;
    let variantStockMap = {};
    if (product.variants && product.variants.length > 0) {
        totalStock = product.variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
        product.variants.forEach(v => {
            variantStockMap[v.variant_id] = v.stock_quantity || 0;
        });
    } else {
        totalStock = product.total_stock || 0;
    }
    const stockInfo = document.getElementById('stockInfo');
    if (stockInfo) stockInfo.textContent = `${totalStock} pieces available`;

    let variantTypeMap = {};
    if (product.variants && product.variants.length > 0) {
        product.variants.forEach(v => {
            if (!variantTypeMap[v.variant_name]) {
                variantTypeMap[v.variant_name] = new Set();
            }
            variantTypeMap[v.variant_name].add(v.variant_value);
        });
        // Enforce order: Color > Size > others (alphabetically)
        const allVariantTypes = Object.keys(variantTypeMap);
        const colorKey = allVariantTypes.find(k => k.toLowerCase().includes('color'));
        const sizeKey = allVariantTypes.find(k => k.toLowerCase().includes('size'));
        let sortedVariantTypes = [];
        if (colorKey) sortedVariantTypes.push(colorKey);
        if (sizeKey) sortedVariantTypes.push(sizeKey);
        allVariantTypes.sort().forEach(k => {
            if (!sortedVariantTypes.includes(k)) sortedVariantTypes.push(k);
        });
        sortedVariantTypes = [...new Set(sortedVariantTypes)];
        const productOptionsDiv = document.querySelector('.product-options');
        if (productOptionsDiv) {
            productOptionsDiv.querySelectorAll('.dynamic-variant-row').forEach(e => e.remove());
            sortedVariantTypes.forEach(variantName => {
                const valueSet = variantTypeMap[variantName];
                const row = document.createElement('div');
                row.className = 'option-row dynamic-variant-row';
                let buttonsHTML = '';
                if (variantName.toLowerCase().includes('color')) {
                    const colorMap = {
                        'black': '#000', 'white': '#fff', 'gray': '#888', 'grey': '#888',
                        'orange': '#f60', 'red': '#f00', 'blue': '#00f', 'green': '#0a0',
                        'yellow': '#ff0', 'pink': '#f6a', 'brown': '#964B00', 'beige': '#F5F5DC',
                        'purple': '#800080', 'violet': '#8F00FF', 'maroon': '#800000', 'navy': '#000080',
                        'teal': '#008080', 'aqua': '#00FFFF', 'lime': '#00FF00', 'olive': '#808000',
                        'gold': '#FFD700', 'silver': '#C0C0C0', 'tan': '#D2B48C', 'peach': '#FFE5B4',
                        'magenta': '#FF00FF', 'cyan': '#00FFFF', 'indigo': '#4B0082', 'other': '#ccc'
                    };
                    buttonsHTML = [...valueSet].map((val, idx) => {
                        const colorKey = val.toLowerCase();
                        const colorHex = colorMap[colorKey] || colorKey || '#ccc';
                        return `<button class="variant-btn color-btn" data-variant-name="${variantName}" data-variant-value="${val}" style="display:inline-flex;align-items:center;padding:0.5em 1.2em 0.5em 0.5em;margin-right:10px;margin-bottom:8px;border:2px solid #ddd;border-radius:6px;font-size:1.1em;font-weight:500;background:#fff;cursor:pointer;"><span class='color-swatch' style='display:inline-block;width:22px;height:22px;border-radius:3px;margin-right:0.5em;background:${colorHex};${colorHex==='#fff'?'border:1px solid #ccc;':''}'></span>${val}</button>`;
                    }).join('');
                } else {
                    buttonsHTML = [...valueSet].map((val, idx) =>
                        `<button class="variant-btn" data-variant-name="${variantName}" data-variant-value="${val}" style="min-width:56px;padding:0.7em 1.5em;border:2px solid #ddd;border-radius:6px;background:#f7f7f7;color:#444;font-size:1.1em;font-weight:500;cursor:pointer;margin-right:10px;margin-bottom:8px;">${val}</button>`
                    ).join('');
                }
                row.innerHTML = `
                    <span class="option-label">${variantName}</span>
                    <div class="option-value">${buttonsHTML}</div>
                `;
                productOptionsDiv.insertBefore(row, productOptionsDiv.querySelector('.quantity-selector-row'));
            });
        }
        // --- Require all variant selections before enabling Add to Cart/Buy Now ---
        let selectedVariants = {};
        function allVariantsSelected() {
            return sortedVariantTypes.every(k => selectedVariants[k]);
        }
        function updateActionButtonsState() {
            const addToCartBtn = document.getElementById('addToCartBtn');
            const buyNowBtn = document.getElementById('buyNowBtn');
            if (allVariantsSelected()) {
                addToCartBtn.removeAttribute('disabled');
                if (buyNowBtn) buyNowBtn.removeAttribute('disabled');
            } else {
                addToCartBtn.setAttribute('disabled', 'disabled');
                if (buyNowBtn) buyNowBtn.setAttribute('disabled', 'disabled');
            }
        }
        let currentVariantStock = totalStock;
        document.querySelectorAll('.variant-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const variantName = btn.getAttribute('data-variant-name');
                btn.parentNode.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                btn.style.border = '2.5px solid #ff6f61';
                btn.parentNode.querySelectorAll('.variant-btn').forEach(b => {
                    if (b !== btn) b.style.border = '2px solid #ddd';
                });
                selectedVariants[variantName] = btn.getAttribute('data-variant-value');
                // Find the matching variant (all types must match)
                let matchingVariant = product.variants.find(v =>
                    sortedVariantTypes.every(k => v.variant_name === k ? v.variant_value === selectedVariants[k] : true)
                );
                // Update stock info and quantity selector
                if (matchingVariant) {
                    stockInfo.textContent = `${matchingVariant.stock_quantity} pieces available`;
                    currentVariantStock = matchingVariant.stock_quantity;
                } else {
                    stockInfo.textContent = `${totalStock} pieces available`;
                    currentVariantStock = totalStock;
                }
                updateActionButtonsState();
                // Update quantity input max
                const quantityInput = document.getElementById('quantityInput');
                if (quantityInput) {
                    if (parseInt(quantityInput.value, 10) > currentVariantStock) {
                        quantityInput.value = currentVariantStock > 0 ? currentVariantStock : 1;
                    }
                }
            });
        });
        updateActionButtonsState();
        // --- Add to Cart and Buy Now: send variant_id and selected values ---
        function getSelectedVariantId() {
            if (!allVariantsSelected()) return null;
            const matchingVariant = product.variants.find(v =>
                sortedVariantTypes.every(k => v.variant_name === k ? v.variant_value === selectedVariants[k] : true)
            );
            return matchingVariant ? matchingVariant.variant_id : null;
        }
        // Add to Cart
        const addToCartBtn = document.getElementById('addToCartBtn');
        addToCartBtn.addEventListener('click', function (e) {
            if (!allVariantsSelected()) {
                e.preventDefault();
                alert('Please select an option for each variant before adding to cart.');
                return false;
            }
            const variant_id = getSelectedVariantId();
            if (!variant_id) {
                e.preventDefault();
                alert('No matching variant found.');
                return false;
            }
            const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn && product.product_id) {
                fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        product_id: product.product_id,
                        quantity: productQuantity,
                        variant_id: variant_id
                    })
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
                    id: product.product_id + '-' + variant_id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images[0],
                    quantity: productQuantity,
                    variant_id: variant_id
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
        // Buy Now
        const buyNowBtn = document.getElementById('buyNowBtn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function (e) {
                if (!allVariantsSelected()) {
                    e.preventDefault();
                    alert('Please select an option for each variant before buying.');
                    return false;
                }
                const variant_id = getSelectedVariantId();
                if (!variant_id) {
                    e.preventDefault();
                    alert('No matching variant found.');
                    return false;
                }
                const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                if (isLoggedIn && product.product_id) {
                    fetch('/api/addresses')
                        .then(res => res.json())
                        .then(data => {
                            if (!data.success || !data.addresses || data.addresses.length === 0) {
                                window.location.href = `/addresses?from=product&product_id=${product.product_id}&product_type=sp${variant_id ? `&variant_id=${variant_id}` : ''}&quantity=${productQuantity}`;
                            } else {
                                fetch('/buy-now', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        product_id: product.product_id,
                                        variant_id: variant_id,
                                        quantity: productQuantity
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        window.location.href = '/transaction?buy_now=1';
                                    } else {
                                        alert('Failed to start buy now: ' + (data.message || 'Unknown error'));
                                    }
                                });
                            }
                        });
                } else {
                    // Guest: use sessionStorage
                    const buyNowItem = {
                        product_id: product.product_id,
                        variant_id: variant_id,
                        quantity: productQuantity
                    };
                    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
                    window.location.href = '/transaction?buy_now=1';
                }
            });
        }
        // --- Fix quantity selector to respect currentVariantStock ---
        function updateQuantitySelector() {
            const quantityInput = document.getElementById('quantityInput');
            const minusButton = document.querySelector('.quantity-btn.minus');
            const plusButton = document.querySelector('.quantity-btn.plus');
            if (!quantityInput || !minusButton || !plusButton) return;
            quantityInput.value = 1;
            quantityInput.readOnly = true;
            minusButton.onclick = function () {
                let currentValue = parseInt(quantityInput.value, 10);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            };
            plusButton.onclick = function () {
                let currentValue = parseInt(quantityInput.value, 10);
                if (currentValue < currentVariantStock) {
                    quantityInput.value = currentVariantStock > 0 ? currentVariantStock : 1;
                }
            };
        }
        updateQuantitySelector();
        document.querySelectorAll('.variant-btn').forEach(btn => {
            btn.addEventListener('click', updateQuantitySelector);
        });
    }

    // Gallery logic for multiple images
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    if (Array.isArray(product.images) && product.images.length > 0) {
        function showImage(idx) {
            mainImage.src = product.images[idx];
            mainImage.alt = product.name;
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === idx);
            });
        }
        thumbnailGallery.innerHTML = '';
        product.images.forEach((imgUrl, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail' + (idx === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${imgUrl}" alt="Thumbnail ${idx+1}" class="thumbnail-img">`;
            thumb.addEventListener('click', function() {
                showImage(idx);
            });
            thumbnailGallery.appendChild(thumb);
        });
        showImage(0);
    } else {
        mainImage.src = product.image || '/static/pictures/default.jpg';
        mainImage.alt = product.name;
        thumbnailGallery.innerHTML = '';
    }

    // Ratings and reviews from API
    const rating = product.rating || 0;
    const reviewCount = product.review_count || 0;
    const sold = product.sold || 0;
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
    document.getElementById('reviewCount').textContent = `${reviewCount} review${reviewCount === 1 ? '' : 's'}`;
    document.getElementById('soldCount').textContent = `${sold} sold`;

    // Specifications table (dynamic)
    const specsTableBody = document.getElementById('specsTableBody');
    specsTableBody.innerHTML = '';
    if (Array.isArray(product.specifications)) {
        product.specifications.forEach(spec => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class='spec-label'>${spec.name}</td><td class='spec-value'>${spec.value}</td>`;
            specsTableBody.appendChild(row);
        });
    }

    // Initialize quantity selector
    initializeQuantitySelector(product.total_stock);
    initializeTabs();

    // --- Render Related Products (EXACTLY like sm-productdetails.html) ---
    const relatedGrid = document.getElementById('relatedProductsGrid');
    relatedGrid.innerHTML = '';
    fetch(`/api/related-products?product_id=${product.product_id}`)
        .then(res => res.json())
        .then(relatedProducts => {
            relatedGrid.innerHTML = '';
            if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
                const seen = new Set();
                relatedProducts.forEach(prod => {
                    if (seen.has(prod.product_id)) return;
                    seen.add(prod.product_id);
                    const card = document.createElement('div');
                    card.className = 'related-product-card';
                    card.style.width = '260px';
                    card.innerHTML = `
                        <div class="related-product-img-wrapper">
                            <img src="${prod.image && prod.image !== '' ? prod.image : '/static/pictures/no-image.png'}" alt="${prod.name}" class="related-product-img">
                        </div>
                        <div class="related-product-title">${prod.name}</div>
                        <div class="related-product-price" style="text-align: left;">₱ ${prod.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div class="related-product-rating-container" style="box-sizing: border-box; width: 100%; padding: 0 0 10px 0;">
                            <div class="related-product-rating-row" style="display: flex; align-items: center; gap: 4px; margin-top: 4px; white-space: nowrap; width: 100%; justify-content: flex-start;">
                                <span class="stars" style="color: #ffc107; font-size: 13px; display: flex; align-items: center;">
                                    ${(() => {
                                        let stars = '';
                                        const rating = prod.rating || 0;
                                        for (let i = 1; i <= 5; i++) {
                                            if (i <= Math.floor(rating)) {
                                                stars += '<i class=\"fas fa-star\"></i>';
                                            } else if (i - rating < 1 && i - rating > 0) {
                                                stars += '<i class=\"fas fa-star-half-alt\"></i>';
                                            } else {
                                                stars += '<i class=\"far fa-star\"></i>';
                                            }
                                        }
                                        return stars;
                                    })()}
                                </span>
                                <span style="font-size: 12px; color: #222;">${prod.rating ? prod.rating.toFixed(1) : '0.0'}</span>
                                <span style="font-size: 12px; color: #222;">${prod.review_count || 0}</span>
                                <span style="color: #888; font-size: 12px; margin-left: 2px;">reviews</span>
                                <span style="color: #888; font-size: 12px; margin-left: 8px;">${prod.sold || 0}</span>
                                <span style="color: #888; font-size: 12px; margin-left: 2px;">sold</span>
                            </div>
                        </div>
                    `;
                    card.onclick = () => window.location = `/sp-productdetails?product_id=${prod.product_id}`;
                    relatedGrid.appendChild(card);
                });
            } else {
                relatedGrid.textContent = 'No related products.';
            }
        });

    // When redirecting to /addresses, include product_type=sp
    function redirectToAddressesForBuyNow(productId) {
        window.location.href = `/addresses?from=product&product_id=${productId}&product_type=sp`;
    }

    // --- Reviews Section ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    function generateStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        return starsHTML;
    }
    function loadReviews() {
        fetch(`/api/reviews?product_id=${product.product_id}`)
            .then(res => res.json())
            .then(data => {
                reviewsContainer.innerHTML = '';
                if (!data.success || !data.reviews.length) {
                    reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
                    return;
                }
                data.reviews.forEach(review => {
                    let starsHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        starsHTML += i <= review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                    }
                    let mediaHTML = '';
                    if (review.media_url) {
                        if (review.media_type && review.media_type.startsWith('video')) {
                            mediaHTML = `<video controls style='max-width:180px;max-height:120px;'><source src='${review.media_url}' type='${review.media_type}'></video>`;
                        } else {
                            mediaHTML = `<img src='${review.media_url}' alt='Review Media' style='max-width:120px;max-height:120px;border-radius:6px;margin-top:6px;'>`;
                        }
                    }
                    reviewsContainer.innerHTML += `
                        <div class="review">
                            <div class="review-header">
                                <img src="${review.profile_image || '/static/pictures/user-circle.png'}" alt="${review.username}'s Profile Picture" class="profile-picture">
                                <div class="review-user-info">
                                    <strong class="review-username">${review.username}</strong>
                                    <span class="review-date">${review.created_at}</span>
                                </div>
                            </div>
                            <div class="review-rating">${starsHTML}</div>
                            <p class="review-text">${review.comment}</p>
                            ${mediaHTML}
                        </div>
                    `;
                });
            });
    }
    loadReviews();

    // --- Review Submission (if logged in and eligible) ---
    fetch('/api/user')
        .then(res => res.json())
        .then(userData => {
            if (userData.is_authenticated) {
                fetch(`/api/can-review?product_id=${product.product_id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.can_review) {
                            const reviewTab = document.getElementById('reviewsTab');
                            const formHTML = `
                                <form id="reviewForm" enctype="multipart/form-data" class="review-form">
                                    <h4>Leave a Review</h4>
                                    <div class="star-rating-input">
                                        <span>Rating:</span>
                                        <span id="starInput"></span>
                                    </div>
                                    <textarea id="reviewComment" placeholder="Write your review..." required></textarea>
                                    <input type="file" id="reviewMedia" accept="image/*,video/*">
                                    <button type="submit">Submit Review</button>
                                </form>
                            `;
                            reviewTab.insertAdjacentHTML('afterbegin', formHTML);
                            // Star input
                            const starInput = document.getElementById('starInput');
                            let selectedRating = 0;
                            for (let i = 1; i <= 5; i++) {
                                const star = document.createElement('i');
                                star.className = 'far fa-star';
                                star.dataset.value = i;
                                star.addEventListener('click', function() {
                                    selectedRating = i;
                                    document.querySelectorAll('#starInput i').forEach((s, idx) => {
                                        s.className = idx < i ? 'fas fa-star' : 'far fa-star';
                                    });
                                });
                                starInput.appendChild(star);
                            }
                            // Submit handler
                            document.getElementById('reviewForm').addEventListener('submit', function(e) {
                                e.preventDefault();
                                if (!selectedRating) {
                                    alert('Please select a rating.');
                                    return;
                                }
                                const comment = document.getElementById('reviewComment').value.trim();
                                const media = document.getElementById('reviewMedia').files[0];
                                const formData = new FormData();
                                formData.append('product_id', product.product_id);
                                formData.append('rating', selectedRating);
                                formData.append('comment', comment);
                                if (media) formData.append('media', media);
                                fetch('/api/reviews', {
                                    method: 'POST',
                                    body: formData
                                })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        alert('Review submitted!');
                                        loadReviews();
                                        document.getElementById('reviewForm').reset();
                                        document.querySelectorAll('#starInput i').forEach(s => s.className = 'far fa-star');
                                        selectedRating = 0;
                                    } else {
                                        alert(data.message || 'Failed to submit review.');
                                    }
                                });
                            });
                        }
                    });
            }
        });
});