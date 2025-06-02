// search.js - Filtering logic for Supply Request Table

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('supply-request-search-btn');
    const searchBySelect = document.getElementById('supply-request-search-by');
    const searchInput = document.getElementById('supply-request-search-input');
    const table = document.querySelector('.supply-request-table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'inventory_id', 'product_id', 'product_name', 'supplier_price',
            'requested_by', 'quantity_requested', 'status', 'notes',
            'request_date', 'updated_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'inventory_id', 'product_id', 'supplier_price', 'quantity_requested', 'request_date', 'updated_at'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Suppliers Info Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('suppliers-info-search-btn');
    const searchBySelect = document.getElementById('suppliers-info-search-by');
    const searchInput = document.getElementById('suppliers-info-search-input');
    const table = document.querySelector('.supplier-table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'supplier_id', 'supplier_name', 'contact_person', 'phone_number',
            'email', 'address', 'supplier_status', 'registration_date'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'supplier_id', 'supplier_name', 'contact_person', 'phone_number',
                        'email', 'address', 'supplier_status', 'registration_date'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Suppliers Products Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('supplier-products-search-btn');
    const searchBySelect = document.getElementById('supplier-products-search-by');
    const searchInput = document.getElementById('supplier-products-search-input');
    const table = document.querySelector('.supplier-products-table-body');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'product_supplier_id', 'product_id', 'product_name', 'supplier_id',
            'supplier_price', 'is_primary'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'product_supplier_id', 'product_id', 'supplier_id', 'is_primary'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Product Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('product-search-btn');
    const searchBySelect = document.getElementById('product-search-by');
    const searchInput = document.getElementById('product-search-input');
    // Use the table within the products-section only
    const productsSection = document.getElementById('products-section');
    const table = productsSection ? productsSection.querySelector('table.product-table') : null;
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        // Picture column is index 0, so shift colMap by 1
        const colMap = [
            'picture', 'product_id', 'product_name', 'model_number', 'description',
            'category_id', 'base_price', 'updated_at', 'created_at', 'actions'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'product_id', 'model_number', 'category_id'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Product Image Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('product-image-search-btn');
    const searchBySelect = document.getElementById('product-image-search-by');
    const searchInput = document.getElementById('product-image-search-input');
    // Use the table within the products-image-section only
    const imagesSection = document.getElementById('products-image-section');
    const table = imagesSection ? imagesSection.querySelector('table.product-table') : null;
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'image_id', 'product_id', 'image_type',
            'display_order', 'text'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'image_id', 'product_id', 'image_type', 'display_order'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Product Specification Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('product-spec-search-btn');
    const searchBySelect = document.getElementById('product-spec-search-by');
    const searchInput = document.getElementById('product-spec-search-input');
    const table = document.querySelector('.product-spec-table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'specification_id', 'product_id', 'specification_name',
            'specification_value', 'display_order'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'specification_id', 'product_id', 'display_order'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Product Variant Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('product-variants-search-btn');
    const searchBySelect = document.getElementById('product-variants-search-by');
    const searchInput = document.getElementById('product-variants-search-input');
    const table = document.querySelector('.product-variants-table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'variant_id', 'product_id', 'variant_name',
            'variant_value', 'additional_price', 'stock_quantity',
            'created_at', 'updated_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'variant_id', 'product_id', 'additional_price', 'stock_quantity'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Product Categories Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('category-search-btn');
    const searchBySelect = document.getElementById('category-search-by');
    const searchInput = document.getElementById('category-search-input');
    const table = document.querySelector('.category-table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;

    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'category_id', 'category_name', 'category_description',
            'created_at', 'updated_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'category_id', 'category_name', 'created_at', 'updated_at'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Inventory Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('inventory-search-btn');
    const searchBySelect = document.getElementById('inventory-search-by');
    const searchInput = document.getElementById('inventory-search-input');
    // Only select the inventory-table inside the inventory-section
    const inventorySection = document.getElementById('inventory-section');
    const table = inventorySection ? inventorySection.querySelector('table.inventory-table') : null;
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        // The Actions column is at the end, so skip it for searching
        const colMap = [
            'inventory_id', 'product_id', 'order_id',
            'product_name', 'supplier_name', 'supplier_price',
            'stock_quantity', 'stock_in', 'stock_out',
            'min_stock', 'max_stock', 'available_stock',
            'stock_status', 'created_at', 'last_updated', 'actions'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'inventory_id', 'product_id', 'order_id', 'stock_quantity', 'stock_in', 'stock_out', 'min_stock', 'max_stock', 'available_stock'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

// Sales Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('sales-search-btn');
    const searchBySelect = document.getElementById('sales-search-by');
    const searchInput = document.getElementById('sales-search-input');
    const table = document.querySelector('.sales-table');
    const dateInput = document.querySelector('#sales-section .date-input');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'sale_id', 'order_id', 'product_id', 'user_id', 'sale_date', 'total_amount', 'payment_id'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'sale_id', 'order_id', 'product_id', 'user_id', 'sale_date', 'total_amount', 'payment_id'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });

    // Date filter for Sale Date
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = dateInput.value;
            const rows = table.querySelectorAll('tbody tr');
            // Find the Sale Date column index
            const ths = table.querySelectorAll('thead th');
            let saleDateIdx = -1;
            ths.forEach((th, idx) => {
                if (th.textContent.trim().toLowerCase() === 'sale date') saleDateIdx = idx;
            });
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (saleDateIdx === -1) return;
                const cell = tds[saleDateIdx];
                if (!selectedDate) {
                    row.style.display = '';
                } else if (cell && cell.textContent.trim().startsWith(selectedDate)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

//Customer Orders Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('orders-search-btn');
    const searchBySelect = document.getElementById('orders-search-by');
    const searchInput = document.getElementById('orders-search-input');
    const table = document.querySelector('#customer-orders-table table');
    const dateInput = document.querySelector('#customer-orders-table .date-input');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        filterCustomerOrders();
    });

    // Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        filterCustomerOrders();
    });

    // Date filter for Order Date
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            filterCustomerOrders();
        });
    }

    function filterCustomerOrders() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const selectedDate = dateInput ? dateInput.value : '';
        const colMap = [
            'order_id', 'users', 'order_date', 'product_name', 'product_quantity', 'total_amount', 'payment_method', 'order_status', 'courier', 'reference_number', 'tracking_status', 'created_at', 'updated_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        // Find the Order Date column index
        const ths = table.querySelectorAll('thead th');
        let orderDateIdx = -1;
        ths.forEach((th, idx) => {
            if (th.textContent.trim().toLowerCase() === 'order date') orderDateIdx = idx;
        });
        rows.forEach(row => {
            let show = true;
            const tds = row.querySelectorAll('td');
            // Filter by search
            if (query && searchBy) {
                show = false;
                tds.forEach((cell, idx) => {
                    if (colMap[idx] === searchBy) {
                        const exactMatchCols = [
                            'order_id', 'users', 'order_date', 'product_name', 'product_quantity', 'total_amount', 'payment_method', 'order_status', 'courier', 'reference_number', 'tracking_status', 'created_at', 'updated_at'
                        ];
                        if (exactMatchCols.includes(searchBy)) {
                            if (cell.textContent.trim().toLowerCase() === query) show = true;
                        } else {
                            if (cell.textContent.toLowerCase().includes(query)) show = true;
                        }
                    }
                });
            }
            // Filter by date
            if (show && selectedDate && orderDateIdx !== -1) {
                const cell = tds[orderDateIdx];
                if (!cell || !cell.textContent.trim().startsWith(selectedDate)) {
                    show = false;
                }
            }
            row.style.display = show ? '' : 'none';
        });
    }
});

//Order Items Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('order-items-search-btn');
    const searchBySelect = document.getElementById('order-items-search-by');
    const searchInput = document.getElementById('order-items-search-input');
    const table = document.querySelector('#order-items-table table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'item_id', 'order_id', 'product_id', 'variant_id', 'quantity', 'unit_price', 'discount_amount'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'item_id', 'order_id', 'product_id', 'variant_id', 'quantity', 'unit_price', 'discount_amount'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

//Reviews Search
// This block enables both search and date filter to work together for reviews

document.addEventListener('DOMContentLoaded', function() {
    const reviewsSearchBtn = document.getElementById('reviews-search-btn');
    const reviewsSearchBySelect = document.getElementById('reviews-search-by');
    const reviewsSearchInput = document.getElementById('reviews-search-input');
    const reviewsTable = document.querySelector('#reviews-table table');
    const reviewsDateInput = document.querySelector('#reviews-table .date-input');
    if (!reviewsSearchBtn || !reviewsSearchBySelect || !reviewsSearchInput || !reviewsTable) return;
    
    reviewsSearchBtn.addEventListener('click', function() {
        filterReviews();
    });

    reviewsSearchInput.addEventListener('input', function() {
        filterReviews();
    });

    if (reviewsDateInput) {
        reviewsDateInput.addEventListener('change', function() {
            filterReviews();
        });
    }

    function filterReviews() {
        const searchBy = reviewsSearchBySelect.value;
        const query = reviewsSearchInput.value.trim().toLowerCase();
        const selectedDate = reviewsDateInput ? reviewsDateInput.value : '';
        const colMap = [
            'review_id', 'product_id', 'order_id', 'user_id', 'rating', 'comment', 'created_at'
        ];
        const rows = reviewsTable.querySelectorAll('tbody tr');
        // Find the Created At column index
        const ths = reviewsTable.querySelectorAll('thead th');
        let createdAtIdx = -1;
        ths.forEach((th, idx) => {
            if (th.textContent.trim().toLowerCase() === 'created at') createdAtIdx = idx;
        });
        rows.forEach(row => {
            let show = true;
            const tds = row.querySelectorAll('td');
            // Filter by search
            if (query && searchBy) {
                show = false;
                tds.forEach((cell, idx) => {
                    if (colMap[idx] === searchBy) {
                        const exactMatchCols = [
                            'review_id', 'product_id', 'order_id', 'user_id', 'rating', 'comment', 'created_at'
                        ];
                        if (exactMatchCols.includes(searchBy)) {
                            if (cell.textContent.trim().toLowerCase() === query) show = true;
                        } else {
                            if (cell.textContent.toLowerCase().includes(query)) show = true;
                        }
                    }
                });
            }
            // Filter by date
            if (show && selectedDate && createdAtIdx !== -1) {
                const cell = tds[createdAtIdx];
                if (!cell || !cell.textContent.trim().startsWith(selectedDate)) {
                    show = false;
                }
            }
            row.style.display = show ? '' : 'none';
        });
    }
});

//Cancelled Orders Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('cancelled-order-items-search-btn');
    const searchBySelect = document.getElementById('cancelled-order-items-search-by');
    const searchInput = document.getElementById('cancelled-order-items-search-input');
    const table = document.querySelector('#cancelled-order-items-table table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'cancellation_id', 'order_id', 'cancellation_reason', 'other_reason', 'cancelled_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'cancellation_id', 'order_id', 'cancellation_reason', 'other_reason', 'cancelled_at'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

//Refund Orders Search 
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('refunded-order-items-search-btn');
    const searchBySelect = document.getElementById('refunded-order-items-search-by');
    const searchInput = document.getElementById('refunded-order-items-search-input');
    const table = document.querySelector('#refunded-order-items-table table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'refund_id', 'refund_reason', 'refund_status', 'proof_of_refund', 'order_id', 'return_id', 'created_at', 'updated_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'refund_id', 'refund_reason', 'refund_status', 'proof_of_refund', 'order_id', 'return_id', 'created_at', 'updated_at'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});

//Returned Orders Search
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('returned-order-items-search-btn');
    const searchBySelect = document.getElementById('returned-order-items-search-by');
    const searchInput = document.getElementById('returned-order-items-search-input');
    const table = document.querySelector('#returned-order-items-table table');
    if (!searchBtn || !searchBySelect || !searchInput || !table) return;
    
    searchBtn.addEventListener('click', function() {
        const searchBy = searchBySelect.value;
        const query = searchInput.value.trim().toLowerCase();
        const colMap = [
            'return_id', 'return_reason', 'return_issue', 'other_reason', 'return_status', 'refund_id', 'order_id', 'created_at', 'updated_at'
        ];
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let show = false;
            row.querySelectorAll('td').forEach((cell, idx) => {
                if (colMap[idx] === searchBy) {
                    const exactMatchCols = [
                        'return_id', 'return_reason', 'return_issue', 'other_reason', 'return_status', 'refund_id', 'order_id', 'created_at', 'updated_at'
                    ];
                    if (exactMatchCols.includes(searchBy)) {
                        if (cell.textContent.trim().toLowerCase() === query) show = true;
                    } else {
                        if (cell.textContent.toLowerCase().includes(query)) show = true;
                    }
                }
            });
            row.style.display = show ? '' : 'none';
        });
    });

    // Optional: Reset filter when input is cleared
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }
    });
});