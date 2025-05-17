document.addEventListener('DOMContentLoaded', function() {
    // Sync localStorage with backend authentication state
    if (window.AUTH_STATE) {
        if (window.AUTH_STATE.isAuthenticated === 'true') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', window.AUTH_STATE.username);
        } else {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
        }
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const categoryDropdown = document.querySelector('.search-dropdown');
    const productCards = document.querySelectorAll('.product-card');

    function filterProducts() {
        const searchValue = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryDropdown.value;

        productCards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            let matchesSearch = !searchValue || name.includes(searchValue);
            let matchesCategory = selectedCategory === 'All';

            // Check category by card context (section title or parent)
            if (!matchesCategory) {
                if (selectedCategory === 'Fabrics' && card.closest('.fabrics-section')) {
                    matchesCategory = true;
                } else if (selectedCategory === 'Sewing Machines' && card.closest('.save-on-dream-machine')) {
                    matchesCategory = true;
                } else if (selectedCategory === 'Sewing Parts' && card.closest('.perfect-parts')) {
                    matchesCategory = true;
                }
            }

            if (matchesSearch && matchesCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput && searchBtn && categoryDropdown) {
        searchInput.addEventListener('input', filterProducts);
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            filterProducts();
        });
        categoryDropdown.addEventListener('change', filterProducts);
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    let redirectTarget = null;
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    const slider = document.querySelector('.product-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let scrollAmount = 350; 
    
    if (prevBtn && slider) {
    prevBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    }
    
    if (nextBtn && slider) {
    nextBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    }
    
    const userIcon = document.getElementById('user-icon');
    const userInfo = document.getElementById('userInfo');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (userIcon) {
        userIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
    if (userInfo) {
        userInfo.addEventListener('click', function(event) {
            event.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    }
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.user-dropdown')) {
                dropdownMenu.style.display = 'none';
        }
    });
    
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    function openLoginModal(target = null) {
        if (!isLoggedIn) {
            redirectTarget = target;
            if (loginModal) {
                loginModal.classList.add('show-modal');
                document.body.style.overflow = 'hidden';
            }
        } else if (target) {
            window.location.href = target;
        }
    }
    
    function closeLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('show-modal');
            document.body.style.overflow = '';
            if (loginError) {
                loginError.textContent = '';
            }
            if (loginForm) {
                loginForm.reset();
            }
        }
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput
                })
            })
            .then(async response => {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (data.success) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('username', 'customer');
                        updateUIForLoginStatus(true, 'customer');
                        closeLoginModal();
                        
                        if (redirectTarget) {
                            window.location.href = redirectTarget;
                        }
                    } else {
                        if (loginError) {
                            loginError.textContent = data.message || 'Invalid username or password';
                        }
                    }
                } else {
                    const text = await response.text();
                    if (loginError) {
                        loginError.textContent = 'Login failed: ' + text;
                    }
                }
            })
            .catch(error => {
                if (loginError) {
                    loginError.textContent = 'Login failed: ' + error;
                }
            });
        });
    }
    
    if (closeModal) {
        closeModal.onclick = closeLoginModal;
    }
    
    if (modalOverlay) {
        modalOverlay.onclick = closeLoginModal;
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('show-modal')) {
            closeLoginModal();
        }
    });
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        updateUIForLoginStatus(false, null);
        window.location.href = '/';
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
    
    function updateUIForLoginStatus(isLoggedIn, username) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const heroShopNowBtn = document.getElementById('heroShopNowBtn');
        const footerShopLink = document.getElementById('footerShopLink');
        const shopNowLinks = document.querySelectorAll('.shop-now-link');
        const cartLinks = document.querySelectorAll('.cart-icon');
        const categoryCards = document.querySelectorAll('.category-card');
        const sewingMachinesCard = document.getElementById('sewingMachinesCard');
        const sewingPartsCard = document.getElementById('sewingPartsCard');
        const fabricsCard = document.getElementById('fabricsCard');
        
        if (isLoggedIn && username) {
            if (usernameDisplay) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';
            }
            if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <a href="/my-account" class="dropdown-item">My Account</a>
                <a href="/orders" class="dropdown-item">Orders</a>
                <a href="/logout" class="dropdown-item" id="logoutBtn">Logout</a>
            `;
            }
            if (sewingMachinesCard) sewingMachinesCard.onclick = function() { window.location.href = '/sewingmachines'; };
            if (sewingPartsCard) sewingPartsCard.onclick = function() { window.location.href = '/sewingparts'; };
            if (fabricsCard) fabricsCard.onclick = function() { window.location.href = '/fabrics'; };
            if (heroShopNowBtn) heroShopNowBtn.onclick = function(event) { window.location.href = '/sewingmachines'; };
            if (footerShopLink) footerShopLink.onclick = function(e) { e.preventDefault(); window.location.href = '/products?category=Sewing Machines'; };
            if (shopNowLinks) shopNowLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    const fabric = this.getAttribute('data-fabric');
                    if (category === 'Sewing Machines') {
                        window.location.href = '/sewingmachines';
                    } else if (category === 'Sewing Parts') {
                        window.location.href = '/sewingparts';
                    } else if (category === 'Fabrics') {
                        window.location.href = '/fabrics';
                    } else if (fabric) {
                        window.location.href = `/fabrics?highlight=${encodeURIComponent(fabric)}`;
                    } else {
                        window.location.href = '/';
                    }
                });
            });
            if (cartLinks) cartLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = '/cart';
                });
            });
        } else {
            if (usernameDisplay) {
            usernameDisplay.textContent = '';
            usernameDisplay.style.display = 'none';
            }
            if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <button class="login-btn" id="loginBtn">LOGIN</button>
                <a href="${SIGNUP_URL}" class="signup-btn">SIGN UP</a>
            `;
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn) {
                    loginBtn.addEventListener('click', function() { openLoginModal(); });
                }
            }
            if (sewingMachinesCard) sewingMachinesCard.onclick = function() { openLoginModal('/sewingmachines'); };
            if (sewingPartsCard) sewingPartsCard.onclick = function() { openLoginModal('/sewingparts'); };
            if (fabricsCard) fabricsCard.onclick = function() { openLoginModal('/fabrics'); };
            if (heroShopNowBtn) heroShopNowBtn.onclick = function(event) { event.preventDefault(); openLoginModal('/sewingmachines'); };
            if (footerShopLink) footerShopLink.onclick = function(e) { e.preventDefault(); openLoginModal('/products?category=Sewing Machines'); };
            if (shopNowLinks) shopNowLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    const fabric = this.getAttribute('data-fabric');
                    if (category === 'Sewing Machines') {
                        openLoginModal('/sewingmachines');
                    } else if (category === 'Sewing Parts') {
                        openLoginModal('/sewingparts');
                    } else if (category === 'Fabrics') {
                        openLoginModal('/fabrics');
                    } else if (fabric) {
                        openLoginModal(`/fabrics?highlight=${encodeURIComponent(fabric)}`);
                    } else {
                        openLoginModal('/');
                    }
                });
            });
            if (cartLinks) cartLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    openLoginModal('/cart');
                });
            });
        }
    }
    
    if (!isLoggedIn) {
        const loginBtns = document.querySelectorAll('.open-login-modal, #loginBtn');
        loginBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openLoginModal();
            });
        });
    }

    const cartLink = document.querySelector('.cart-link');

    cartLink.addEventListener('click', function (e) {
        e.preventDefault(); 

        if (isLoggedIn) {
            window.location.href = '/cart';
        } else {
            openLoginModal('/cart');
        }
    });

    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/google-oauth-login';
        });
    }

    // Scroll and highlight logic for homepage categories
    const hash = window.location.hash;
    if (hash && hash.startsWith('#category-')) {
        const category = hash.replace('#category-', '');
        const categoriesSection = document.querySelector('.categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Highlight the selected category card
        document.querySelectorAll('.category-card').forEach(card => {
            if (card.dataset.category === category) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
});

// Global click handler for product links
document.addEventListener('click', function(e) {
    const link = e.target.closest('.product-link');
    // Don't intercept sign-up links
    if (e.target.closest('a[href="/sign-up"]')) {
        return true;
    }
    // --- BYPASS LOGIN MODAL FOR FABRICS OF THE SEASON SHOP NOW BUTTONS ---
    if (link && link.closest('.fabrics-section')) {
        // Let the redirect happen
        return true;
    }
    // --- BYPASS LOGIN MODAL FOR PERFECT PARTS SHOP NOW BUTTONS ---
    if (link && link.closest('.perfect-parts')) {
        // Let the redirect happen
        return true;
    }
    if (link) {
        const isAuthenticated = link.getAttribute('data-authenticated') === '1';
        if (!isAuthenticated) {
            e.preventDefault();
            e.stopPropagation();
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.classList.add('show-modal');
                document.body.style.overflow = 'hidden';
            }
            return false; // Prevent any further handling
        }
    }
}, true);

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'googleLoginBtn') {
        e.preventDefault();
        window.location.href = '/google-oauth-login';
    }
});

document.addEventListener('click', function(e) {
    const cartIcon = e.target.closest('.cart-icon');
    if (cartIcon && cartIcon.hasAttribute('data-product-id')) {
        e.preventDefault();
        const isAuthenticated = cartIcon.getAttribute('data-authenticated') === '1';
        const productId = cartIcon.getAttribute('data-product-id');
        if (!isAuthenticated) {
            openLoginModal('/cart');
            return;
        }
        // AJAX add to cart
        fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Added to cart!');
                // Optionally update cart count here
            } else {
                alert(data.message || 'Failed to add to cart.');
            }
        })
        .catch(() => alert('Failed to add to cart.'));
    }
}, true);