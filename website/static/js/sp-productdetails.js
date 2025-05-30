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

    // Render related products from API (with variant boxes)
    const relatedGrid = document.getElementById('relatedProductsGrid');
    relatedGrid.innerHTML = '';
    if (Array.isArray(product.related_products) && product.related_products.length > 0) {
        product.related_products.forEach(rp => {
            const card = document.createElement('a');
            card.className = 'product-card';
            card.href = `/sp-productdetails?product_id=${rp.product_id}`;
            card.style.textDecoration = 'none';
            // Remove variant boxes from related products
            card.innerHTML = `
                <img src="${rp.image || '/static/pictures/default.jpg'}" alt="${rp.name}">
                <div class="product-info">
                    <h3>${rp.name}</h3>
                    <div class="product-price">₱ ${rp.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="product-rating product-rating-sm"><div class="stars">${generateStarsHTML(rp.rating)}</div><span class="rating-value">${rp.rating.toFixed(1)}</span><span class="review-count">${rp.review_count} review${rp.review_count === 1 ? '' : 's'}</span><span class="sold-count">${rp.sold} sold</span></div>
                </div>
            `;
            relatedGrid.appendChild(card);
        });
    } else {
        relatedGrid.innerHTML = '<div class="no-products">No related products found.</div>';
    }

    // When redirecting to /addresses, include product_type=sp
    function redirectToAddressesForBuyNow(productId) {
        window.location.href = `/addresses?from=product&product_id=${productId}&product_type=sp`;
    }
});