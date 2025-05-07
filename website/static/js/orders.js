document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    document.getElementById('sidebarUsername').textContent = username || '';
    
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
        document.getElementById('profileImage').src = savedProfileImage;
    }
    
    const orders = [
        {
            id: 'ORD-24680',
            status: 'cancelled',
            statusText: 'Cancelled by you',
            products: [
                {
                    name: 'Polyester Fabrics',
                    variation: 'Teal - White',
                    quantity: 4,
                    price: 183,
                    originalPrice: 243,
                    image: 'images/fabric-sample.png'
                }
            ],
            total: 732,
            deliveryDate: ''
        },
        {
            id: 'ORD-13579',
            status: 'cancelled',
            statusText: 'Cancelled automatically by JBR\'s system',
            products: [
                {
                    name: 'Silk Blanket Fabrics',
                    variation: 'Dark Blue - White',
                    quantity: 3,
                    price: 165,
                    originalPrice: 328,
                    image: 'images/fabric-sample.png'
                }
            ],
            total: 495,
            deliveryDate: ''
        },
        {
            id: 'ORD-78965',
            status: 'to-receive',
            statusText: 'Out for delivery',
            products: [
                {
                    name: 'China Cotton 135 GSM',
                    variation: 'Whites - Cream',
                    quantity: 2,
                    price: 450,
                    originalPrice: 530,
                    image: 'images/fabric-sample.png'
                }
            ],
            total: 450,
            deliveryDate: 'Confirm receipt after you\'ve checked the received items and made payment'
        },
        {
            id: 'ORD-54321',
            status: 'to-pay',
            statusText: 'Pending Payment',
            products: [
                {
                    name: 'Ribbing Fabric (for Neckline)',
                    variation: 'Maroon',
                    quantity: 1,
                    price: 280,
                    originalPrice: 380,
                    image: 'images/fabric-sample.png'
                }
            ],
            total: 280,
            deliveryDate: 'Please complete payment by 04/25/2025'
        },
        {
            id: 'ORD-12345',
            status: 'to-ship',
            statusText: 'Seller is preparing your order',
            products: [
                {
                    name: 'Solid Craft Cotton Fabric',
                    variation: 'Whites - Cream',
                    quantity: 2,
                    price: 140,
                    originalPrice: 280,
                    image: 'images/fabric-sample.png'
                }
            ],
            total: 280,
            deliveryDate: 'Delivery attempt should be made between 03/13/2025 and 03/15/2025'
        },
        {
            id: 'ORD-67890',
            status: 'completed',
            statusText: 'Parcel has been delivered',
            products: [
                {
                    name: 'Brother SE700 Computerized Sewing and Embroidery Machine with Artspira App',
                    variation: '',
                    quantity: 1,
                    price: 9639.89,
                    originalPrice: 12000,
                    image: 'images/sewing-machine.png'
                }
            ],
            total: 9639.89,
            deliveryDate: 'Rate products by 03/17/2025'
        },
        {
            id: 'ORD-192',
            status: 'return-refund',
            statusText: 'REFUND COMPLETED',
            products: [
                {
                    name: 'China Cotton 165 GSM',
                    variation: 'Pink',
                    quantity: 3,
                    price: 578,
                    originalPrice: 650,
                    image: 'images/fabric-sample.png'
                }
            ],
            total: 578,
            refundAmount: 578,
            deliveryDate: '',
            refundStatus: 'completed'
        }
    ];
    
    
    function loadOrders(filter = 'all') {
        const container = document.getElementById('ordersContainer');
        container.innerHTML = '';
        
        let filteredOrders = orders;
        if (filter !== 'all') {
            filteredOrders = orders.filter(order => order.status === filter);
        }
        
        if (filteredOrders.length === 0) {
            container.innerHTML = '<div class="no-orders">No orders found</div>';
            return;
        }
        
        filteredOrders.forEach(order => {
            let orderHtml = `
                <div class="order-card">
            `;
            
            order.products.forEach(product => {
                orderHtml += `
                    <div class="order-item">
                        <div class="order-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="order-item-details">
                            <h3>${product.name}</h3>
                            ${product.variation ? `<p>Variation: ${product.variation}</p>` : ''}
                            <p>x${product.quantity}</p>
                            <div class="price-container">
                                <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>
                                <span class="discounted-price">₱${product.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="order-status">
                            <p class="status-text">${order.statusText}</p>
                            <div class="status-badge ${order.status}">${order.status.replace('-', ' ').toUpperCase()}</div>
                        </div>
                    </div>
                    <div class="order-item-info">
                        ${order.deliveryDate ? `<p>${order.deliveryDate}</p>` : ''}
                        <div class="order-total">
                            <span>Order Total: <strong>₱${order.total.toFixed(2)}</strong></span>
                        </div>
                    </div>
                    <div class="order-actions">
                `;
                
                if (order.status === 'completed') {
                    orderHtml += `
                        <button class="action-btn rate-btn">Rate</button>
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                } else if (order.status === 'to-ship') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                } else if (order.status === 'to-pay') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn payment-btn">Pay Now</button>
                        <button class="action-btn cancel-order-btn">Cancel Order</button>
                    `;
                } else if (order.status === 'to-receive') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn track-order-btn">Track Order</button>
                        <button class="action-btn order-received-btn">Order Received</button>
                    `;
                } else if (order.status === 'cancelled') {
                    orderHtml += `
                        <button class="action-btn view-details-btn">View Cancellation Details</button>
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                }
                
                orderHtml += `
                    </div>
                `;
            });
            
            orderHtml += `</div>`;
            container.innerHTML += orderHtml;
        });
        
        document.querySelectorAll('.contact-seller-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const chatModal = document.getElementById('chatModal');
        chatModal.style.display = 'block';
    });
});
        
        document.querySelectorAll('.buy-again-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                window.location.href = 'cart.html';
            });
        });
        
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showSuccessMessage('Order cancelled successfully');
            });
        });
        
        document.querySelectorAll('.track-order-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                window.location.href = 'trackorder.html';
            });
        });

        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                window.location.href = 'transaction.html';
            });
        });
        
document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const orderId = this.closest('.order-card').dataset.orderId;
        window.location.href = 'cancel-order-details.html?orderId=' + orderId;
    });
        });
    
        }
    
    loadOrders();
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadOrders(this.getAttribute('data-tab'));
        });
    });
    
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
        
        if (!searchTerm) {
            loadOrders(document.querySelector('.tab.active').getAttribute('data-tab'));
            return;
        }
        
        const container = document.getElementById('ordersContainer');
        container.innerHTML = '';
        
        const filteredOrders = orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) || 
            order.products.some(product => product.name.toLowerCase().includes(searchTerm))
        );
        
        if (filteredOrders.length === 0) {
            container.innerHTML = '<div class="no-orders">No orders found matching your search</div>';
            return;
        }
        
        filteredOrders.forEach(order => {
            let orderHtml = `<div class="order-card">`;
            
            order.products.forEach(product => {
                orderHtml += `
                    <div class="order-item">
                        <div class="order-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="order-item-details">
                            <h3>${product.name}</h3>
                            ${product.variation ? `<p>Variation: ${product.variation}</p>` : ''}
                            <p>x${product.quantity}</p>
                            <div class="price-container">
                                <span class="original-price">₱${product.originalPrice.toFixed(2)}</span>
                                <span class="discounted-price">₱${product.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="order-status">
                            <p class="status-text">${order.statusText}</p>
                            <div class="status-badge ${order.status}">${order.status.replace('-', ' ').toUpperCase()}</div>
                        </div>
                    </div>
                    <div class="order-item-info">
                        ${order.deliveryDate ? `<p>${order.deliveryDate}</p>` : ''}
                        <div class="order-total">
                            <span>Order Total: <strong>₱${order.total.toFixed(2)}</strong></span>
                        </div>
                    </div>
                    <div class="order-actions">
                `;
                
                if (order.status === 'completed') {
                    orderHtml += `
                        <button class="action-btn rate-btn">Rate</button>
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                } else if (order.status === 'to-ship') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                } else if (order.status === 'to-pay') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn payment-btn">Pay Now</button>
                        <button class="action-btn cancel-order-btn">Cancel Order</button>
                    `;
                } else if (order.status === 'to-receive') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn track-order-btn">Track Order</button>
                        <button class="action-btn order-received-btn">Order Received</button>
                    `;
                } else if (order.status === 'cancelled') {
                    orderHtml += `
                        <button class="action-btn view-details-btn">View Cancellation Details</button>
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                }
                
                orderHtml += `
                    </div>
                `;
            });
            
            orderHtml += `</div>`;
            container.innerHTML += orderHtml;
        });
        
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent === 'Pay Now') {
                    showSuccessMessage('Payment processing initiated');
                } else {
                    showSuccessMessage('Thank you for rating this product');
                }
            });
        });
        
        document.querySelectorAll('.contact-seller-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showSuccessMessage('Message sent to seller');
            });
        });
        
        document.querySelectorAll('.buy-again-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                window.location.href = 'cart.html';
            });
        });
        
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showSuccessMessage('Order cancelled successfully');
            });
        });
        
        document.querySelectorAll('.track-order-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                window.location.href = 'trackorder.html';
            });
        });
        
        document.querySelectorAll('.order-received-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showSuccessMessage('Thank you for confirming receipt of your order');
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showSuccessMessage('Cancellation details viewed');
            });
        });
    });
    
    document.getElementById('orderSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('searchBtn').click();
        }
    });
    
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        window.location.href = '/my-account';
    });
    
    
    function showSuccessMessage(message) {
        const successMessage = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        
        successText.textContent = message;
        successMessage.classList.add('show');
        
        setTimeout(function() {
            successMessage.classList.remove('show');
        }, 3000);
    }
    
    function updateUIForLoginStatus(isLoggedIn, username) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const usernameDisplay = document.getElementById('usernameDisplay');
        
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';
            
            dropdownMenu.innerHTML = `
                <a href="/my-account" class="dropdown-item">My Account</a>
                <a href="/orders" class="dropdown-item">Orders</a>
                <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
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

    if (contact-seller-btn) {
        contact-seller-btn.addEventListener('click', function(e) {
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

    const ratingModalOverlay = document.querySelector('.rating-modal-overlay');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const rateButtons = document.querySelectorAll('.rate-btn');

    rateButtons.forEach(button => {
        button.addEventListener('click', function () {
            ratingModalOverlay.style.display = 'flex'; 
        });
    });

    closeModalBtn.addEventListener('click', function () {
        ratingModalOverlay.style.display = 'none'; 
    });

    ratingModalOverlay.addEventListener('click', function (e) {
        if (e.target === ratingModalOverlay) {
            ratingModalOverlay.style.display = 'none';
        }
    });
});

function createRatingModal() {
 
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.querySelector('.close-modal-btn').addEventListener('click', closeRatingModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeRatingModal);
    document.querySelector('.submit-btn').addEventListener('click', submitRating);

    initializeStarRatings();
}

function openRatingModal() {
    const ratingModal = document.querySelector('.rating-modal-overlay');
    ratingModal.style.display = 'block';
    
    initializeStarRatings();
    
    document.querySelector('.close-modal-btn').addEventListener('click', closeRatingModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeRatingModal);
    document.querySelector('.submit-btn').addEventListener('click', submitRating);
}

function closeRatingModal() {
    const modal = document.querySelector('.rating-modal-overlay');
    modal.style.display = 'none';
}

function submitRating() {
    const productQuality = document.querySelector('[data-category="productQuality"]').getAttribute('data-rating') || 0;
    const sellerService = document.querySelector('[data-category="sellerService"]').getAttribute('data-rating') || 0;
    const deliveryService = document.querySelector('[data-category="deliveryService"]').getAttribute('data-rating') || 0;
    const review = document.getElementById('reviewText').value;

    console.log({
        productQuality,
        sellerService,
        deliveryService,
        review
    });

    showSuccessMessage('Thank you for rating this product!');
    closeRatingModal();
}

function initializeStarRatings() {
    document.querySelectorAll('.star-rating').forEach(starRating => {
        if (starRating.children.length === 0) {
            const category = starRating.getAttribute('data-category');
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.textContent = '★';
                star.classList.add('star');
                star.dataset.value = i;

                star.addEventListener('click', () => {
                    starRating.setAttribute('data-rating', i);
                    updateStarDisplay(starRating, i);
                });

                star.addEventListener('mouseenter', () => {
                    updateStarDisplay(starRating, i);
                });

                star.addEventListener('mouseleave', () => {
                    const currentRating = starRating.getAttribute('data-rating') || 0;
                    updateStarDisplay(starRating, currentRating);
                });

                starRating.appendChild(star);
            }
        }
    });
}

function updateStarDisplay(starRating, rating) {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}
       document.querySelectorAll('.rate-btn').forEach(button => {
    button.addEventListener('click', openRatingModal);
});

document.addEventListener('DOMContentLoaded', function () {
    const cancelModal = document.getElementById('cancelModal');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const notNowBtn = document.getElementById('notNowBtn');
    const cancelButtons = document.querySelectorAll('.cancel-order-btn'); 

    cancelButtons.forEach(button => {
        button.addEventListener('click', function () {
            cancelModal.style.display = 'flex'; 
        });
    });

    notNowBtn.addEventListener('click', function () {
        cancelModal.style.display = 'none'; 
    });

    cancelOrderBtn.addEventListener('click', function () {
        const selectedReason = document.querySelector('input[name="reason"]:checked');
        if (selectedReason) {
            cancelModal.style.display = 'none';
            showSuccessMessage('Order cancelled successfully'); 
        } else {
            alert('Please select a cancellation reason.'); 
        }
    });

    cancelModal.addEventListener('click', function (e) {
        if (e.target === cancelModal) {
            cancelModal.style.display = 'none';
        }
    });
});