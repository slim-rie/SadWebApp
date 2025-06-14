document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('productGrid');
    const categoryItems = document.querySelectorAll('.category-list li');
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
    const categoriesModalLinks = document.querySelectorAll('.categories-grid a');
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const priceDropdownBtn = priceDropdown.querySelector('.dropdown-toggle');

    let currentFilters = {
        category: 'Shunfa Industrial Sewing Machines',
        rating: 0,
        minPrice: 0,
        maxPrice: Infinity,
        sort: 'popular'
    };

    let products = [];

    // Load products from API
    async function loadProducts() {
        try {
            console.log('[DEBUG] Fetching products for category:', currentFilters.category);
            const response = await fetch(`/api/products?category=${encodeURIComponent(currentFilters.category)}`);
            const data = await response.json();
            products = Array.isArray(data) ? data : [];
            renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<div class="no-products">Error loading products. Please try again later.</div>';
        }
    }

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
                    const aSold = typeof a.sold_count !== 'undefined' ? a.sold_count : 0;
                    const bSold = typeof b.sold_count !== 'undefined' ? b.sold_count : 0;
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
            const productLink = document.createElement('a');
            productLink.href = `/sm-productdetails?product_id=${product.product_id}`;
            productLink.className = 'product-card';

            const starsHTML = generateStarsHTML(product.rating);
            
            productLink.innerHTML = `
                <div class="product-badge">
                    ${product.discount ? `<span class="discount-badge">-${product.discount}</span>` : ''}
                    ${product.refurbished ? `<span class="refurbished-badge">Refurbished</span>` : ''}
                </div>
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₱ ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="product-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                        <span class="sold-count">${typeof product.sold_count !== 'undefined' ? product.sold_count : 0} sold</span>
                    </div>
                </div>
            `;
            productGrid.appendChild(productLink);
        });
        
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="no-products">No products match your filters. Try adjusting your criteria.</div>';
        }
    }

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

    // Load products when page loads
    loadProducts();

    function highlightActiveCategory(categoryName) {
        document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
        const link = document.querySelector(`.category-list li a[data-category="${categoryName}"]`);
        if (link) {
            link.parentElement.classList.add('active');
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // On first load, force Shunfa as the default
        currentFilters.category = 'Shunfa Industrial Sewing Machines';
        highlightActiveCategory(currentFilters.category);
        // Update breadcrumb to match
        const breadcrumbCategory = document.getElementById('selectedCategory');
        if (breadcrumbCategory) {
            breadcrumbCategory.textContent = 'Shunfa Industrial Sewing Machines';
        }
        loadProducts();
    });

    const categoryLinks = document.querySelectorAll('.category-list li a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            currentFilters.category = category;
            highlightActiveCategory(category);
            loadProducts();
        });
    });

    ratingItems.forEach(item => {
        item.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            // If already selected, unselect and show all
            if (currentFilters.rating === rating) {
                ratingItems.forEach(el => el.classList.remove('active'));
                currentFilters.rating = 0;
                renderProducts();
            } else {
                ratingItems.forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                currentFilters.rating = rating;
                renderProducts();
            }
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

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            currentFilters.sort = sort;
            renderProducts();
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
        // Close the modal if open
        categoriesModal.style.display = 'none';
        // Redirect to index.html and scroll to categories section
        window.location.href = '/#category-Categories';
    });

    closeCategories.addEventListener('click', function() {
        categoriesModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === categoriesModal) {
            categoriesModal.style.display = 'none';
        }
    });

    categoriesModalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            currentFilters.category = category;
            highlightActiveCategory(category);
            loadProducts();
            categoriesModal.style.display = 'none';
        });
    });

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
    
    loginBtn.addEventListener('click', function() {
        loginModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    });
    
    closeModal.addEventListener('click', function() {
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });
    
    modalOverlay.addEventListener('click', function() {
        loginModal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    });

    // Remove duplicate event listeners for price dropdown
    if (priceDropdownBtn && priceDropdownMenu) {
        priceDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            priceDropdownMenu.classList.toggle('show');
        });
        window.addEventListener('click', function(e) {
            if (!priceDropdown.contains(e.target)) {
                priceDropdownMenu.classList.remove('show');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const breadcrumbCategory = document.getElementById('selectedCategory');
    const categoryItems = document.querySelectorAll('.category-list li');

    categoryItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const categoryName = this.querySelector('a').textContent.trim();
            breadcrumbCategory.textContent = categoryName;
        });
    });
});

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