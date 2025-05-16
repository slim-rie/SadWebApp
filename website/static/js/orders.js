// Read orders data from the hidden script tag
let orders = [];
const ordersDataTag = document.getElementById('orders-data');
if (ordersDataTag) {
    try {
        orders = JSON.parse(ordersDataTag.textContent);
    } catch (e) {
        console.error('Failed to parse orders data:', e);
    }
}
window.orders = orders; // If you want to keep it globally accessible

console.log('DEBUG: orders loaded from backend:', window.orders);

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
    
    // Get orders from the server
    const orders = window.orders || [];
    
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
                <div class="order-card" data-order-id="${order.id}">
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
                        ${order.paymentMethod ? `<p>Payment Method: ${order.paymentMethod}</p>` : ''}
                    </div>
                    <div class="order-actions">
                `;
                
                const mappedStatus = mapStatus(order.status);
                if (mappedStatus === 'completed') {
                    orderHtml += `
                        <button class="action-btn rate-btn">Rate</button>
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                } else if (mappedStatus === 'pending' || mappedStatus === 'to-pay') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                        <button class="action-btn cancel-order-btn">Cancel Order</button>
                    `;
                } else if (mappedStatus === 'to-ship' || mappedStatus === 'shipped' || mappedStatus === 'to-receive' || mappedStatus === 'delivered' || mappedStatus === 'cancelled' || mappedStatus === 'refunded') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn track-order-btn">Track Order</button>
                        <button class="action-btn order-received-btn">Order Received</button>
                    `;
                }
                
                orderHtml += `
                    </div>
                `;
            });
            
            orderHtml += `</div>`;
            container.innerHTML += orderHtml;
        });
        
        // Add event listeners for buttons
        addButtonEventListeners();
    }
    
    function addButtonEventListeners() {
        document.querySelectorAll('.contact-seller-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (isLoggedIn) {
                    openChatModal();
                } else {
                    openLoginModal();
                }
            });
        });
        
        document.querySelectorAll('.buy-again-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                window.location.href = '/cart';
            });
        });
        
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                console.log('Cancel Order button clicked:', event, btn);
                const orderCard = btn.closest('.order-card');
                const orderId = orderCard ? orderCard.getAttribute('data-order-id') : null;
                if (!orderId) {
                    alert('Order ID not found.');
                    return;
                }
                document.getElementById('cancelModalOverlay').style.display = 'flex';
            });
        });
        
        document.querySelectorAll('.track-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.closest('.order-card').getAttribute('data-order-id');
                if (orderId) {
                    window.location.href = `/trackorder/${orderId}`;
                }
            });
        });

        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                window.location.href = '/transaction';
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderCard = btn.closest('.order-card');
                const orderId = orderCard ? orderCard.getAttribute('data-order-id') : null;
                if (orderId) {
                    window.location.href = `/cancel-order-details?order_id=${orderId}`;
                } else {
                    window.location.href = '/cancel-order-details';
                }
            });
        });

        document.querySelectorAll('.order-received-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderCard = btn.closest('.order-card');
                const orderId = orderCard ? orderCard.getAttribute('data-order-id') : null;
                if (!orderId) {
                    alert('Order ID not found.');
                    return;
                }
                btn.disabled = true;
                btn.textContent = 'Processing...';
                fetch(`/api/orders/${orderId}/received`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        btn.textContent = 'Received';
                        btn.classList.add('received');
                        showSuccessMessage('Order marked as received!');
                        // Optionally, update the order status in the UI
                        const statusText = orderCard.querySelector('.status-text');
                        if (statusText) statusText.textContent = 'Parcel has been delivered';
                        const statusBadge = orderCard.querySelector('.status-badge');
                        if (statusBadge) {
                            statusBadge.textContent = 'COMPLETED';
                            statusBadge.className = 'status-badge completed';
                        }
                    } else {
                        btn.disabled = false;
                        btn.textContent = 'Order Received';
                        alert(data.message || 'Failed to mark order as received.');
                    }
                })
                .catch(() => {
                    btn.disabled = false;
                    btn.textContent = 'Order Received';
                    alert('Network error. Please try again.');
                });
            });
        });

        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderCard = btn.closest('.order-card');
                if (!orderCard) return;
                // Find the first product in this order
                const orderId = orderCard.getAttribute('data-order-id');
                const order = (window.orders || []).find(o => o.id == orderId);
                if (order && order.products && order.products.length > 0) {
                    console.log('DEBUG: First product in order:', order.products[0]); // Debug log
                    const productId = order.products[0].id;
                    window.location.href = `/product/${productId}`;
                } else {
                    alert('Product not found for this order.');
                }
            });
        });
    }
    
    // Initial load of all orders
    loadOrders();
    
    // Tab click handlers
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadOrders(this.getAttribute('data-tab'));
        });
    });
    
    // Search functionality
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
        
        // Display filtered orders
        filteredOrders.forEach(order => {
            let orderHtml = `<div class="order-card" data-order-id="${order.id}">`;
            
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
                
                const mappedStatus = mapStatus(order.status);
                if (mappedStatus === 'completed') {
                    orderHtml += `
                        <button class="action-btn rate-btn">Rate</button>
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                    `;
                } else if (mappedStatus === 'pending' || mappedStatus === 'to-pay') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn buy-again-btn">Buy Again</button>
                        <button class="action-btn cancel-order-btn">Cancel Order</button>
                    `;
                } else if (mappedStatus === 'to-ship' || mappedStatus === 'shipped' || mappedStatus === 'to-receive' || mappedStatus === 'delivered' || mappedStatus === 'cancelled' || mappedStatus === 'refunded') {
                    orderHtml += `
                        <button class="action-btn contact-seller-btn">Contact Seller</button>
                        <button class="action-btn track-order-btn">Track Order</button>
                        <button class="action-btn order-received-btn">Order Received</button>
                    `;
                }
                
                orderHtml += `
                    </div>
                `;
            });
            
            orderHtml += `</div>`;
            container.innerHTML += orderHtml;
        });
        
        // Add event listeners for the filtered orders
        addButtonEventListeners();
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

    let cancelOrderId = null;

    // Show modal when Cancel Order is clicked
    // Use event delegation for dynamically loaded buttons
    // Place this inside DOMContentLoaded

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cancel-order-btn')) {
            const orderCard = e.target.closest('.order-card');
            cancelOrderId = orderCard ? orderCard.getAttribute('data-order-id') : null;
            if (!cancelOrderId) {
                alert('Order ID not found.');
                return;
            }
            document.getElementById('cancelModalOverlay').style.display = 'flex';
        }
    });

    // Hide modal on Not Now
    const cancelModalNotNowBtn = document.getElementById('cancelModalNotNowBtn');
    if (cancelModalNotNowBtn) {
        cancelModalNotNowBtn.addEventListener('click', function() {
            document.getElementById('cancelModalOverlay').style.display = 'none';
            cancelOrderId = null;
            document.getElementById('cancelForm').reset();
            document.getElementById('confirmCancelBtn').disabled = true;
            document.getElementById('otherText').style.display = 'none';
        });
    }

    // Enable/disable Cancel Order button and show/hide Other text
    const cancelForm = document.getElementById('cancelForm');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const otherRadio = document.getElementById('otherRadio');
    const otherText = document.getElementById('otherText');

    if (cancelForm) {
        cancelForm.addEventListener('change', function() {
            const checked = cancelForm.querySelector('input[name="cancel_reason"]:checked');
            confirmCancelBtn.disabled = !checked;
            if (checked && checked.value === 'Other') {
                otherText.style.display = 'inline-block';
                otherText.required = true;
            } else {
                otherText.style.display = 'none';
                otherText.required = false;
            }
        });
    }

    // Confirm cancellation
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', function() {
            const reasonInput = cancelForm.querySelector('input[name="cancel_reason"]:checked');
            let reason = reasonInput ? reasonInput.value : '';
            if (reason === 'Other') {
                reason = otherText.value.trim();
                if (!reason) {
                    otherText.focus();
                    return;
                }
            }
            if (!reason) {
                alert('Please select a cancellation reason.');
                return;
            }
            fetch('/api/cancel_order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: cancelOrderId, reason: reason })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessMessage('Order cancelled successfully');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    alert(data.message);
                }
            });
            document.getElementById('cancelModalOverlay').style.display = 'none';
            cancelOrderId = null;
            cancelForm.reset();
            confirmCancelBtn.disabled = true;
            otherText.style.display = 'none';
        });
    }

    // Tracking modal close logic
    const trackingModal = document.getElementById('trackingModal');
    const closeTrackingModalBtn = document.getElementById('closeTrackingModal');

    if (closeTrackingModalBtn && trackingModal) {
        closeTrackingModalBtn.addEventListener('click', function() {
            trackingModal.style.display = 'none';
        });
    }

    // Optional: close when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === trackingModal) {
            trackingModal.style.display = 'none';
        }
    });

    // Prevent accidental modal opening on page load
    document.getElementById('cancelModalOverlay').style.display = 'none';
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

// Map backend status to frontend status
function mapStatus(status) {
    const mapping = {
        'Order Confirmed': 'pending',
        'Order Placed': 'pending',
        'To Ship': 'to-ship',
        'To Pay': 'pending',
        'Shipped': 'shipped',
        'To Receive': 'to-receive',
        'Delivered': 'completed',
        'Completed': 'completed',
        'Cancelled': 'cancelled',
        'Canceled': 'cancelled',
        'Return/Refund': 'return-refund',
        // Add more as needed
    };
    return mapping[status] || status;
}