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
    // const rating = 4.5;
    // const sold = 0;
    // const ratingContainer = document.getElementById('productRating');
    // ratingContainer.innerHTML = '';
    // for (let i = 1; i <= 5; i++) { ... }
    // document.getElementById('ratingValue').textContent = rating.toFixed(1);
    // document.getElementById('reviewCount').textContent = "100+ reviews";
    // document.getElementById('soldCount').textContent = sold + ' sold';

    document.getElementById('productPrice').textContent = '₱ ' + product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('stockInfo').textContent = product.stock + ' pieces available';
    document.getElementById('productDescription').innerHTML = product.description;

    // Specifications table (dynamic)
    const specsTableBody = document.getElementById('specsTableBody');
    specsTableBody.innerHTML = '';
    if (product.brand) {
        const row = document.createElement('tr');
        row.innerHTML = `<td class=\"spec-label\">Brand</td><td class=\"spec-value\">${product.brand}</td>`;
        specsTableBody.appendChild(row);
    }
    if (Array.isArray(product.specifications)) {
        product.specifications.forEach(spec => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class=\"spec-label\">${spec.name}</td><td class=\"spec-value\">${spec.value}</td>`;
            specsTableBody.appendChild(row);
        });
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
            const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn && product.product_id) {
                fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: product.product_id, quantity: productQuantity })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/transaction';
                    } else {
                        alert('Failed to add to cart: ' + (data.message || 'Unknown error'));
                    }
                });
            } else {
                // Guest: use localStorage
                const productName = document.getElementById('productTitle').textContent;
                const productPrice = parseFloat(document.getElementById('productPrice').textContent.replace('₱', '').replace(',', ''));
                const productImage = document.getElementById('mainProductImage').src;
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
                window.location.href = '/transaction';
            }
        });
    }

    // --- Reviews Section ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewTab = document.getElementById('reviewsTab');
    let productId = product.product_id;

    // Fetch and display average rating
    fetch(`/api/reviews/average?product_id=${productId}`)
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

    // Add modal for enlarged review media
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
        fetch(`/api/reviews?product_id=${productId}`)
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
                // Add click event for thumbnails
                document.querySelectorAll('.review-media-thumb').forEach(el => {
                    el.onclick = function() {
                        const modal = document.getElementById('reviewMediaModal');
                        const modalContent = document.getElementById('reviewMediaModalContent');
                        if (el.tagName === 'IMG') {
                            modalContent.innerHTML = `<img src='${el.src}' style='max-width:90vw;max-height:90vh;'>`;
                        } else if (el.tagName === 'VIDEO') {
                            modalContent.innerHTML = `<video src='${el.src}' style='max-width:90vw;max-height:90vh;' controls autoplay></video>`;
                        }
                        modal.style.display = 'flex';
                    };
                });
            });
    }
    loadReviews();

    // Review submission form (for logged-in users)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        const formHTML = `
            <form id=\"reviewForm\" enctype=\"multipart/form-data\" class=\"review-form\">
                <h4>Leave a Review</h4>
                <div class=\"star-rating-input\">
                    <span>Rating:</span>
                    <span id=\"starInput\"></span>
                </div>
                <textarea id=\"reviewComment\" placeholder=\"Write your review...\" required></textarea>
                <input type=\"file\" id=\"reviewMedia\" accept=\"image/*,video/*\">
                <button type=\"submit\">Submit Review</button>
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
            formData.append('product_id', productId);
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

    // Set breadcrumb to actual category and product name, and link category to correct page
    const selectedCategory = document.getElementById('selectedCategory');
    if (selectedCategory && product.category_name) {
        selectedCategory.textContent = product.category_name;
        // Set category link if in breadcrumb
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            const categoryLink = selectedCategory.previousElementSibling;
            if (categoryLink && categoryLink.tagName === 'A') {
                if (categoryParam === 'Sewing Parts') {
                    categoryLink.setAttribute('href', '/sewingparts');
                } else if (categoryParam === 'Fabrics') {
                    categoryLink.setAttribute('href', '/fabrics');
                } else if (categoryParam === 'Sewing Machines') {
                    categoryLink.setAttribute('href', '/sewingmachines');
                }
            }
        }
        // Add product name after category
        if (!document.getElementById('breadcrumbProductName')) {
            const productSpan = document.createElement('span');
            productSpan.id = 'breadcrumbProductName';
            productSpan.textContent = ' > ' + product.name;
            selectedCategory.parentNode.appendChild(productSpan);
        } else {
            document.getElementById('breadcrumbProductName').textContent = ' > ' + product.name;
        }
    }

    // --- User Dropdown Logic ---
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (userIcon && dropdownMenu) {
        userIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
        window.addEventListener('click', function (event) {
            if (!event.target.closest('.user-dropdown')) {
                dropdownMenu.style.display = 'none';
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