// subcategory_sb.js
// Handles Supplier subcategory sidebar logic

document.addEventListener('DOMContentLoaded', function() {
    const supplierTabBtn = document.getElementById('supplier-tab-btn');
    const subcategorySidebar = document.getElementById('supplier-subcategory-sidebar');
    const subcategoryItems = document.querySelectorAll('.subcategory-item');
    const mainNavItems = document.querySelectorAll('.nav-item');

    // Section containers
    const supplyRequestSection = document.getElementById('supply-request-section');
    const suppliersInfoSection = document.getElementById('suppliers-info-section');
    const suppliersProductsSection = document.getElementById('suppliers-products-section');

    // Show/hide subcategory sidebar on Supplier nav click
    supplierTabBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (subcategorySidebar.style.display === 'none') {
            subcategorySidebar.style.display = 'block';
        } else {
            subcategorySidebar.style.display = 'none';
        }
    });

    // Hide subcategory sidebar when clicking other main nav items
    mainNavItems.forEach(function(item) {
        if (item !== supplierTabBtn) {
            item.addEventListener('click', function() {
                subcategorySidebar.style.display = 'none';
            });
        }
    });

    // Subcategory item click logic
    subcategoryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Remove active from all
            subcategoryItems.forEach(i => i.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');

            // Hide all supplier sub-sections
            supplyRequestSection.style.display = 'none';
            suppliersInfoSection.style.display = 'none';
            suppliersProductsSection.style.display = 'none';

            // Show only the selected section
            if (item.id === 'supply-request-table') {
                supplyRequestSection.style.display = 'block';
            } else if (item.id === 'supplier-info-table') {
                suppliersInfoSection.style.display = 'block';
            } else if (item.id === 'supplier-product-mgmt-table') {
                suppliersProductsSection.style.display = 'block';
            }
        });
    });

    // Optional: Hide subcategory sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!subcategorySidebar.contains(event.target) && event.target !== supplierTabBtn) {
            subcategorySidebar.style.display = 'none';
        }
    });
});

// Product Subcategory
document.addEventListener('DOMContentLoaded', function() {
    const productTabBtn = document.getElementById('product-tab-btn');
    const subcategorySidebar = document.getElementById('product-subcategory-sidebar');
    const subcategoryItems = document.querySelectorAll('#product-subcategory-sidebar .subcategory-item');
    const mainNavItems = document.querySelectorAll('.nav-item');

    // Section containers
    const productsSection = document.getElementById('products-section');
    const productsImageSection = document.getElementById('products-image-section');
    const productsSpecificationSection = document.getElementById('products-specification-section');
    const productsVariantsSection = document.getElementById('products-variant-section');
    const productsCategoriesSection = document.getElementById('products-categories-section');

    // Show/hide subcategory sidebar on Product nav click
    productTabBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (subcategorySidebar.style.display === 'none') {
            subcategorySidebar.style.display = 'block';
        } else {
            subcategorySidebar.style.display = 'none';
        }
    });

    // Hide subcategory sidebar when clicking other main nav items
    mainNavItems.forEach(function(item) {
        if (item !== productTabBtn) {
            item.addEventListener('click', function() {
                subcategorySidebar.style.display = 'none';
            });
        }
    });

    // Subcategory item click logic
    subcategoryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Remove active from all
            subcategoryItems.forEach(i => i.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');

            // Hide all product sub-sections
            productsSection.style.display = 'none';
            productsImageSection.style.display = 'none';
            productsSpecificationSection.style.display = 'none';
            productsVariantsSection.style.display = 'none';
            productsCategoriesSection.style.display = 'none';

            // Show only the selected section
            if (item.id === 'products-table') {
                productsSection.style.display = 'block';
            } else if (item.id === 'products-image-table') {
                productsImageSection.style.display = 'block';
            } else if (item.id === 'products-specification-table') {
                productsSpecificationSection.style.display = 'block';
            } else if (item.id === 'products-variant-table') {
                productsVariantsSection.style.display = 'block';
            } else if (item.id === 'products-categories-table') {
                productsCategoriesSection.style.display = 'block';
            }
        });
    });

    // Optional: Hide subcategory sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!subcategorySidebar.contains(event.target) && event.target !== productTabBtn) {
            subcategorySidebar.style.display = 'none';
        }
    });
});

// Customer Orders Subcategory Sidebar Logic
// Updated for .card IDs on the card divs

document.addEventListener('DOMContentLoaded', function() {
    const customerOrdersTabBtn = document.getElementById('customer-orders-tab-btn');
    const subcategorySidebar = document.getElementById('customer-orders-subcategory-sidebar');
    const subcategoryItems = document.querySelectorAll('#customer-orders-subcategory-sidebar .subcategory-item');
    const mainNavItems = document.querySelectorAll('.nav-item');
    const customerOrdersCards = document.querySelectorAll('#customer-orders-section .card');

    // Map subcategory IDs to card IDs (card IDs are on the .card divs)
    const tableMap = {
        'customer-orders-table-item': 'customer-orders-table',
        'customer-orders-items-table-item': 'order-items-table',
        'customer-orders-reviews-table-item': 'reviews-table',
        'customer-orders-cancel-table-item': 'cancelled-order-items-table'
        // 'customer-orders-return-table-item' handled separately
    };

    customerOrdersTabBtn.addEventListener('click', function(e) {
        e.preventDefault();
        subcategorySidebar.style.display = (subcategorySidebar.style.display === 'none' || subcategorySidebar.style.display === '') ? 'block' : 'none';
        if (subcategorySidebar.style.display === 'block') {
            subcategoryItems.forEach(i => i.classList.remove('active'));
            const ordersItem = document.getElementById('customer-orders-table-item');
            if (ordersItem) ordersItem.classList.add('active');
            customerOrdersCards.forEach(card => card.style.display = 'none');
            const ordersCard = document.getElementById('customer-orders-table');
            if (ordersCard) ordersCard.style.display = '';
        }
    });

    mainNavItems.forEach(function(item) {
        if (item !== customerOrdersTabBtn) {
            item.addEventListener('click', function() {
                subcategorySidebar.style.display = 'none';
            });
        }
    });

    subcategoryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            subcategoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            customerOrdersCards.forEach(card => card.style.display = 'none');

            if (item.id === 'customer-orders-return-table-item') {
                // Show both Refunded and Returned tables
                const refundedCard = document.getElementById('refunded-order-items-table');
                const returnedCard = document.getElementById('returned-order-items-table');
                if (refundedCard) refundedCard.style.display = '';
                if (returnedCard) returnedCard.style.display = '';
            } else {
                const cardId = tableMap[item.id];
                if (cardId) {
                    const card = document.getElementById(cardId);
                    if (card) card.style.display = '';
                }
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (!subcategorySidebar.contains(event.target) && event.target !== customerOrdersTabBtn) {
            subcategorySidebar.style.display = 'none';
        }
    });
});