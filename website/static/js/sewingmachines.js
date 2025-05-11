document.addEventListener('DOMContentLoaded', function() {
    const products = {
        Shunfa: [
            {
                name: "SHUNFA SF-5550 Single needle highspeed machine",
                price: 8450.75,
                rating: 4.8,
                sold: "800",
                image: "/static/pictures/SHUNFA SF-5550 Single needle highspeed machine.jpg",
                discount: "10%",
                refurbished: false
            },
            {
                name: "SHUNFA SF-562-O2BB Piping machine",
                price: 6299.99,
                rating: 4.2,
                sold: "545",
                image: "/static/pictures/SHUNFA SF-562-O2BB Piping machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA SF-372 Buttonsew machine",
                price: 9999.99,
                rating: 3.5,
                sold: "320",
                image: "/static/pictures/SHUNFA SF-372 Buttonsew machine.jpg",
                discount: "5%",
                refurbished: false
            },
            {
                name: "SHUNFA SF-781 Buttonholer machine",
                price: 4250.50,
                rating: 4.0,
                sold: "682",
                image: "/static/pictures/SHUNFA SF-781 Buttonholer machine.jpg",
                discount: "15%",
                refurbished: false
            },
            {
                name: "SHUNFA SF-737 3 threads overlock machine",
                price: 18550.25,
                rating: 4.7,
                sold: "158",
                image: "/static/pictures/SHUNFA SF-737 3 threads overlock machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA SF-747 4 threads overlock machine",
                price: 12450.75,
                rating: 3.8,
                sold: "224",
                image: "/static/pictures/SHUNFA SF-747 4 threads overlock machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA SF-757 5 threads overlock machine",
                price: 12450.75,
                rating: 3.8,
                sold: "224",
                image: "/static/pictures/SHUNFA SF-757 5 threads overlock machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA JA2-2 Household sewing machine",
                price: 12450.75,
                rating: 3.8,
                sold: "224",
                image: "/static/pictures/SHUNFA JA2-2 Household sewing machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA JH563 Portable sewing machine",
                price: 12450.75,
                rating: 3.8,
                sold: "224",
                image: "/static/pictures/SHUNFA JH563 Portable sewing machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA SF-26-1A Portable bag closer",
                price: 12450.75,
                rating: 3.8,
                sold: "224",
                image: "/static/pictures/SHUNFA SF-26-1A Portable bag closer.png",
                discount: null,
                refurbished: false
            },
            {
                name: "SHUNFA GK-9A Portable bag closer",
                price: 12450.75,
                rating: 3.8,
                sold: "224",
                image: "/static/pictures/SHUNFA GK-9A Portable bag closer.jpg",
                discount: null,
                refurbished: false
            }
        ],
        Juki: [
            {
                name: "JUKI DDL 8100 Highspeed machine",
                price: 24650.99,
                rating: 5.0,
                sold: "78",
                image: "/static/pictures/JUKI DDL 8100 Highspeed machine.jpg",
                discount: null,
                refurbished: false
            },
            {
                name: "JUKI MO-6700 Series Edger machine",
                price: 18750.45,
                rating: 4.7,
                sold: "102",
                image: "/static/pictures/JUKI MO-6700 Series Edger machine.jpg",
                discount: "8%",
                refurbished: false
            }
        ]
    };

   
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

    let currentFilters = {
        category: 'Shunfa',
        rating: 0,
        minPrice: 0,
        maxPrice: Infinity,
        sort: 'popular'
    };

    function renderProducts() {
        productGrid.innerHTML = '';
        
        let filteredProducts = [...products[currentFilters.category] || []];
        
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
                    const aSold = parseInt(a.sold.replace('K', '000'));
                    const bSold = parseInt(b.sold.replace('K', '000'));
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
            productLink.href = isLoggedIn ? 
                `sm-productdetails.html?product=${encodeURIComponent(product.name)}` : 
                'javascript:void(0)'; // Use javascript:void(0) instead of # to prevent URL changes
            
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
                    ${product.discount ? `<span class="discount-badge">-${product.discount}</span>` : ''}
                    ${product.refurbished ? `<span class="refurbished-badge">Refurbished</span>` : ''}
                </div>
                <img src="${product.image}" alt="${product.name}">
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
            productGrid.appendChild(productLink);
        });
        
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="no-products">No products match your filters. Try adjusting your criteria.</div>';
        }
    }

    renderProducts();

    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            categoryItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            
            currentFilters.category = category;
            renderProducts();
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

    allCategoriesBtn.addEventListener('click', function () {
        const modalContent = document.querySelector('.categories-modal-content');
        modalContent.innerHTML = '';

        modalContent.innerHTML = `
            <section class="categories container">
                <h2>Categories</h2>
                <div class="category-grid">
                    <div class="category-card" id="sewingMachinesCard">
                        <img src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=600" alt="Sewing Machines">
                        <div class="category-overlay">
                            <div class="category-content">
                                <span class="category-icon">✂️</span>
                                <h3>Sewing Machines</h3>
                            </div>
                        </div>
                    </div>

                    <div class="category-card" id="sewingPartsCard">
                        <img src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600" alt="Sewing Parts">
                        <div class="category-overlay">
                            <div class="category-content">
                                <span class="category-icon">⚙️</span>
                                <h3>Sewing Parts</h3>
                            </div>
                        </div>
                    </div>

                    <div class="category-card" id="fabricsCard">
                        <img src="https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&q=80&w=600" alt="Fabrics">
                        <div class="category-overlay">
                            <div class="category-content">
                                <span class="category-icon">🧵</span>
                                <h3>Fabrics</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        categoriesModal.classList.add('show-modal');
    });

    closeCategories.addEventListener('click', function() {
        categoriesModal.classList.remove('show-modal');
    });

    document.querySelector('#categoriesModal .modal-overlay').addEventListener('click', function() {
        categoriesModal.classList.remove('show-modal');
    });

    categoriesModalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            if (products[category]) {
                categoryItems.forEach(item => {
                    if (item.getAttribute('data-category') === category) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                currentFilters.category = category;
                renderProducts();
            }
            
            categoriesModal.classList.remove('show-modal');
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