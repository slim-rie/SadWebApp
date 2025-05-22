document.addEventListener('DOMContentLoaded', async function () {
    console.log('sm-productdetails.js loaded');
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
    console.log('product_id from URL:', productId);

    const apiUrl = `/api/productdetails?product_id=${encodeURIComponent(productId)}`;
    console.log('Fetching API URL:', apiUrl);

    // Fetch product details from API
    let product = null;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            product = await response.json();
            console.log('Product data from API:', product);
    } else {
            document.getElementById('productTitle').textContent = 'Product Not Found';
            return;
        }
    } catch (error) {
        document.getElementById('productTitle').textContent = 'Error loading product';
        console.error('Error fetching product:', error);
        return;
    }

    // Render product details
    document.getElementById('productBreadcrumb').textContent = product.name || 'Product';
    document.getElementById('productTitle').textContent = product.name || 'Product Title';
    document.getElementById('productPrice').textContent = '₱ ' + (product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00');
    document.getElementById('stockInfo').textContent = (product.stock || 0) + ' pieces available';
    document.getElementById('productDescription').innerHTML = product.description || '';

    // --- Image Gallery/Slider Logic ---
    function getImageUrl(imgUrl) {
        if (imgUrl.startsWith('/static/')) return imgUrl;
        return '/static/' + imgUrl.replace(/^\/+/,'');
    }
        const mainImage = document.getElementById('mainProductImage');
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    let currentImageIndex = 0;
    if (Array.isArray(product.images) && product.images.length > 0) {
        function showImage(idx) {
            mainImage.src = getImageUrl(product.images[idx]);
            mainImage.alt = product.name;
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === idx);
            });
        }
        thumbnailGallery.innerHTML = '';
        product.images.forEach((imgUrl, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail' + (idx === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${getImageUrl(imgUrl)}" alt="Thumbnail ${idx+1}" class="thumbnail-img">`;
            thumb.addEventListener('click', function() {
                currentImageIndex = idx;
                showImage(idx);
            });
            thumbnailGallery.appendChild(thumb);
        });
        document.getElementById('prevImage').onclick = function() {
            currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
            showImage(currentImageIndex);
        };
        document.getElementById('nextImage').onclick = function() {
            currentImageIndex = (currentImageIndex + 1) % product.images.length;
            showImage(currentImageIndex);
        };
        showImage(0);
    } else if (product.image) {
        mainImage.src = getImageUrl(product.image);
    mainImage.alt = product.name;
        thumbnailGallery.innerHTML = '';
    } else {
        mainImage.src = '/static/pictures/default.jpg';
        mainImage.alt = 'Product Image';
        thumbnailGallery.innerHTML = '';
    }

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
    document.getElementById('soldCount').textContent = (product.sold ? product.sold : 0) + ' sold';

    // Option row for model
        const optionRow = document.querySelector('.option-row');
    if (optionRow && product.model_number) {
        optionRow.querySelector('.option-label').textContent = 'Model';
        const optionValueContainer = optionRow.querySelector('.option-value');
        optionValueContainer.innerHTML = '';
        // Only show the current product's model as a single button (active)
            const btn = document.createElement('button');
        btn.className = 'model-option active';
        btn.textContent = product.model_number || product.name;
            btn.style.border = '2px solid #007bff';
            btn.style.borderRadius = '8px';
            btn.style.padding = '4px 12px';
            btn.style.marginRight = '8px';
        btn.style.background = '#e6f0ff';
            btn.style.fontWeight = 'bold';
            optionValueContainer.appendChild(btn);
    }

    // Initialize quantity selector
    initializeQuantitySelector(product.stock);
    initializeTabs();

    // Related products and reviews can be left as is or further improved

    // --- Existing helper functions below ---

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

    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    addToCartBtn.addEventListener('click', function () {
        const productName = document.getElementById('productTitle').textContent;
        const productPrice = parseFloat(document.getElementById('productPrice').textContent.replace('₱', '').replace(',', ''));
        const productImage = document.getElementById('mainProductImage').src;
        const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const selectedModelBtn = document.querySelector('.model-choice.selected');
        const selectedModel = selectedModelBtn ? selectedModelBtn.textContent.trim() : null;

        if (isLoggedIn && product.product_id) {
            // Logged in: send to backend
            fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.product_id,
                    quantity: productQuantity,
                    model: selectedModel
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
            id: productName + (selectedModel || ''),
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: productQuantity,
            model: selectedModel
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
            const selectedModelBtn = document.querySelector('.model-choice.selected');
            const selectedModel = selectedModelBtn ? selectedModelBtn.textContent.trim() : null;
            if (isLoggedIn && product.product_id) {
                fetch('/buy-now', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        product_id: product.product_id,
                        quantity: productQuantity,
                        model: selectedModel
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
            } else {
                // Guest: use sessionStorage
                const buyNowItem = {
                    product_id: product.product_id,
                    quantity: productQuantity,
                    model: selectedModel
                };
                sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
                window.location.href = '/transaction?buy_now=1';
            }
        });
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    const userIcon = document.getElementById('user-icon');
    const usernameDisplay = document.querySelector('.username');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    function updateUIForLoginStatus(isLoggedIn, username) {
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';

            dropdownMenu.innerHTML = `
                <a href="/my-account" class="dropdown-item">My Account</a>
                <a href="/orders" class="dropdown-item">Orders</a>
                <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
            `;

            document.getElementById('logoutBtn').addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        } else {
            usernameDisplay.textContent = '';
            usernameDisplay.style.display = 'none';

            dropdownMenu.innerHTML = ''; 
        }
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html'; 
    }

    const chatLink = document.getElementById('chatLink');
const chatModal = document.getElementById('chatModal');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const quickQuestions = document.querySelectorAll('.quick-question-btn');

function addMessage(text, className) {
const messageElement = document.createElement('div');
messageElement.classList.add('message', className);
messageElement.textContent = text;
chatMessages.appendChild(messageElement);

chatMessages.scrollTop = chatMessages.scrollHeight;
}

quickQuestions.forEach(button => {
button.addEventListener('click', function () {
    const question = this.getAttribute('data-question');
    addMessage(question, 'user-message'); 

    setTimeout(() => {
        let response = '';
        switch (question.toLowerCase()) {
            case 'shipping policy':
                response = 'Our shipping policy ensures delivery within 3-5 business days.';
                break;
            case 'return policy':
                response = 'You can return items within 30 days of purchase.';
                break;
            case 'product inquiry':
                response = 'Please provide the product name for more details.';
                break;
            case 'payment methods':
                response = 'We accept GCash, bank transfers, and cash on delivery.';
                break;
            case 'order tracking':
                response = 'You can track your order using the tracking ID sent to your email.';
                break;
            default:
                response = 'Thank you for your message! Our team will get back to you shortly.';
                break;
        }
        addMessage(response, 'bot-message'); 
    }, 1000);
});
});

function openChatModal() {
chatModal.classList.add('show-modal');
document.body.style.overflow = 'hidden';
}

function closeChatModal() {
chatModal.classList.remove('show-modal');
document.body.style.overflow = '';
}

if (chatLink) {
chatLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (isLoggedIn) {
        openChatModal();
    } else {
        openLoginModal();
    }
});
}

if (chatForm) {
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        
        chatInput.value = '';
        
        setTimeout(() => {
            addMessage('Thank you for your message! Our team will get back to you shortly.', 'system-message');
        }, 1000);
    }
});
}

if (chatModal) {
const closeChatBtn = chatModal.querySelector('.close-chat');

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', closeChatModal);
}
}

    function openLoginModal() {
        loginModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    }

    closeModal.addEventListener('click', function () {
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });

    modalOverlay.addEventListener('click', function () {
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });

    // --- User Dropdown Logic ---
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

    updateUIForLoginStatus(isLoggedIn, username);

    // --- Reviews Section ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewTab = document.getElementById('reviewsTab');

    // Use the already declared isLoggedIn variable
    if (isLoggedIn) {
        fetch(`/api/can-review?product_id=${productId}`)
            .then(res => res.json())
            .then(data => {
                if (data.can_review) {
                    // Render review form
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
                } else {
                    // Not eligible
                }
            });
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
        window.location.href = '/sign-up';
    });
    }

    // Fetch and render related products
    fetch(`/api/related-products?product_id=${product.product_id}`)
        .then(res => res.json())
        .then(relatedProducts => {
            const relatedGrid = document.getElementById('relatedProductsGrid');
            relatedGrid.innerHTML = '';
            if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
                relatedProducts
                    .filter(rp => rp.brand === product.brand) // Only show products with the same brand
                    .forEach(rp => {
                        const card = document.createElement('a');
                        card.className = 'product-card';
                        card.href = `/sm-productdetails?product=${encodeURIComponent(rp.name)}`;
                        card.style.textDecoration = 'none';
                        card.innerHTML = `
                            <img src="${rp.image}" alt="${rp.name}">
                            <div class="product-info">
                                <h3>${rp.name}</h3>
                                <div class="product-price">₱ ${rp.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div class="product-rating">
                                    <div class="stars">${generateStarsHTML(rp.rating)}</div>
                                    <span class="rating-value">${rp.rating.toFixed(1)}</span>
                                    <span class="review-count">${rp.review_count} review${rp.review_count === 1 ? '' : 's'}</span>
                                    <span class="review-count">${rp.sold ? rp.sold : 0} sold</span>
                                </div>
                            </div>
                        `;
                        relatedGrid.appendChild(card);
                    });
            } else {
                relatedGrid.innerHTML = '<div class="no-products">No related products found.</div>';
            }
        });

    // Helper for stars
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

    // Store the current product's brand in localStorage
    if (product.brand) {
        localStorage.setItem('selectedBrand', product.brand);
    }

    // Set breadcrumb link for Sewing Machines
    const breadcrumbParent = document.getElementById('breadcrumbParent');
    if (breadcrumbParent) {
        breadcrumbParent.href = '/sewingmachines';
        breadcrumbParent.textContent = 'Sewing Machines';
    }

    // --- Guest Buy-Now Session Sync ---
    if (window.location.pathname === '/transaction' && window.location.search.includes('buy_now=1')) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn && sessionStorage.getItem('buyNowItem')) {
            fetch('/buy-now', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: sessionStorage.getItem('buyNowItem')
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.removeItem('buyNowItem');
                    window.location.reload();
                } else {
                    alert('Failed to start buy now: ' + (data.message || 'Unknown error'));
                }
            });
        }
    }
});