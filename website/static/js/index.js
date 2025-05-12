document.addEventListener('DOMContentLoaded', function () {
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

    searchInput.addEventListener('input', filterProducts);
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        filterProducts();
    });
    categoryDropdown.addEventListener('change', filterProducts);

    // Shop Now button logic
    const shopNowLinks = document.querySelectorAll('.shop-now-link');
    shopNowLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.id === 'heroShopNowBtn') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            if (this.closest('.fabrics-section')) {
                return;
            }
            if (this.closest('.perfect-parts')) {
                return;
            }
            const href = this.getAttribute('href');
            if (href && href.includes('/login')) {
                e.preventDefault();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('show-modal');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    const shopNowBtn = document.getElementById('heroShopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function (event) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                event.preventDefault();
                event.stopPropagation();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('show-modal');
                    document.body.style.overflow = 'hidden';
                }
                return false;
            } else {
                window.location.href = '/sewingmachines';
            }
        });
    }
}); 