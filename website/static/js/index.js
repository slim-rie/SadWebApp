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
            // Defensive: if this is the hero button, do nothing
            if (this.id === 'heroShopNowBtn') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // If this Shop Now button is in the fabrics section, always allow redirect
            if (this.closest('.fabrics-section')) {
                // Let the link work normally (redirect to fabrics)
                return;
            }
            // If this Shop Now button is in the Perfect Parts for Precision section, always allow redirect
            if (this.closest('.perfect-parts')) {
                // Let the link work normally (redirect to sp-productdetails)
                return;
            }
            // If the link is to login, show the modal instead
            const href = this.getAttribute('href');
            if (href && href.includes('/login')) {
                e.preventDefault();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('show-modal');
                    document.body.style.overflow = 'hidden';
                }
            } // else, let the link work normally
        });
    });

    const heroShopNowBtn = document.getElementById('heroShopNowBtn');
    if (heroShopNowBtn) {
        heroShopNowBtn.addEventListener('click', function(e) {
            // The href is set by backend, so just follow it
            // If not logged in, show modal
            const shopNowLink = document.querySelector('.shop-now-link');
            if (shopNowLink && shopNowLink.getAttribute('href').includes('/login')) {
                e.preventDefault();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('show-modal');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }
}); 