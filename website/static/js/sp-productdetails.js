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



    fetch(`/admin/product_variant_list`).then(r => r.json()).then(allVariants => {
        window.productVariants = allVariants.filter(v => v.product_id == product.product_id);
        // Render main product's variants (if any) under Material/Size/Variants
        const materialOptionsDiv = document.getElementById('materialOptions');
        const sizeOptionsDiv = document.getElementById('sizeOptions');
        const variantOptionsDiv = document.getElementById('variantOptions');
        if (product.variants && product.variants.length > 0) {
            let materialHTML = '';
            let sizeHTML = '';
            let variantsHTML = '';
            product.variants.forEach(variant => {
                const values = variant.value.split(',').map(v => v.trim());
                let btns = '';
                values.forEach(val => {
                    // Find the matching ProductVariant for this value
                    const matchingVariant = (window.productVariants || []).find(v => v.variant_name === variant.type && v.variant_value === val);
                    const variantId = matchingVariant ? matchingVariant.variant_id : '';
                    btns += `<button type="button" class="variant-choice" data-type="${variant.type}" data-value="${val}" data-variant-id="${variantId}" style="margin-right: 8px; margin-bottom: 8px;">${val}</button>`;
                });
                if (variant.type.toLowerCase() === 'material') {
                    materialHTML += btns;
                } else if (variant.type.toLowerCase() === 'size') {
                    sizeHTML += btns;
                } else {
                    variantsHTML += btns;
                    }
            });
            if (materialOptionsDiv) materialOptionsDiv.innerHTML = materialHTML;
            if (sizeOptionsDiv) sizeOptionsDiv.innerHTML = sizeHTML;
            // Remove/hide the Variants row entirely
            const variantOptionRow = document.getElementById('variantOptionRow');
            if (variantOptionRow) variantOptionRow.style.display = 'none';
            // Hide the Size row if there are no size buttons
            const sizeOptionRow = document.getElementById('sizeOptionRow');
            if (sizeOptionRow) sizeOptionRow.style.display = sizeHTML.trim() === '' ? 'none' : '';
            // Add click event listeners for variant buttons (one selectable per type)
            document.querySelectorAll('.variant-choice').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Deselect all buttons of this type
                    const type = btn.getAttribute('data-type');
                        document.querySelectorAll(`.variant-choice[data-type='${type}']`).forEach(b => b.classList.remove('selected'));
                    // Select this button
                    btn.classList.add('selected');
                });
            });
            // If only one variant, auto-select it
            if (window.productVariants.length === 1) {
                const onlyVariant = window.productVariants[0];
                // Find the button and mark as selected
                const btn = document.querySelector(`button[data-variant-id='${onlyVariant.variant_id}']`);
                if (btn) btn.classList.add('selected');
            }
        }
    });

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

    // Add to cart functionality
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    addToCartBtn.addEventListener('click', function () {
        const productName = document.getElementById('productTitle').textContent;
        const productPrice = parseFloat(document.getElementById('productPrice').textContent.replace('₱', '').replace(',', ''));
        const productImage = document.getElementById('mainProductImage').src;
        const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        // Get selected variants if they exist
        const selectedMaterialBtn = document.querySelector(".variant-choice[data-type='Material'].selected");
        const selectedMaterial = selectedMaterialBtn ? selectedMaterialBtn.getAttribute('data-value') : null;
        const selectedSizeBtn = document.querySelector(".variant-choice[data-type='Size'].selected");
        const selectedSize = selectedSizeBtn ? selectedSizeBtn.getAttribute('data-value') : null;
        const selectedVariantBtn = document.querySelector(".variant-choice[data-type]:not([data-type='Material']):not([data-type='Size']).selected");
        const selectedVariant = selectedVariantBtn ? selectedVariantBtn.getAttribute('data-value') : null;

        // Check if variants exist and are required
        const hasVariants = document.querySelectorAll('.variant-choice').length > 0;
        if (hasVariants && !selectedMaterial && !selectedSize && !selectedVariant) {
            alert('Please select a variant before adding to cart.');
            return;
        }

        if (isLoggedIn && product.product_id) {
            // Logged in: send to backend
            fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.product_id,
                    quantity: productQuantity,
                    material: selectedMaterial,
                    size: selectedSize,
                    variant: selectedVariant
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
                id: productName + (selectedMaterial || '') + (selectedSize || '') + (selectedVariant || ''),
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: productQuantity,
                material: selectedMaterial,
                size: selectedSize,
                variant: selectedVariant
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
            const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const selectedVariantBtn = document.querySelector('.variant-choice.selected');
            const selectedVariantId = selectedVariantBtn ? selectedVariantBtn.getAttribute('data-variant-id') : null;
            if (!selectedVariantId) {
                alert('Please select a variant before proceeding.');
                return;
            }
            if (isLoggedIn && product.product_id) {
                fetch('/api/addresses')
                    .then(res => res.json())
                    .then(data => {
                        if (!data.success || !data.addresses || data.addresses.length === 0) {
                            window.location.href = `/addresses?from=product&product_id=${product.product_id}&product_type=sp&variant_id=${selectedVariantId}&quantity=${productQuantity}`;
                        } else {
                            fetch('/buy-now', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    product_id: product.product_id,
                                    variant_id: selectedVariantId,
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
                    variant_id: selectedVariantId,
                    quantity: productQuantity
                };
                sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
                window.location.href = '/transaction?buy_now=1';
            }
        });
    }

    // --- Reviews Section ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewTab = document.getElementById('reviewsTab');

    // Fetch and display average rating
    fetch(`/api/reviews/average?product_id=${product.product_id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Update stars
                const rating = data.average;
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
                document.getElementById('reviewCount').textContent = `${data.count} review${data.count === 1 ? '' : 's'}`;
            }
        });

    // Add modal for enlarged review media if not present
    if (!document.getElementById('reviewMediaModal')) {
        const modal = document.createElement('div');
        modal.id = 'reviewMediaModal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.8)';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = '<span id="closeReviewMediaModal" style="position:absolute;top:20px;right:40px;font-size:3rem;color:#fff;cursor:pointer;">&times;</span><div id="reviewMediaModalContent" style="max-width:90vw;max-height:90vh;"></div>';
        document.body.appendChild(modal);
        document.getElementById('closeReviewMediaModal').onclick = function() {
            modal.style.display = 'none';
            document.getElementById('reviewMediaModalContent').innerHTML = '';
        };
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.getElementById('reviewMediaModalContent').innerHTML = '';
            }
        };
    }

    // Fetch and display reviews
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
                        if (review.media_type && ['mp4','mov','avi'].includes(review.media_type)) {
                            mediaHTML = `<video class='review-media-thumb' style='max-width:120px;max-height:90px;cursor:pointer;' src="${review.media_url}" controls></video>`;
                        } else {
                            mediaHTML = `<img class='review-media-thumb' style='max-width:120px;max-height:90px;cursor:pointer;' src="${review.media_url}" alt="Review Media">`;
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
                            ${mediaHTML ? `<div class="review-media">${mediaHTML}</div>` : ''}
                        </div>
                    `;
                });
            });
    }

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

    // Fetch all product variants for this product and expose to window.productVariants
    fetch(`/admin/product_variant_list`).then(r => r.json()).then(allVariants => {
        window.productVariants = allVariants.filter(v => v.product_id == product.product_id);
        // ... existing code for rendering variant buttons ...
        // If only one variant, auto-select it
        if (window.productVariants.length === 1) {
            const onlyVariant = window.productVariants[0];
            // Find the button and mark as selected
            const btn = document.querySelector(`button[data-variant-id='${onlyVariant.variant_id}']`);
            if (btn) btn.classList.add('selected');
        }
    });

    // In Buy Now and Add to Cart, if no variant is selected but only one exists, use that variant_id
    function getSelectedVariantId() {
        const selectedBtn = document.querySelector('.variant-choice.selected');
        if (selectedBtn) return selectedBtn.getAttribute('data-variant-id');
        if (window.productVariants && window.productVariants.length === 1) {
            return window.productVariants[0].variant_id;
        }
        return null;
    }

    // When redirecting to /addresses, include product_type=sp
    function redirectToAddressesForBuyNow(productId) {
        window.location.href = `/addresses?from=product&product_id=${productId}&product_type=sp`;
    }
});