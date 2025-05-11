document.addEventListener('DOMContentLoaded', function () {
    const productDatabase = {
        "Bobbin Case": {
            brand: "Shunfa",
            price: 150.00,
            rating: 4.5,
            sold: "120",
            mainImage: "/static/pictures/B9117-012-000.jpg",
            images: [
                "/static/pictures/B9117-012-000.jpg"
            ],
            description: "High-quality bobbin case for sewing machines.",
            specifications: [
                { label: "Brand", value: "Shunfa" },
                { label: "Part Code", value: "B9117-012-000" },
                { label: "Origin", value: "China Made" }
            ],
            stock: 20,
            color: "Silver"
        },
        "Bobbin": {
            brand: "Shunfa",
            price: 50.00,
            rating: 4.2,
            sold: "200",
            mainImage: "/static/pictures/B1837-012-000.jpg",
            images: [
                "/static/pictures/B1837-012-000.jpg"
            ],
            description: "Durable bobbin for smooth sewing operations.",
            specifications: [
                { label: "Brand", value: "Shunfa" },
                { label: "Part Code", value: "B1837-012-000" },
                { label: "Origin", value: "China Made" }
            ],
            stock: 50,
            color: "Silver"
        },
        "Positioning Finger": {
            brand: "Shunfa",
            price: 75.00,
            rating: 4.0,
            sold: "80",
            mainImage: "/static/pictures/B1835-012-000.jpg",
            images: [
                "/static/pictures/B1835-012-000.jpg"
            ],
            description: "Precision positioning finger for sewing machines.",
            specifications: [
                { label: "Brand", value: "Shunfa" },
                { label: "Part Code", value: "B1835-012-000" },
                { label: "Origin", value: "China Made" }
            ],
            stock: 30,
            color: "Silver"
        },
        "Rotating Hook": {
            brand: "Shunfa",
            price: 300.00,
            rating: 4.8,
            sold: "50",
            mainImage: "/static/pictures/B1830-127-000.jpg",
            images: [
                "/static/pictures/B1830-127-000.jpg"
            ],
            description: "Reliable rotating hook for efficient sewing.",
            specifications: [
                { label: "Brand", value: "Shunfa" },
                { label: "Part Code", value: "B1830-127-000" },
                { label: "Origin", value: "China Made" }
            ],
            stock: 15,
            color: "Silver"
        },
        "Presser Foot": {
            brand: "Shunfa",
            price: 120.00,
            rating: 4.6,
            sold: "100",
            mainImage: "/static/pictures/B3421-552-000.jpg",
            images: [
                "/static/pictures/B3421-552-000.jpg"
            ],
            description: "Durable presser foot for various sewing applications.",
            specifications: [
                { label: "Brand", value: "Shunfa" },
                { label: "Part Code", value: "B3421-552-000" },
                { label: "Origin", value: "China Made" }
            ],
            stock: 25,
            color: "Silver"
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    if (productName && productDatabase[productName]) {
        const product = productDatabase[productName];
        loadProductDetails(productName, product);
    } else {
        console.error("Product not found");
    }

    function loadProductDetails(productName, product) {
        document.getElementById('productBreadcrumb').textContent = productName;

        document.getElementById('productTitle').textContent = productName;

        const mainImage = document.getElementById('mainProductImage');
        mainImage.src = product.mainImage;
        mainImage.alt = productName;

        const thumbnailGallery = document.getElementById('thumbnailGallery');
        thumbnailGallery.innerHTML = '';

        const mainThumbnail = document.createElement('div');
        mainThumbnail.className = 'thumbnail active';
        mainThumbnail.innerHTML = `<img src="${product.mainImage}" alt="Main Thumbnail" class="thumbnail-img active">`;
        thumbnailGallery.appendChild(mainThumbnail);

        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}" class="thumbnail-img">`;
            thumbnailGallery.appendChild(thumbnail);

            thumbnail.addEventListener('click', function () {
                mainImage.src = image;
                mainImage.alt = `${productName} - View ${index + 1}`;

                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
                thumbnail.querySelector('.thumbnail-img').classList.add('active');
            });
        });

        const ratingContainer = document.getElementById('productRating');
        ratingContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= Math.floor(product.rating)) {
                star.className = 'fas fa-star';
            } else if (i - 0.5 <= product.rating) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            ratingContainer.appendChild(star);
        }

        document.getElementById('ratingValue').textContent = product.rating.toFixed(1);
        document.getElementById('reviewCount').textContent = "100+ reviews";
        document.getElementById('soldCount').textContent = product.sold + ' sold';

        document.getElementById('productPrice').textContent = '₱ ' + product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        document.getElementById('stockInfo').textContent = product.stock + ' pieces available';

        document.getElementById('productDescription').innerHTML = product.description;

        const specsTableBody = document.getElementById('specsTableBody');
        specsTableBody.innerHTML = '';
        product.specifications.forEach(spec => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="spec-label">${spec.label}</td>
                <td class="spec-value">${spec.value}</td>
            `;
            specsTableBody.appendChild(row);
        });

        initializeQuantitySelector(product.stock);
        loadRelatedProducts(product.brand);
        initializeTabs();
    }

    function initializeImageSlider(images, mainImage) {
        const allImages = [mainImage, ...images];
        
        let currentIndex = 0;
        const mainImageElement = document.getElementById('mainProductImage');
        const prevButton = document.getElementById('prevImage');
        const nextButton = document.getElementById('nextImage');

        function updateImage(index) {
            mainImageElement.src = allImages[index];
            mainImageElement.alt = `Image ${index + 1}`;
            
            document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
                if (idx === index) {
                    thumb.classList.add('active');
                    thumb.querySelector('.thumbnail-img').classList.add('active');
                } else {
                    thumb.classList.remove('active');
                    thumb.querySelector('.thumbnail-img').classList.remove('active');
                }
            });
        }

        prevButton.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
            updateImage(currentIndex);
        });

        nextButton.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % allImages.length;
            updateImage(currentIndex);
        });
    }

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
            button.addEventListener('click', function() {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + 'Tab').classList.add('active');
            });
        });
    }
    
    function loadRelatedProducts(currentBrand) {
        const relatedProductsGrid = document.getElementById('relatedProductsGrid');
        relatedProductsGrid.innerHTML = '';
        
        let relatedProducts = [];
        for (const productName in productDatabase) {
            const product = productDatabase[productName];
            if (product.brand === currentBrand) {
                relatedProducts.push({ name: productName, ...product });
                if (relatedProducts.length >= 4) break; 
            }
        }
        
        if (relatedProducts.length < 4) {
            for (const productName in productDatabase) {
                const product = productDatabase[productName];
                if (product.brand !== currentBrand) {
                    relatedProducts.push({ name: productName, ...product });
                    if (relatedProducts.length >= 4) break;
                }
            }
        }
        
        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(product.rating)) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 <= product.rating) {
                    starsHTML += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }
            
            productCard.innerHTML = `
                <img src="${product.mainImage}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₱ ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="product-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                        <span class="review-count">${product.sold} sold</span>
                    </div>
                </div>
            `;
            
            productCard.addEventListener('click', function() {
                window.location.href = `/productdetails?product=${encodeURIComponent(product.name)}`;
            });
            
            relatedProductsGrid.appendChild(productCard);
        });
    }

    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    addToCartBtn.addEventListener('click', function () {
        const productName = document.getElementById('productTitle').textContent;
        const productPrice = parseFloat(document.getElementById('productPrice').textContent.replace('₱', '').replace(',', ''));
        const productImage = document.getElementById('mainProductImage').src;
        const productQuantity = parseInt(document.getElementById('quantityInput').value, 10);

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
    });

    buyNowBtn.addEventListener('click', function () {
        window.location.href = 'transaction.html';
    });
    
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