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

    // Specifications table (basic)
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

    // Option row for model
        const optionRow = document.querySelector('.option-row');
    if (optionRow) {
        optionRow.querySelector('.option-label').textContent = 'Model';
        const optionValueContainer = optionRow.querySelector('.option-value');
        optionValueContainer.innerHTML = `<button class="model-option active">${product.model_number || ''}</button>`;
        const modelOption = optionValueContainer.querySelector('.model-option');
        modelOption.addEventListener('click', function () {
            document.querySelectorAll('.model-option').forEach(option => option.classList.remove('active'));
            this.classList.add('active');
        });
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

    userIcon.addEventListener('click', function () {
        if (isLoggedIn) {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        } else {
            openLoginModal();
        }
    });

    updateUIForLoginStatus(isLoggedIn, username);

    window.addEventListener('click', function (event) {
        if (!event.target.matches('#user-icon') && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });

    const sampleReviews = [
        {
            username: 'john_doe123', 
            profilePicture: 'images/profile1.jpg', 
            date: 'April 25, 2025',
            rating: 5,
            comment: 'Excellent product! Highly recommended.',
            media: { type: 'image/jpeg', url: 'images/sample-review1.jpg' } 
        },
        {
            username: 'jane_smith456', 
            profilePicture: 'images/profile2.jpg',
            date: 'April 20, 2025',
            rating: 4,
            comment: 'Good quality, but the delivery was a bit slow.',
            media: { type: 'video/mp4', url: 'videos/sample-review1.mp4' }
        },
        {
            username: 'alice_johnson789', 
            profilePicture: 'images/profile3.jpg', 
            date: 'April 18, 2025',
            rating: 3,
            comment: 'The product is okay, but I expected better packaging.',
            media: { type: 'image/jpeg', url: 'images/sample-review2.jpg' } 
        }
    ];

    function loadCustomerReviews(reviews) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = ''; 

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';

            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }

            reviewElement.innerHTML = `
                <div class="review-header">
                    <img src="${review.profilePicture}" alt="${review.username}'s Profile Picture" class="profile-picture">
                    <div class="review-user-info">
                        <strong class="review-username">${review.username}</strong>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <div class="review-rating">${starsHTML}</div>
                <p class="review-text">${review.comment}</p>
            `;

            if (review.media) {
                const mediaElement = document.createElement('div');
                mediaElement.className = 'review-media';

                if (review.media.type.startsWith('image/')) {
                    mediaElement.innerHTML = `<img src="${review.media.url}" alt="Review Image">`;
                } else if (review.media.type.startsWith('video/')) {
                    mediaElement.innerHTML = `<video controls src="${review.media.url}"></video>`;
                }

                reviewElement.appendChild(mediaElement);
            }

            reviewsContainer.appendChild(reviewElement);
        });
    }

    loadCustomerReviews(sampleReviews);

    document.getElementById('loginBtn').addEventListener('click', function() {
        window.location.href = '/sign-up';
    });
});