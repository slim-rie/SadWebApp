document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    let redirectTarget = null;
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    const slider = document.querySelector('.product-slider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let scrollAmount = 350; 
    
    prevBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    userIcon.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#user-icon')) {
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            }
        }
    });
    
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    function openLoginModal(target = null) {
        redirectTarget = target;
        if (loginModal) {
            loginModal.style.display = 'flex';
            loginModal.classList.add('show-modal');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('show-modal');
            loginModal.style.display = 'none';
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
            .then(response => response.json())
            .then(data => {
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
            
            document.getElementById('sewingMachinesCard').onclick = function() {
                window.location.href = '/sewingmachines';
            };
            document.getElementById('sewingPartsCard').onclick = function() {
                window.location.href = '/sewingparts';
            };
            document.getElementById('fabricsCard').onclick = function() {
                window.location.href = '/fabrics';
            };
            
            heroShopNowBtn.onclick = function(event) {
                if (!isLoggedIn) {
                    event.preventDefault();
                    openLoginModal();
                    return false;
                } else {
                    window.location.href = '/sewingmachines';
                }
            };
            
            footerShopLink.onclick = function(e) {
                e.preventDefault();
                window.location.href = '/products?category=Sewing Machines';
            };
            
            shopNowLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    if (category === 'Sewing Machines') {
                        window.location.href = '/sewingmachines';
                    } else if (category === 'Sewing Parts') {
                        window.location.href = '/sewingparts';
                    } else if (category === 'Fabrics') {
                        window.location.href = '/fabrics';
                    } else {
                        window.location.href = '/';
                    }
                });
            });
            
            cartLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (isLoggedIn) {
                        window.location.href = '/cart';
                    } else {
                        openLoginModal('/cart');
                    }
                });
            });
            
        } else {
            usernameDisplay.textContent = '';
            usernameDisplay.style.display = 'none';
            
            dropdownMenu.innerHTML = `
                <button class="login-btn" id="loginBtn">LOGIN</button>
                <a href="${SIGNUP_URL}" class="signup-btn">SIGN UP</a>
            `;
            
            document.getElementById('loginBtn').addEventListener('click', function() {
                openLoginModal();
            });
            
            document.getElementById('sewingMachinesCard').onclick = function() {
                window.location.href = '/sewingmachines';
            };
            document.getElementById('sewingPartsCard').onclick = function() {
                window.location.href = '/sewingparts';
            };
            document.getElementById('fabricsCard').onclick = function() {
                window.location.href = '/fabrics';
            };
            
            heroShopNowBtn.onclick = function(event) {
                if (!isLoggedIn) {
                    event.preventDefault();
                    openLoginModal();
                    return false;
                } else {
                    window.location.href = '/sewingmachines';
                }
            };
            
            footerShopLink.onclick = function(e) {
                e.preventDefault();
                window.location.href = '/products?category=Sewing Machines';
            };
            
            shopNowLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    if (category === 'Sewing Machines') {
                        window.location.href = '/sewingmachines';
                    } else if (category === 'Sewing Parts') {
                        window.location.href = '/sewingparts';
                    } else if (category === 'Fabrics') {
                        window.location.href = '/fabrics';
                    } else {
                        window.location.href = '/';
                    }
                });
            });
            
            cartLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (isLoggedIn) {
                        window.location.href = '/cart';
                    } else {
                        openLoginModal('/cart');
                    }
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