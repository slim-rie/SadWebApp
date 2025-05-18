document.addEventListener('DOMContentLoaded', async function () {
    let products = [];
    try {
        const response = await fetch('/api/products?category=Sewing Parts');
        products = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
    }

    // DOM elements
    const productGrid = document.getElementById('productGrid');
    const categoryLinks = document.querySelectorAll('.category-list li a, .categories-grid a');
    const ratingItems = document.querySelectorAll('.rating-item');
    const sortButtons = document.querySelectorAll('.sort-btn:not(.dropdown-toggle)');
    const priceDropdown = document.getElementById('priceDropdown');
    const priceDropdownMenu = document.getElementById('priceDropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const applyPriceBtn = document.getElementById('applyPriceBtn');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const allCategoriesBtn = document.getElementById('allCategoriesBtn');
    const categoriesModal = document.getElementById('categoriesModal');
    const closeCategories = document.getElementById('closeCategories');
    const breadcrumbCategory = document.getElementById('selectedCategory');

    let currentFilters = {
        category: 'SewingMachineComponents',
        rating: 0,
        minPrice: 0,
        maxPrice: Infinity,
        sort: 'popular'
    };

    function renderProducts() {
        productGrid.innerHTML = '';
        
        let filteredProducts = [...products];
        
        if (currentFilters.rating > 0) {
            filteredProducts = filteredProducts.filter(product => product.rating >= currentFilters.rating);
        }
        
        filteredProducts = filteredProducts.filter(product => 
            product.price >= currentFilters.minPrice && product.price <= currentFilters.maxPrice
        );
        
        switch(currentFilters.sort) {
            case 'popular':
                break;
            case 'latest':
                filteredProducts.reverse();
                break;
            case 'topsales':
                filteredProducts.sort((a, b) => {
                    const aSold = parseInt(a.sold || '0');
                    const bSold = parseInt(b.sold || '0');
                    return bSold - aSold;
                });
                break;
            case 'low-high':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'high-low':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
        }
        
        filteredProducts.forEach(product => {
            // Determine authentication status
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            // Build the product link (entire card is clickable)
            const productLink = document.createElement('a');
            productLink.className = 'product-card product-link';
            productLink.setAttribute('data-authenticated', isLoggedIn ? '1' : '0');
            if (isLoggedIn) {
                productLink.href = `/sp-productdetails?product_id=${product.product_id}&category=Sewing%20Parts`;
            } else {
                productLink.href = '#'; // Will be intercepted by global handler
            }

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

            productLink.innerHTML = `
                <div class="product-badge">
                    ${product.discount ? `<span class=\"discount-badge\">-${product.discount}</span>` : ''}
                    ${product.refurbished ? `<span class=\"refurbished-badge\">Refurbished</span>` : ''}
                </div>
                ${product.image ? `<img src=\"${product.image}\" alt=\"${product.name}\">` : ''}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₱ ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="product-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                        <span class="sold-count">${product.sold ? product.sold : 0} sold</span>
                    </div>
                </div>
            `;
            productGrid.appendChild(productLink);
        });
        
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="no-products">No products match your filters. Try adjusting your criteria.</div>';
        }
        
        updateCategoryHighlighting();
    }
    
    function updateCategoryHighlighting() {
        document.querySelectorAll('.category-list li a').forEach(link => {
            const category = link.getAttribute('data-category');
            if (category === currentFilters.category) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });
        
        document.querySelectorAll('.categories-grid a').forEach(link => {
            const category = link.getAttribute('data-category');
            if (category === currentFilters.category) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    const defaultCategoryLink = document.querySelector(`.category-list li a[data-category="${currentFilters.category}"]`);
    if (defaultCategoryLink) {
        defaultCategoryLink.parentElement.classList.add('active');
    }
    renderProducts();

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            currentFilters.category = category;
            renderProducts();
            
            categoriesModal.classList.remove('show-modal');
            const categoryName = this.textContent.trim();
            breadcrumbCategory.textContent = categoryName;
        });
    });

    ratingItems.forEach(item => {
        item.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));

            ratingItems.forEach(ri => {
                ri.classList.remove('active');
            });

            this.classList.add('active');

            currentFilters.rating = rating;
            renderProducts();
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            
            sortButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilters.sort = sort;
            renderProducts();
        });
    });

    priceDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        priceDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function() {
        priceDropdownMenu.classList.remove('show');
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            
            currentFilters.sort = sort;
            renderProducts();
            
            priceDropdown.querySelector('.dropdown-toggle').innerHTML = 
                this.textContent + ' <i class="fas fa-chevron-down"></i>';
        });
    });

    applyPriceBtn.addEventListener('click', function() {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        
        currentFilters.minPrice = minPrice;
        currentFilters.maxPrice = maxPrice;
        renderProducts();
    });

    allCategoriesBtn.addEventListener('click', function() {
        categoriesModal.classList.add('show-modal');
    });

    if (closeCategories) {
        closeCategories.addEventListener('click', function() {
            categoriesModal.classList.remove('show-modal');
        });
    }

    const modalOverlay = document.querySelector('#categoriesModal .modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            categoriesModal.classList.remove('show-modal');
        });
    }

    // Ensure the correct category is highlighted on load
    document.addEventListener('DOMContentLoaded', function() {
        updateCategoryHighlighting();
    });
});

// User authentication UI
document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    const userIcon = document.getElementById('user-icon');
    const usernameDisplay = document.createElement('span');
    const dropdownMenu = document.getElementById('dropdownMenu');

    usernameDisplay.className = 'username';
    userIcon.parentNode.insertBefore(usernameDisplay, userIcon.nextSibling);

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

            dropdownMenu.innerHTML = `
                <button class="login-btn" id="loginBtn">LOGIN</button>
                <a href="${SIGNUP_URL}" class="signup-btn">SIGN UP</a>
            `;

            document.getElementById('loginBtn').addEventListener('click', openLoginModal);
        }
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = '/';
    }

    function openLoginModal() {
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    }

    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    closeModal.addEventListener('click', function () {
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });
    modalOverlay.addEventListener('click', function () {
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });

    updateUIForLoginStatus(isLoggedIn, username);
});