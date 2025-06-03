// Supplier Section Functionality

document.addEventListener('DOMContentLoaded', function() {
    // On page load, if supplier section is visible, fetch suppliers
    const supplierSection = document.getElementById('supplier-section');
    if (supplierSection && supplierSection.classList.contains('active')) {
        fetchAndRenderSuppliers();
    }
    // Add Supplier Button
    const supplierAddBtn = document.getElementById('supplier-add-btn');
    if(supplierAddBtn) {
        supplierAddBtn.addEventListener('click', function() {
            showAddSupplierModal();
        });
    }
    // Attach filter listeners for supplier filtering
    const supplierSelect = document.getElementById('supplier-filter-supplier');
    const statusSelect = document.getElementById('supplier-filter-status');
    function filterSuppliers() {
        const table = document.querySelector('.supplier-table');
        if (!supplierSelect || !statusSelect || !table) return;
        const selectedSupplier = supplierSelect.value.toLowerCase();
        const selectedStatus = statusSelect.value.toLowerCase();
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (let row of rows) {
            // 1 = Name, 5 = Status
            const supplierCell = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
            const statusCell = row.cells[5] ? row.cells[5].textContent.toLowerCase() : '';
            const matchesSupplier = !selectedSupplier || supplierCell === selectedSupplier;
            const matchesStatus = !selectedStatus || statusCell === selectedStatus;
            row.style.display = (matchesSupplier && matchesStatus) ? '' : 'none';
        }
    }
    if (supplierSelect) supplierSelect.addEventListener('change', filterSuppliers);
    if (statusSelect) statusSelect.addEventListener('change', filterSuppliers);
});

// Robust showSection for all sections
function showSection(sectionName) {
    console.log('Switching to section:', sectionName); // Debug log
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    // Add active to clicked nav item
    const navBtn = document.getElementById(`${sectionName}-tab-btn`);
    if (navBtn) navBtn.classList.add('active');
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    // Show the target section
    const sectionDiv = document.getElementById(`${sectionName}-section`);
    if (sectionDiv) sectionDiv.classList.add('active');
    else console.warn('Section not found:', sectionName + '-section');
    // Section-specific logic
    if (sectionName === 'supplier') fetchAndRenderSuppliers();
    if (sectionName === 'inventory') fetchAndRenderInventory();
    if (sectionName === 'customer-orders') fetchAndRenderCustomerOrders();
}

function fetchAndRenderSupplierProducts() {
    fetch('/api/product_suppliers')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('supplier-products-table-body');
            tableBody.innerHTML = ''; // Clear previous rows

            if (data.length === 0) {
                // Optionally show a message if no data
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="7" style="text-align:center;">No records found.</td>`;
                tableBody.appendChild(row);
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.product_supplier_id}</td>
                    <td>${item.product_id}</td>
                    <td>${item.product_name}</td>
                    <td>${item.supplier_id}</td>
                    <td>${item.supplier_price}</td>
                    <td>${item.is_primary ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="add-supplier-product-btn" data-id="${item.product_supplier_id}">Add</button>
                        <button class="update-supplier-product-btn" data-id="${item.product_supplier_id}">Update</button>
                        <button class="delete-supplier-product-btn" data-id="${item.product_supplier_id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners for the Add buttons
            document.querySelectorAll('.add-supplier-product-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    addSupplierProduct(id);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching supplier products:', error);
        });
}

// Function to handle adding a supplier product
function addSupplierProduct() {
    // Clear all modal fields for new entry
    document.getElementById('modal-product-id').value = '';
    document.getElementById('modal-product-name').value = '';
    document.getElementById('modal-supplier-id').value = '';
    document.getElementById('modal-supplier-price').value = '';
    document.getElementById('modal-is-primary').value = '1';
    // Show the modal using Bootstrap's jQuery API
    $('#addSupplierProductModal').modal('show');
}

// Handle form submission for adding supplier product
const addSupplierProductForm = document.getElementById('add-supplier-product-form');
if (addSupplierProductForm) {
    addSupplierProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Gather form data
        const productId = document.getElementById('modal-product-id').value;
        const productName = document.getElementById('modal-product-name').value;
        const supplierId = document.getElementById('modal-supplier-id').value;
        const supplierPrice = document.getElementById('modal-supplier-price').value;
        const isPrimary = document.getElementById('modal-is-primary').value;
        fetch('/admin/add_supplier_product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                product_name: productName, // Optional, backend may ignore
                supplier_id: supplierId,
                supplier_price: supplierPrice,
                is_primary: isPrimary
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#addSupplierProductModal').modal('hide');
                fetchAndRenderSupplierProducts();
            } else {
                alert('Error: ' + (data.error || 'Failed to add supplier product'));
            }
        })
        .catch(err => {
            alert('Request failed: ' + err);
        });
    });
}


// Call this function when the page loads or when you need to refresh the table
document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderSupplierProducts();
});

// Call this function on page load or after updating supplier products
fetchAndRenderSupplierProducts();

// === SUPPLIER PRODUCTS MANAGEMENT: Add Button Initialization ===
// Add the add button event handler after DOMContentLoaded
function insertSupplierProductsAddButton() {
    const section = document.querySelector('#supplier-products-section .section-header, #supplier-products-section .header, #supplier-products-section h2');
    if (section && !document.getElementById('supplier-products-add-btn')) {
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary btn-sm';
        addBtn.id = 'supplier-products-add-btn';
        addBtn.textContent = 'Add Supplier Product';
        addBtn.style.marginLeft = '12px';
        addBtn.onclick = addSupplierProduct;
        section.appendChild(addBtn);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    insertSupplierProductsAddButton();
});

// === UNIFIED INITIALIZATION AND SIDEBAR NAVIGATION ===
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const id = item.id || '';
            if (id.endsWith('-tab-btn')) {
                const section = id.replace('-tab-btn','');
                showSection(section);
            }
        });
    });
    // Show dashboard section by default on load
    showSection('dashboard');

    // --- UPDATE FOR DELIVERY & NEW ORDERS CARDS ---
    fetch('/admin/orders_list')
        .then(res => res.json())
        .then(orders => {
            const deliveryCount = Array.isArray(orders) ? orders.filter(o => o.status_name === 'To Ship' || o.status_name === 'To Receive').length : 0;
            const deliveryCard = document.querySelector('.card-for-delivery .total-orders-number');
            if (deliveryCard) deliveryCard.textContent = deliveryCount;
            // New Orders count
            const newOrdersCount = Array.isArray(orders) ? orders.filter(o => o.status_name === 'To Pay').length : 0;
            const newOrdersCard = document.querySelector('.card-for-new-orders .total-orders-number');
            if (newOrdersCard) newOrdersCard.textContent = newOrdersCount;
        });

    // --- PRODUCT TABLES ---
    if (typeof fetchAndRenderProducts === 'function') fetchAndRenderProducts();
    if (typeof fetchAndRenderProductImages === 'function') fetchAndRenderProductImages();
    if (typeof fetchAndRenderProductSpecs === 'function') fetchAndRenderProductSpecs();
    if (typeof fetchAndRenderProductVariants === 'function') fetchAndRenderProductVariants();
    if (typeof fetchAndRenderCategories === 'function') fetchAndRenderCategories();
    // --- CUSTOMER ORDERS TABLE ---
    if (document.getElementById('customer-orders-table') && typeof fetchAndRenderCustomerOrders === 'function') {
        fetchAndRenderCustomerOrders();
    }
    // --- CANCELLED ORDERS TABLE ---
    if (document.getElementById('cancelled-order-items-table') && typeof fetchAndRenderCancelledOrders === 'function') {
        fetchAndRenderCancelledOrders();
    }
    // --- PRODUCT VARIANTS TABLE ---
    if (document.querySelector('.product-variants-table') && typeof fetchAndRenderProductVariants === 'function') {
        fetchAndRenderProductVariants();
    }
    // --- CATEGORY TABLE ---
    if (document.querySelector('.category-table') && typeof fetchAndRenderCategories === 'function') {
        fetchAndRenderCategories();
    }
});

function fetchAndRenderCategories() {
    fetch('/admin/category_list')
        .then(res => res.json())
        .then(categories => renderCategoryTable(categories))
        .catch(err => {
            console.error('Failed to fetch categories:', err);
            const tbody = document.querySelector('.category-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="3">Failed to load categories.</td></tr>';
        });
}

function renderCategoryTable(categories) {
    const tbody = document.querySelector('.category-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(categories) || categories.length === 0 || categories.error) {
        tbody.innerHTML = '<tr><td colspan="3">No categories found.</td></tr>';
        return;
    }
    categories.forEach(category => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${category.category_id || ''}</td>
            <td>${category.category_name || ''}</td>
            <td>${category.parent_category_id || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}


function fetchAndRenderProductVariants() {
    fetch('/admin/product_variant_list')
        .then(res => res.json())
        .then(variants => renderProductVariantTable(variants))
        .catch(err => {
            console.error('Failed to fetch product variants:', err);
            const tbody = document.querySelector('.product-variants-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="8">Failed to load product variants.</td></tr>';
        });
}

function renderProductVariantTable(variants) {
    const tbody = document.querySelector('.product-variants-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(variants) || variants.length === 0 || variants.error) {
        tbody.innerHTML = '<tr><td colspan="8">No product variants found.</td></tr>';
        return;
    }
    variants.forEach(variant => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${variant.variant_id || ''}</td>
            <td>${variant.product_id || ''}</td>
            <td>${variant.variant_name || ''}</td>
            <td>${variant.variant_value || ''}</td>
            <td>${variant.additional_price || ''}</td>
            <td>${variant.stock_quantity || ''}</td>
            <td>${variant.created_at || ''}</td>
            <td>${variant.updated_at || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}


function fetchAndRenderSuppliers() {
    fetch('/admin/supplier_list')
        .then(res => res.json())
        .then(data => renderSupplierTable(data))
        .catch(err => console.error('Failed to fetch suppliers:', err));
}

function renderSupplierTable(suppliers) {
    const tbody = document.querySelector('.supplier-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    suppliers.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.supplier_name || ''}</td>
            <td>${s.contact_person || ''}</td>
            <td>${s.phone_number || ''}</td>
            <td>${s.email || ''}</td>
            <td>${s.address || ''}</td>
            <td>${s.status || ''}</td>
            <td>${s.registration_date || ''}</td>
            <td>
                <button class="update-supplier-btn" data-id="${s.id}">Update</button>
                <button class="delete-supplier-btn" data-id="${s.id}">Delete</button>
                <button class="contact-supplier-btn" data-id="${s.id}">Contact Supplier</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Attach delete event listeners
    document.querySelectorAll('.delete-supplier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteSupplier(id);
        });
    });
    // Attach contact event listeners
    document.querySelectorAll('.contact-supplier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            contactSupplier(id);
        });
    });
    // Attach update event listeners
    document.querySelectorAll('.update-supplier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            // Find the supplier data from your suppliers array
            const supplier = suppliers.find(s => s.id == id);
            showUpdateSupplierModal(supplier);
        });
    });
}

function showAddSupplierModal() {
    let modal = document.getElementById('add-supplier-modal');
    if (!modal) {
        // Inject modal CSS if not present
        if (!document.getElementById('add-supplier-modal-style')) {
            const style = document.createElement('style');
            style.id = 'add-supplier-modal-style';
            style.textContent = `
                .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100vw; height: 100vh; overflow: auto; background: rgba(0,0,0,0.4); }
                .modal-content { background: #fff; margin: 10% auto; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; position: relative; }
                .modal .close { position: absolute; right: 16px; top: 8px; color: #aaa; font-size: 24px; cursor: pointer; }
                .modal .close:hover { color: #333; }
                .form-group { margin-bottom: 1em; }
                .form-group label { display: block; margin-bottom: 0.3em; }
                .form-group input, .form-group select { width: 100%; padding: 0.5em; border: 1px solid #ccc; border-radius: 4px; }
            `;
            document.head.appendChild(style);
        }
        // Create modal HTML
        modal = document.createElement('div');
        modal.id = 'add-supplier-modal';
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close" id="close-add-supplier-modal">&times;</span>
            <h2>Add Supplier</h2>
            <form id="add-supplier-form">
              <div class="form-group">
                <label for="supplier-name">Supplier Name</label>
                <input type="text" id="supplier-name" name="supplier_name" required>
              </div>
              <div class="form-group">
                <label for="supplier-contact-person">Contact Person</label>
                <input type="text" id="supplier-contact-person" name="contact_person" required>
              </div>
              <div class="form-group">
                <label for="supplier-phone-number">Phone Number</label>
                <input type="text" id="supplier-phone-number" name="phone_number" required>
              </div>
              <div class="form-group">
                <label for="supplier-email">Email</label>
                <input type="text" id="supplier-email" name="email">
              </div>
              <div class="form-group">
                <label for="supplier-address">Address</label>
                <input type="text" id="supplier-address" name="address">
              </div>
              <div class="form-group">
                <label for="supplier-status">Status</label>
                <select id="supplier-status" name="status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="form-group">
                <label for="supplier-registration-date">Registration Date</label>
                <input type="text" id="supplier-registration-date" name="registration_date">
              </div>
              <div style="text-align:right;">
                <button type="button" id="cancel-add-supplier-btn">Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        `;
        document.body.appendChild(modal);

        // Modal open/close logic
        const closeBtn = modal.querySelector('#close-add-supplier-modal');
        const cancelBtn = modal.querySelector('#cancel-add-supplier-btn');
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        cancelBtn.onclick = () => { modal.style.display = 'none'; };
        modal.addEventListener('click', function(event) {
            if (event.target === modal) modal.style.display = 'none';
        });
        // Reset form fields
        document.getElementById('supplier-name').value = "";
        document.getElementById('supplier-contact-person').value = "";
        document.getElementById('supplier-phone-number').value = "";
        document.getElementById('supplier-email').value = "";
        document.getElementById('supplier-address').value = "";
        document.getElementById('supplier-status').value = "Active";
        document.getElementById('supplier-registration-date').value = "";

        // Change modal title for clarity
        modal.querySelector('h2').textContent = "Add Supplier";

        // Handle form submission for adding
        const form = modal.querySelector('#add-supplier-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            const supplier = {
                name: document.getElementById('supplier-name').value,
                contact_person: document.getElementById('supplier-contact-person').value,
                phone_number: document.getElementById('supplier-phone-number').value,
                email: document.getElementById('supplier-email').value,
                address: document.getElementById('supplier-address').value,
                status: document.getElementById('supplier-status').value,
                registration_date: document.getElementById('supplier-registration-date').value
            };
            addSupplier(supplier);
            modal.style.display = 'none';
            form.reset();
        };
    }
    modal.style.display = 'block';
}

function showUpdateSupplierModal(supplier) {
    let modal = document.getElementById('add-supplier-modal');
    if (!modal) {
        showAddSupplierModal(); // Create modal if not present
        modal = document.getElementById('add-supplier-modal');
    }
    modal.querySelector('h2').textContent = "Update Supplier";
    // Pre-fill the form fields
    document.getElementById('supplier-name').value = supplier.name;
    document.getElementById('supplier-contact-person').value = supplier.contact_person;
    document.getElementById('supplier-phone-number').value = supplier.phone_number;
    document.getElementById('supplier-email').value = supplier.email;
    document.getElementById('supplier-address').value = supplier.address;
    document.getElementById('supplier-status').value = supplier.status;
    document.getElementById('supplier-registration-date').value = supplier.registration_date;

    // Change the form submission logic
    const form = modal.querySelector('#add-supplier-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const updatedSupplier = {
            name: document.getElementById('supplier-name').value,
            contact_person: document.getElementById('supplier-contact-person').value,
            phone_number: document.getElementById('supplier-phone-number').value,
            email: document.getElementById('supplier-email').value,
            address: document.getElementById('supplier-address').value,
            status: document.getElementById('supplier-status').value,
            registration_date: document.getElementById('supplier-registration-date').value
        };
        updateSupplier(supplier.id, updatedSupplier);
        modal.style.display = 'none';
        form.reset();
    };
    modal.style.display = 'block';
}

function updateSupplier(id, updatedSupplier) {
    fetch(`/admin/update_supplier/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupplier)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Supplier updated!');
            fetchAndRenderSuppliers();
        } else {
            alert('Failed to update supplier: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Error updating supplier: ' + err));
}

function addSupplier(supplier) {
    fetch('/admin/add_supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Supplier added!');
            fetchAndRenderSuppliers();
        } else {
            alert('Failed to add supplier: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Error adding supplier: ' + err));
}

function deleteSupplier(supplierId) {
    if(!confirm('Are you sure you want to delete this supplier?')) return;
    fetch(`/admin/delete_supplier/${supplierId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Supplier deleted!');
            fetchAndRenderSuppliers();
        } else {
            alert('Failed to delete supplier: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Error deleting supplier: ' + err));
}

function contactSupplier(id) {
    alert("Contact Supplier functionality for ID: " + id + " is not yet implemented.");
    // You can implement your actual contact logic here (e.g., open a modal, send an email, etc.)
}


// Inventory Section Functionality
// Inventory Section Functionality

function fetchAndRenderInventory() {
    fetch('/admin/inventory_list')
        .then(res => res.json())
        .then(data => renderInventoryTable(data))
        .catch(err => console.error('Failed to fetch inventory:', err));
}

function renderInventoryTable(items) {
    const tbody = document.querySelector('.inventory-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    items.forEach(i => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i.inventory_id}</td>
            <td>${i.product_id}</td>
            <td>${i.product_name}</td>
            <td>${i.supplier_name}</td>
            <td>${i.supplier_price}</td>
            <td>${i.stock_quantity}</td>
            <td>${i.stock_in}</td>
            <td>${i.stock_out}</td>
            <td>${i.min_stock}</td>
            <td>${i.max_stock}</td>
            <td>${i.available_stock}</td>
            <td>${i.stock_status}</td>
            <td>${i.created_at}</td>
            <td>${i.updated_at}</td>
            <td>
                <button class="update-inventory-btn" data-id="${i.inventory_id}">Update</button>
                <button class="delete-inventory-btn" data-id="${i.inventory_id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.update-inventory-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = items.find(i => i.inventory_id == id);
            showUpdateInventoryModal(item);
        });
    });

    document.querySelectorAll('.delete-inventory-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteInventory(id);
        });
    });
}

function showAddInventoryModal() {
    // ... (modal setup code, see below for minimal version)
    showInventoryModal('Add Inventory', {}, addInventory);
}

function showUpdateInventoryModal(item) {
    showInventoryModal('Update Inventory', item, function(updatedItem) {
        updateInventory(item.inventory_id, updatedItem);
    });
}

function showInventoryModal(title, item, onSave) {
    let modal = document.getElementById('inventory-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'inventory-modal';
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close" id="close-inventory-modal">&times;</span>
            <h2 id="inventory-modal-title"></h2>
            <form id="inventory-form">
              <div class="form-group">
                <label>Product ID</label>
                <input type="text" id="inventory-product-id" required>
              </div>
              <div class="form-group">
                <label>Order ID (auto-filled when product is ordered)</label>
                <input type="text" id="inventory-order-id" placeholder="(auto)" autocomplete="off">
              </div>
              <div class="form-group">
                <label>Stock Quantity</label>
                <input type="number" id="inventory-stock-quantity" required>
              </div>
              <div class="form-group">
                <label>Stock In</label>
                <input type="number" id="inventory-stock-in" required>
              </div>
              <div class="form-group">
                <label>Stock Out</label>
                <input type="number" id="inventory-stock-out" required>
              </div>
              <div class="form-group">
                <label>Min Stock</label>
                <input type="number" id="inventory-min-stock" required>
              </div>
              <div class="form-group">
                <label>Max Stock</label>
                <input type="number" id="inventory-max-stock" required>
              </div>
              <div class="form-group">
                <label>Available Stock</label>
                <input type="number" id="inventory-available-stock" required>
              </div>
              <div class="form-group">
                <label>Stock Status</label>
                <input type="text" id="inventory-stock-status" required>
              </div>
              <div style="text-align:right;">
                <button type="button" id="cancel-inventory-btn">Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        `;
        document.body.appendChild(modal);
    }

    // Set modal title and values
    document.getElementById('inventory-modal-title').textContent = title;
    document.getElementById('inventory-product-id').value = item.product_id || '';
    document.getElementById('inventory-order-id').value = item.order_id || '';
    document.getElementById('inventory-stock-quantity').value = item.stock_quantity || '';
    document.getElementById('inventory-stock-in').value = item.stock_in || '';
    document.getElementById('inventory-stock-out').value = item.stock_out || '';
    document.getElementById('inventory-min-stock').value = item.min_stock || '';
    document.getElementById('inventory-max-stock').value = item.max_stock || '';
    document.getElementById('inventory-available-stock').value = item.available_stock || '';
    document.getElementById('inventory-stock-status').value = item.stock_status || '';

    modal.style.display = 'block';

    document.getElementById('close-inventory-modal').onclick =
    document.getElementById('cancel-inventory-btn').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(event) {
        if (event.target === modal) modal.style.display = 'none';
    };

    const form = document.getElementById('inventory-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const inventory = {
            product_id: document.getElementById('inventory-product-id').value,
            // Only include order_id if filled
        ...(document.getElementById('inventory-order-id').value ? { order_id: document.getElementById('inventory-order-id').value } : {}),
            stock_quantity: parseInt(document.getElementById('inventory-stock-quantity').value),
            stock_in: parseInt(document.getElementById('inventory-stock-in').value),
            stock_out: parseInt(document.getElementById('inventory-stock-out').value),
            min_stock: parseInt(document.getElementById('inventory-min-stock').value),
            max_stock: parseInt(document.getElementById('inventory-max-stock').value),
            available_stock: parseInt(document.getElementById('inventory-available-stock').value),
            stock_status: document.getElementById('inventory-stock-status').value
        };
        onSave(inventory);
        modal.style.display = 'none';
        form.reset();
    };
}

function addInventory(inventory) {
    fetch('/admin/add_inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventory)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchAndRenderInventory();
            alert('Inventory item added!');
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        alert('Error adding inventory item: ' + error);
        console.error('Error:', error);
    });
}

function updateInventory(id, updatedItem) {
    fetch(`/admin/update_inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Inventory updated!');
            fetchAndRenderInventory();
        } else {
            alert('Failed to update inventory: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Error updating inventory: ' + err));
}

function deleteInventory(inventoryId) {
    if(!confirm('Are you sure you want to delete this inventory item?')) return;
    fetch(`/admin/delete_inventory/${inventoryId}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Inventory deleted!');
            fetchAndRenderInventory();
        } else {
            alert('Failed to delete inventory: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Error deleting inventory: ' + err));
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderInventory();
    // Add Inventory Button
    const inventoryAddBtn = document.getElementById('inventory-add-btn');
    if (inventoryAddBtn) {
        inventoryAddBtn.addEventListener('click', function() {
            showAddInventoryModal();
        });
    }
});



//admin log out drop down
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('profile-dropdown-btn');
    const menu = document.getElementById('profile-dropdown-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
    });
    document.addEventListener('click', function() {
        menu.classList.remove('active');
    });
    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});
// Chat modal logic for admin
document.addEventListener('DOMContentLoaded', function() {
    const openChatModal = document.getElementById('chat-modal-btn'); // The floating button
    const closeChatModal = document.getElementById('closeChatModal');
    const chatModal = document.getElementById('chatModal');
    const chatHeaderBar = document.getElementById('chatHeaderBar');
    const openConversation = document.getElementById('openConversation');
    const backToList = document.getElementById('backToList');
    const chatList = document.getElementById('chatList');
    const chatConversation = document.getElementById('chatConversation');

    if (openChatModal && chatModal && closeChatModal && chatHeaderBar) {
        openChatModal.onclick = function() {
            chatModal.classList.add('show');
            closeChatModal.style.display = 'block';
            chatHeaderBar.style.display = 'flex';
        };
        closeChatModal.onclick = function() {
            chatModal.classList.remove('show');
        };
    }
    if (openConversation && chatList && chatConversation && closeChatModal && chatHeaderBar && backToList) {
        openConversation.onclick = function() {
            chatList.style.display = 'none';
            chatConversation.style.display = 'flex';
            closeChatModal.style.display = 'none';
            chatHeaderBar.style.display = 'none';
            setTimeout(scrollChatToBottom, 0);
        };
        backToList.onclick = function() {
            chatConversation.style.display = 'none';
            chatList.style.display = 'block';
            closeChatModal.style.display = 'block';
            chatHeaderBar.style.display = 'flex';
        };
    }

    // Chat attach and send logic (same as supplier)
    const chatAttachBtn = document.getElementById('chatAttachBtn');
    const chatFileInput = document.getElementById('chatFileInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.querySelector('.chat-conv-messages');

    if (chatAttachBtn && chatFileInput) {
        chatAttachBtn.addEventListener('click', function() {
            chatFileInput.click();
        });
    }

    

    function scrollChatToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message chat-message-you';
            msgDiv.innerHTML = `<span>${text}</span>`;
            chatMessages.appendChild(msgDiv);
            scrollChatToBottom();
            chatInput.value = '';
        }
    }

    if (chatSendBtn) {
        chatSendBtn.onclick = function() {
            sendMessage();
        };
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    if (chatFileInput) {
        chatFileInput.onchange = function() {
            if (chatFileInput.files.length > 0) {
                const file = chatFileInput.files[0];
                const fileDiv = document.createElement('div');
                fileDiv.className = 'chat-message chat-message-you';
                if (isImage(file)) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        fileDiv.innerHTML = `<img src="${e.target.result}" alt="${file.name}" style="max-width:180px;max-height:120px;border-radius:8px;display:block;margin-bottom:4px;">` +
                            `<div style="font-size:0.95rem;color:#888;">${file.name}</div>`;
                        chatMessages.appendChild(fileDiv);
                        scrollChatToBottom();
                    };
                    reader.readAsDataURL(file);
                } else if (isVideo(file)) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        fileDiv.innerHTML = `<video controls style="max-width:180px;max-height:120px;border-radius:8px;display:block;margin-bottom:4px;"><source src="${e.target.result}" type="${file.type}"></video>` +
                            `<div style="font-size:0.95rem;color:#888;">${file.name}</div>`;
                        chatMessages.appendChild(fileDiv);
                        scrollChatToBottom();
                    };
                    reader.readAsDataURL(file);
                } else if (isDocument(file)) {
                    const url = URL.createObjectURL(file);
                    fileDiv.innerHTML = `<div class="chat-message-file">${getFileTypeIcon(file.name)}<a href="${url}" download="${file.name}" style="color:#2563eb;text-decoration:underline;">${file.name}</a></div>`;
                    chatMessages.appendChild(fileDiv);
                    scrollChatToBottom();
                }
                chatFileInput.value = '';
            }
        };
    }

    function isImage(file) {
        return file.type.startsWith('image/');
    }
    function isVideo(file) {
        return file.type.startsWith('video/');
    }
    function isDocument(file) {
        return !isImage(file) && !isVideo(file);
    }
    function getFileTypeIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        if (["pdf"].includes(ext)) return '<i class="fa-solid fa-file-pdf chat-message-file-icon"></i>';
        if (["doc","docx"].includes(ext)) return '<i class="fa-solid fa-file-word chat-message-file-icon"></i>';
        if (["xls","xlsx"].includes(ext)) return '<i class="fa-solid fa-file-excel chat-message-file-icon"></i>';
        return '<i class="fa-solid fa-file-lines chat-message-file-icon"></i>';
    }
});

 // === PROFILE SETTINGS MANAGEMENT ===
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('settings-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            // Collect form data
            const username = document.getElementById('settings-username').value.trim();
            const email = document.getElementById('settings-email').value.trim();
            const first_name = document.getElementById('settings-first-name').value.trim();
            const middle_name = document.getElementById('settings-middle-name').value.trim();
            const last_name = document.getElementById('settings-last-name').value.trim();
            const role = document.getElementById('settings-role').value.trim();
            // If you have password fields, add them here
            let password = '';
            const pwInput = document.getElementById('settings-password');
            if (pwInput) password = pwInput.value.trim();
            // Prepare data
            const data = { username, email, first_name, middle_name, last_name, role };
            if (password) data.password = password;
            // Send to backend
            const res = await fetch('/admin/update_profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert('Profile updated successfully!');
                if (typeof loadPersonnelTable === 'function') loadPersonnelTable();
            } else {
                const error = await res.json();
                alert('Error: ' + (error.error || 'Could not update profile'));
            }
        });
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('settings-email').value;
            const first_name = document.getElementById('settings-first-name').value;
            const middle_name = document.getElementById('settings-middle-name').value;
            const last_name = document.getElementById('settings-last-name').value;
            const role = document.getElementById('settings-role').value;
            const profileImageInput = document.getElementById('settings-profile-image');
            const formData = new FormData();
            formData.append('email', email);
            formData.append('first_name', first_name);
            formData.append('middle_name', middle_name);
            formData.append('last_name', last_name);
            formData.append('role', role);
            if (profileImageInput && profileImageInput.files.length > 0) {
                formData.append('profile_image', profileImageInput.files[0]);
            }
            fetch('/auth/update-profile', {
                method: 'POST',
                body: formData
            })
            .then(async res => {
                let data;
                try { data = await res.json(); } catch { data = {}; }
                if (res.ok && data.success) {
                    alert('Profile updated successfully!');
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Failed to update profile.'));
                }
            })
            .catch(() => alert('Network error. Please try again.'));
        });
    }
});

// === SECURITY SETTINGS MANAGEMENT ===
document.addEventListener('DOMContentLoaded', function() {
    const securitySaveBtn = document.getElementById('security-save-btn');
    if (securitySaveBtn) {
        securitySaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const current_password = document.getElementById('security-current-password').value;
            const new_password = document.getElementById('security-new-password').value;
            const confirm_password = document.getElementById('security-confirm-password').value;
            fetch('/auth/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password,
                    new_password,
                    confirm_password
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Password updated successfully!');
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Failed to update password.'));
                }
            })
            .catch(() => alert('Network error. Please try again.'));
        });
    }
});

// === PERSONNEL MANAGEMENT ===
document.addEventListener('DOMContentLoaded', function() {
    const addPersonnelBtn = document.querySelector('.personnel-add-btn');
    if (addPersonnelBtn) {
        addPersonnelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPersonnelModal();
        });
    }
    // Load personnel table on page load
    loadPersonnelTable();
});

// Load personnel table
async function loadPersonnelTable() {
    const res = await fetch('/admin/personnel_list');
    const users = await res.json();
    const tbody = document.querySelector('.personnel-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.user_id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>********</td>
          <td>${user.first_name || ''}</td>
          <td>${user.middle_name || ''}</td>
          <td>${user.last_name || ''}</td>
          <td>${user.role}</td>
          <td>${user.last_login || ''}</td>
          <td>
            <button class="edit-personnel-btn" data-id="${user.user_id}">Edit</button>
            <button class="delete-personnel-btn" data-id="${user.user_id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
    });
    // Attach edit event listeners
    document.querySelectorAll('.edit-personnel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const user = users.find(u => u.user_id == id);
            showEditPersonnelModal(user);
        });
    });
    // Attach delete event listeners
    document.querySelectorAll('.delete-personnel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this personnel?')) {
                deletePersonnel(id);
            }
        });
    });
}

// Show personnel modal

    function showPersonnelModal() {
        if (document.getElementById('personnelModal')) return;
        const modalHTML = `
          <div id="personnelModal" class="modal" style="display:block;z-index:9999;position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);">
            <div class="modal-content" style="background:#fff;padding:30px 40px;border-radius:10px;max-width:400px;margin:60px auto;position:relative;">
              <span class="close" style="position:absolute;right:20px;top:15px;font-size:24px;cursor:pointer;">&times;</span>
              <h2>Add Personnel</h2>
              <form id="addPersonnelForm">
                <input name="username" placeholder="Username" required style="width:100%;margin-bottom:10px;" /><br/>
                <input name="email" type="email" placeholder="Email" required style="width:100%;margin-bottom:10px;" /><br/>
                <input name="password" type="password" placeholder="Password" required style="width:100%;margin-bottom:10px;" /><br/>
                <input name="first_name" placeholder="First Name" style="width:100%;margin-bottom:10px;" /><br/>
                <input name="middle_name" placeholder="Middle Name" style="width:100%;margin-bottom:10px;" /><br/>
                <input name="last_name" placeholder="Last Name" style="width:100%;margin-bottom:10px;" /><br/>
                <select name="role" required style="width:100%;margin-bottom:15px;">
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="supplier">Supplier</option>
                </select><br/>
                <button type="submit" style="width:100%;background:#2563eb;color:#fff;padding:10px 0;border:none;border-radius:5px;font-size:16px;">Create</button>
              </form>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('#personnelModal .close').onclick = function() {
            document.getElementById('personnelModal').remove();
        };
        document.getElementById('addPersonnelForm').onsubmit = async function(e) {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(this).entries());
            const res = await fetch('/admin/add_personnel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Personnel added!');
                document.getElementById('personnelModal').remove();
                loadPersonnelTable();
            } else {
                const error = await res.json();
                alert('Error: ' + (error.error || 'Could not add personnel'));
            }
        };
    }

    // Show Edit Personnel Modal
    function showEditPersonnelModal(user) {
        if (document.getElementById('personnelModal')) return;
        const modalHTML = `
          <div id="personnelModal" class="modal" style="display:block;z-index:9999;position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);">
            <div class="modal-content" style="background:#fff;padding:30px 40px;border-radius:10px;max-width:400px;margin:60px auto;position:relative;">
              <span class="close" style="position:absolute;right:20px;top:15px;font-size:24px;cursor:pointer;">&times;</span>
              <h2>Edit Personnel</h2>
              <form id="editPersonnelForm">
                <input name="username" placeholder="Username" required style="width:100%;margin-bottom:10px;" value="${user.username}" /><br/>
                <input name="email" type="email" placeholder="Email" required style="width:100%;margin-bottom:10px;" value="${user.email}" /><br/>
                <input name="password" type="password" placeholder="New Password (leave blank to keep)" style="width:100%;margin-bottom:10px;" /><br/>
                <input name="first_name" placeholder="First Name" style="width:100%;margin-bottom:10px;" value="${user.first_name || ''}" /><br/>
                <input name="middle_name" placeholder="Middle Name" style="width:100%;margin-bottom:10px;" value="${user.middle_name || ''}" /><br/>
                <input name="last_name" placeholder="Last Name" style="width:100%;margin-bottom:10px;" value="${user.last_name || ''}" /><br/>
                <select name="role" required style="width:100%;margin-bottom:15px;">
                  <option value="">Select Role</option>
                  <option value="admin" ${user.role==='admin'?'selected':''}>Admin</option>
                  <option value="staff" ${user.role==='staff'?'selected':''}>Staff</option>
                  <option value="supplier" ${user.role==='supplier'?'selected':''}>Supplier</option>
                </select><br/>
                <button type="submit" style="width:100%;background:#2563eb;color:#fff;padding:10px 0;border:none;border-radius:5px;font-size:16px;">Save Changes</button>
              </form>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.querySelector('#personnelModal .close').onclick = function() {
            document.getElementById('personnelModal').remove();
        };
        document.getElementById('editPersonnelForm').onsubmit = async function(e) {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(this).entries());
            const res = await fetch(`/admin/edit_personnel/${user.user_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Personnel updated!');
                document.getElementById('personnelModal').remove();
                loadPersonnelTable();
            } else {
                const error = await res.json();
                alert('Error: ' + (error.error || 'Could not update personnel'));
            }
        };
    }

    // Delete Personnel
    async function deletePersonnel(id) {
        const res = await fetch(`/admin/delete_personnel/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            alert('Personnel deleted!');
            loadPersonnelTable();
        } else {
            const error = await res.json();
            alert('Error: ' + (error.error || 'Could not delete personnel'));
        }
    }

// ===================== PRODUCT MANAGEMENT MODALS =====================
// --- PRODUCT TABLE RENDERING ---
function fetchAndRenderProducts() {
    fetch('/admin/product_list')
        .then(res => res.json())
        .then(products => renderProductTable(products))
        .catch(err => {
            console.error('Failed to fetch products:', err);
            const tbody = document.querySelector('.product-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="13">Failed to load products.</td></tr>';
        });
}

// --- PRODUCT IMAGE TABLE RENDERING (STUB) ---
function fetchAndRenderProductImages() {
    // Find the correct table for product images (the second .product-table in #product-section)
    const tables = document.querySelectorAll('#product-section .product-table');
    // Assumes: first is product, second is product images
    const imageTable = tables[1];
    const tbody = imageTable ? imageTable.querySelector('tbody') : null;
    fetch('/admin/product_images')
        .then(res => res.json())
        .then(images => renderProductImagesTable(images, tbody))
        .catch(err => {
            console.error('Failed to fetch product images:', err);
            if (tbody) tbody.innerHTML = '<tr><td colspan="7">Failed to load product images.</td></tr>';
        });
}

function renderProductImagesTable(images, tbody=null) {
    // Find the correct table for product images if not provided
    if (!tbody) {
        const tables = document.querySelectorAll('#product-section .product-table');
        tbody = tables[1] ? tables[1].querySelector('tbody') : null;
    }
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(images) || images.length === 0 || images.error) {
        tbody.innerHTML = '<tr><td colspan="7">No product images found.</td></tr>';
        return;
    }
    images.forEach(img => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${img.image_id || ''}</td>
            <td>${img.product_id || ''}</td>
            <td><img src="${img.image_url || ''}" alt="Product Image" style="width:48px;height:48px;object-fit:cover;border-radius:4px;"></td>
            <td>${img.image_type || ''}</td>
            <td>${img.display_order !== undefined ? img.display_order : ''}</td>
            <td>${img.text || ''}</td>
            <td><!-- Actions (edit/delete) can go here --></td>
        `;
        tbody.appendChild(tr);
    });
}


// --- PRODUCT TABLE RENDERING ---
function fetchAndRenderProducts() {
    fetch('/admin/product_list')
        .then(res => res.json())
        .then(products => renderProductTable(products))
        .catch(err => {
            console.error('Failed to fetch products:', err);
            const tbody = document.querySelector('.product-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="13">Failed to load products.</td></tr>';
        });
}

function renderProductTable(products) {
    const tbody = document.querySelector('#product-section .product-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(products) || products.length === 0 || products.error) {
        tbody.innerHTML = '<tr><td colspan="13">No products found.</td></tr>';
        return;
    }
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image && !product.image.startsWith('/static/') ? '/static/pictures/' + product.image : (product.image || '')}" alt="Product Image" style="width:48px;height:48px;object-fit:cover;border-radius:4px;"></td>
            <td>${product.product_id || ''}</td>
            <td>${product.name || ''}</td>
            <td>${product.model_number || ''}</td>
            <td>${product.description || ''}</td>
            <td>${product.category_id || ''}</td>
            <td>${product.price !== undefined ? product.price : ''}</td>
            <td>${product.updated_at || ''}</td>
            <td>${product.created_at || ''}</td>
            <td>
    <button class="update-product-btn" data-id="${product.product_id}">Update</button>
    <button class="delete-product-btn" data-id="${product.product_id}">Delete</button>
</td>
        `;
        tbody.appendChild(tr);
    });

    // Attach update event listeners
    document.querySelectorAll('.update-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            // Find the product data
            const product = products.find(p => String(p.product_id) === String(productId));
            showUpdateProductModal(product);
        });
    });

    // Attach delete event listeners
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this product?')) {
                deleteProduct(productId);
            }
        });
    });
}

// --- PRODUCT DELETE FUNCTION ---
function deleteProduct(productId) {
    if (!productId) return;
    fetch(`/admin/delete_product/${productId}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Product deleted!');
            fetchAndRenderProducts();
        } else {
            alert('Failed to delete product: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Error deleting product: ' + err));
}

// --- UPDATE PRODUCT MODAL ---
function showUpdateProductModal(product) {
    let modal = document.getElementById('update-product-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'update-product-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" id="close-update-product-modal">&times;</span>
                <h2>Update Product</h2>
                <form id="update-product-form">
                    <div class="form-group"><label>Name</label><input type="text" name="name" id="update-product-name" required></div>
                    <div class="form-group"><label>Model Number</label><input type="text" name="model_number" id="update-product-model-number"></div>
                    <div class="form-group"><label>Description</label><textarea name="description" id="update-product-description"></textarea></div>
                    <div class="form-group"><label>Category ID</label><input type="number" name="category_id" id="update-product-category-id" required></div>
                    <div class="form-group"><label>Price</label><input type="number" name="price" id="update-product-price" step="0.01" required></div>
                    <button type="submit">Save</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-update-product-modal').onclick = () => { modal.style.display = 'none'; };
        modal.onclick = function(event) { if (event.target === modal) modal.style.display = 'none'; };
    }
    // Pre-fill form
    document.getElementById('update-product-name').value = product.name || '';
    document.getElementById('update-product-model-number').value = product.model_number || '';
    document.getElementById('update-product-description').value = product.description || '';
    document.getElementById('update-product-category-id').value = product.category_id || '';
    document.getElementById('update-product-price').value = product.price || '';
    modal.style.display = 'block';

    document.getElementById('update-product-form').onsubmit = function(e) {
        e.preventDefault();
        const updatedProductData = { // Renamed for clarity
            name: document.getElementById('update-product-name').value,
            model_number: document.getElementById('update-product-model-number').value,
            description: document.getElementById('update-product-description').value,
            category_id: document.getElementById('update-product-category-id').value,
            price: document.getElementById('update-product-price').value,
        };
        // The 'product' variable is available in this scope from showUpdateProductModal(product)
        updateProduct(product.product_id, updatedProductData);
        // Modal hiding is now handled by updateProduct
    };
}

// --- UPDATE PRODUCT FUNCTION ---
function updateProduct(productId, data) {
    const modal = document.getElementById('update-product-modal');
    // Attempt to get CSRF token
    let csrfToken = null;
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
        csrfToken = csrfMeta.getAttribute('content');
    } else {
        console.warn('CSRF token meta tag not found.'); // Warn if not found
    }

    const headers = {
        'Content-Type': 'application/json'
    };
    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }

    fetch(`/admin/update_product/${productId}`, {
        method: 'PUT', // Using PUT for updates
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        // Check if response is ok (status in the range 200-299)
        if (!response.ok) {
            // If not OK, attempt to parse JSON error body, then throw an error to be caught by .catch()
            return response.json().then(errData => {
                throw new Error(errData.error || `Request failed with status ${response.status}`);
            }).catch(() => { // If error body is not JSON or other parsing error
                throw new Error(`Request failed with status ${response.status} and error body could not be parsed.`);
            });
        }
        return response.json(); // If OK, parse JSON response
    })
    .then(result => {
        if (result.success) {
            alert('Product updated successfully!');
            if (typeof fetchAndRenderProducts === 'function') {
                fetchAndRenderProducts(); // Refresh product list
            } else {
                console.warn('fetchAndRenderProducts function is not defined. Product table will not refresh automatically.');
            }
            if (modal) modal.style.display = 'none'; // Hide modal on success
        } else {
            // If server returns success:false, but request was OK (e.g. validation error)
            alert('Failed to update product: ' + (result.error || 'Unknown server error'));
        }
    })
    .catch(error => {
        // Catches errors from fetch itself (network error) or errors thrown from .then() blocks
        console.error('Error updating product:', error);
        alert('Error updating product: ' + error.message);
    });
}

// ... (rest of the code remains the same)

// --- 2. PRODUCT MODAL DROPDOWNS ---
// (Auto-fill Brand/Category dropdowns when Product modal opens)
$('#productModal').on('show.bs.modal', function() {
    fetch('/api/categories').then(r=>r.json()).then(categories => {
        const select = document.querySelector('#productModal [name="category_id"]');
        select.innerHTML = categories.map(c => `<option value="${c.category_id}" data-name="${c.category_name}">${c.category_name}</option>`).join('');
        select.onchange = function() {
            let name = '';
            if (select && select.options && select.selectedIndex >= 0 && select.options.length > 0) {
                name = select.options[select.selectedIndex].getAttribute('data-name') || '';
            }
            // If you have a category-desc span, update it here
        };
        select.onchange();
    });
});

// --- 3. PRODUCT FORM SUBMIT ---

document.addEventListener('DOMContentLoaded', function() {
    // Open Product Image Modal
    const openProductImageModalBtn = document.getElementById('openProductImageModal');
    const productImageModal = document.getElementById('productImageModal');
    if (openProductImageModalBtn && productImageModal) {
        openProductImageModalBtn.addEventListener('click', function() {
            if (typeof $ !== 'undefined' && $(productImageModal).modal) {
                $(productImageModal).modal('show');
            } else {
                productImageModal.style.display = 'block';
            }
        });
    }

    // Add Product Image Form Submit
    const productImageForm = document.getElementById('modal-product-image-form');
    if (productImageForm) {
        productImageForm.onsubmit = function(e) {
            e.preventDefault();
            const formData = new FormData(productImageForm);
            fetch('/admin/add_product_image', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (typeof $ !== 'undefined' && $(productImageModal).modal) {
                        $(productImageModal).modal('hide');
                    } else {
                        productImageModal.style.display = 'none';
                    }
                    productImageForm.reset();
                    if (typeof fetchAndRenderProductImages === 'function') fetchAndRenderProductImages();
                    alert('Product image added!');
                } else {
                    alert('Failed to add product image: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => alert('Error adding product image: ' + err));
        };
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const openProductModalBtn = document.getElementById('openProductModal');
    const addProductModal = document.getElementById('addProductModal');
    if (openProductModalBtn && addProductModal) {
        openProductModalBtn.addEventListener('click', function() {
            // Use Bootstrap's modal if available, otherwise fallback
            if (typeof $ !== 'undefined' && $(addProductModal).modal) {
                $(addProductModal).modal('show');
            } else {
                addProductModal.style.display = 'block';
            }
        });
    }
});
document.getElementById('add-product-form').onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/admin/add_product', { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            $('#addProductModal').modal('hide');
            this.reset();
            fetchAndRenderProducts();
            alert('Product added!');
        } else {
            alert('Failed to add product: ' + (data.error || 'Unknown error'));
        }
    }).catch(err => alert('Error adding product: ' + err));
};

// --- 5. PRODUCT SPEC FORM SUBMIT ---

document.addEventListener('DOMContentLoaded', function() {
    const openProductVariantModalBtn = document.getElementById('openProductVariantModal');
    const productVariantModal = document.getElementById('productVariantModal');
    if (openProductVariantModalBtn && productVariantModal) {
        openProductVariantModalBtn.addEventListener('click', function() {
            if (typeof $ !== 'undefined' && $(productVariantModal).modal) {
                $(productVariantModal).modal('show');
            } else {
                productVariantModal.style.display = 'block';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const openProductSpecModalBtn = document.getElementById('openProductSpecModal');
    const productSpecModal = document.getElementById('productSpecModal');
    if (openProductSpecModalBtn && productSpecModal) {
        openProductSpecModalBtn.addEventListener('click', function() {
            if (typeof $ !== 'undefined' && $(productSpecModal).modal) {
                $(productSpecModal).modal('show');
            } else {
                productSpecModal.style.display = 'block';
            }
        });
    }
});
document.getElementById('modal-product-spec-form').onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const product_id = formData.get('product_id');
    const spec_name = formData.get('spec_name');
    const spec_value = formData.get('spec_value');
    const display_order = formData.get('display_order') || 0;
    if (!product_id || !spec_name || !spec_value) {
        alert('Please fill out all required fields (Product ID, Specification Name, Specification Value).');
        return;
    }
    // Compose new FormData for correct backend keys
    const payload = new FormData();
    payload.append('product_id', product_id);
    payload.append('spec_name', spec_name);
    payload.append('spec_value', spec_value);
    payload.append('display_order', display_order);
        fetch('/admin/add_product_spec', { method: 'POST', body: payload })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#productSpecModal').modal('hide');
                this.reset();
                if (typeof fetchAndRenderProductSpecs === 'function') fetchAndRenderProductSpecs(product_id);
                alert('Product specification added!');
            } else {
                alert('Failed to add product specification: ' + (data.error || 'Unknown error'));
            }
        }).catch(err => alert('Error adding product specification: ' + err));
    };

    // --- PRODUCT SPEC TABLE RENDERING ---
    // Store the currently selected product ID globally
    let currentProductId = null;

    function fetchAndRenderProductSpecs(productId) {
        // If productId is provided, fetch for that product, else fetch all
        let url = '/admin/product_spec_list';
        if (productId) {
            url += `?product_id=${encodeURIComponent(productId)}`;
            currentProductId = productId;
        }
        fetch(url)
            .then(res => res.json())
            .then(specs => renderProductSpecTable(specs))
            .catch(err => {
                console.error('Failed to fetch product specs:', err);
                const tbody = document.querySelector('.product-spec-table tbody');
                if (tbody) tbody.innerHTML = '<tr><td colspan="6">Failed to load specifications.</td></tr>';
            });
    }

    function renderProductSpecTable(specs) {
        const tbody = document.querySelector('.product-spec-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!Array.isArray(specs) || specs.length === 0 || specs.error) {
            tbody.innerHTML = '<tr><td colspan="6">No specifications found.</td></tr>';
            return;
        }
        specs.forEach(spec => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${spec.spec_id || ''}</td>
                <td>${spec.product_id || ''}</td>
                <td>${spec.spec_name || ''}</td>
                <td>${spec.spec_value || ''}</td>
                <td>${spec.display_order !== undefined ? spec.display_order : ''}</td>
                <td><!-- Actions (edit/delete) can go here --></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Make the function globally available
    window.fetchAndRenderProductSpecs = fetchAndRenderProductSpecs;

    // --- 6. PRODUCT VARIANT FORM SUBMIT ---
    document.getElementById('modal-product-variant-form').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('/admin/add_product_variant', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#productVariantModal').modal('hide');
                this.reset();
                if (typeof fetchAndRenderProductVariants === 'function') fetchAndRenderProductVariants();
                alert('Product variant added!');
            } else {
                alert('Failed to add product variant: ' + (data.error || 'Unknown error'));
            }
        }).catch(err => alert('Error adding product variant: ' + err));
    };


    // --- CATEGORY TABLE RENDERING ---
    function fetchAndRenderCategories() {
        fetch('/admin/category_list')
            .then(res => res.json())
            .then(categories => renderCategoryTable(categories))
            .catch(err => {
                console.error('Failed to fetch categories:', err);
                const tbody = document.querySelector('.category-table tbody');
                if (tbody) tbody.innerHTML = '<tr><td colspan="4">Failed to load categories.</td></tr>';
            });
    }
    function renderCategoryTable(categories) {
        const tbody = document.querySelector('.category-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!Array.isArray(categories) || categories.length === 0 || categories.error) {
            tbody.innerHTML = '<tr><td colspan="4">No categories found.</td></tr>';
            return;
        }
        categories.forEach(cat => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cat.category_id || ''}</td>
                <td>${cat.category_name || ''}</td>
                <td>${cat.parent_category_id || ''}</td>
                <td><!-- Actions (edit/delete) can go here --></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- 8. CATEGORY FORM SUBMIT ---
    document.getElementById('modal-category-form').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('/admin/add_category', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#categoryModal').modal('hide');
                this.reset();
                if (typeof fetchAndRenderCategories === 'function') fetchAndRenderCategories();
                alert('Category added!');
            } else {
                alert('Failed to add category: ' + (data.error || 'Unknown error'));
            }
        }).catch(err => alert('Error adding category: ' + err));
    };

// ================= CUSTOMER ORDER MANAGEMENT =================

function fetchAndRenderCustomerOrders() {
    fetch('/admin/orders_list')
        .then(res => res.json())
        .then(orders => renderCustomerOrdersTable(orders))
        .catch(err => {
            console.error('Failed to fetch customer orders:', err);
            renderCustomerOrdersTable([]);
        });
}

function renderCustomerOrdersTable(orders) {
    const tbody = document.querySelector('#customer-orders-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="14">No orders found.</td></tr>'; // Adjust colspan as needed
        return;
    }
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-order-id', order.order_id);
        tr.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.username || ''}</td>

            <td>${order.order_date || ''}</td>
            <td>${order.product_name || ''}</td>
            <td>${order.quantity || ''}</td>
            <td>${order.total_amount || ''}</td>
            <td>${order.payment_method || ''}</td>
            <td>
                <select class="order-status-dropdown" data-order-id="${order.order_id}">
                    <option value="1" ${order.status_name === 'To Pay' ? 'selected' : ''}>To Pay</option>
                    <option value="2" ${order.status_name === 'To Ship' ? 'selected' : ''}>To Ship</option>
                    <option value="3" ${order.status_name === 'To Receive' ? 'selected' : ''}>To Receive</option>
                    <option value="4" ${order.status_name === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="5" ${order.status_name === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    <option value="6" ${order.status_name === 'Refunded' ? 'selected' : ''}>Refunded</option>
                    <option value="7" ${order.status_name === 'Returned' ? 'selected' : ''}>Returned</option>
                </select>
            </td>
            <td>${order.courier || ''}</td>
            <td>${order.reference_number || ''}</td>
            <td>${order.tracking_status_name || ''}</td>
            <td>${order.created_at || ''}</td>
            <td>${order.updated_at || ''}</td>
        `;
        tbody.appendChild(tr);
    });


    // Attach change listener for Order Status dropdowns
    tbody.querySelectorAll('.order-status-dropdown').forEach(select => {
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text;
            const orderId = this.getAttribute('data-order-id');
            if (selectedOption === 'To Ship') {
                // Get current values for the order
                const row = this.closest('tr');
                const currentCourier = row.children[8].textContent.trim();
                const currentReference = row.children[9].textContent.trim();
                const currentTracking = row.children[10].textContent.trim();
                // Inject modal HTML if not already present
                let modal = document.getElementById('toShipModal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'toShipModal';
                    modal.innerHTML = `
                        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;">
                            <div style="background:#fff;padding:24px 32px;border-radius:10px;min-width:320px;max-width:90vw;box-shadow:0 2px 16px rgba(0,0,0,0.16);position:relative;">
                                <h3 style="margin-top:0;">Update Shipping Details</h3>
                                <form id="toShipForm">
                                    <div style="margin-bottom:12px;">
                                        <label>Courier</label>
<select id="modalCourier" class="form-control" style="width:100%;">
    <option value="J&T">J&amp;T</option>
    <option value="Lalamove">Lalamove</option>
    <option value="Ninja Van">Ninja Van</option>
    <option value="Flash Express">Flash Express</option>
    <option value="2GO">2GO</option>
</select>
                                    </div>
                                    <div style="margin-bottom:12px;">
                                        <label>Reference Number</label>
                                        <input type="text" id="modalReference" class="form-control" value="${currentReference}" style="width:100%;">
                                    </div>
                                    <div style="margin-bottom:12px;">
                                        <label>Tracking Status</label>
                                        <select id="modalTracking" class="form-control" style="width:100%;">
                                            <option value="1">Order Placed</option>
                                            <option value="2">Processing</option>
                                            <option value="3">Ready to Ship</option>
                                            <option value="4">Shipped</option>
                                            <option value="5">In Transit</option>
                                            <option value="6">Out for Delivery</option>
                                            <option value="7">Delivered</option>
                                            <option value="8">Failed Delivery</option>
                                            <option value="9">Returned to Seller</option>
                                            <option value="10">Cancelled</option>
                                            <option value="11">Return/Refund in Progress</option>
                                            <option value="12">Return/Refund Completed</option>
                                        </select>
                                    </div>
                                    <div style="text-align:right;">
                                        <button type="button" id="closeToShipModal" style="margin-right:8px;">Cancel</button>
                                        <button type="submit">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modal);
                } else {
                    modal.style.display = 'flex';
                    document.getElementById('modalCourier').value = currentCourier;
                    document.getElementById('modalReference').value = currentReference;
                    document.getElementById('modalTracking').value = '';
                }
                // Set tracking status value if possible
                const modalTracking = document.getElementById('modalTracking');
                for (let i = 0; i < modalTracking.options.length; i++) {
                    if (modalTracking.options[i].text === currentTracking) {
                        modalTracking.selectedIndex = i;
                        break;
                    }
                }
                // Close modal handler
                document.getElementById('closeToShipModal').onclick = function() {
                    modal.style.display = 'none';
                };
                // Submit handler
                document.getElementById('toShipForm').onsubmit = function(e) {
                    e.preventDefault();
                    const courier = document.getElementById('modalCourier').value;
                    const referenceNumber = document.getElementById('modalReference').value;
                    const trackingStatusId = document.getElementById('modalTracking').value;
                    fetch(`/admin/update_tracking/${orderId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            courier: courier,
                            reference_number: referenceNumber,
                            tracking_status_id: trackingStatusId
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.success) {
                            alert('Failed to update tracking info: ' + (data.error || 'Unknown error'));
                        } else {
                            modal.style.display = 'none';
                            fetchAndRenderCustomerOrders();
                        }
                    })
                    .catch(err => alert('Failed to update tracking info: ' + err));
                };
            }
        });
    });
}

// ===================== CANCELLED ORDERS =====================
function fetchAndRenderCancelledOrders() {
    fetch('/admin/cancelled_orders')
        .then(res => res.json())
        .then(cancelledOrders => renderCancelledOrdersTable(cancelledOrders))
        .catch(err => {
            console.error('Failed to fetch cancelled orders:', err);
            renderCancelledOrdersTable([]);
        });
}

function renderCancelledOrdersTable(cancelledOrders) {
    const tbody = document.querySelector('#cancelled-order-items-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(cancelledOrders) || cancelledOrders.length === 0 || cancelledOrders.error) {
        tbody.innerHTML = '<tr><td colspan="5">No cancelled orders found.</td></tr>';
        return;
    }
    cancelledOrders.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.cancellation_id || ''}</td>
            <td>${item.order_id || ''}</td>
            <td>${item.cancellation_reason || ''}</td>
            <td>${item.other_reason || ''}</td>
            <td>${item.cancelled_at || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}




// Handle status dropdown change
// Use event delegation for dynamically rendered dropdowns

document.addEventListener('change', function(e) {
    if (e.target.classList.contains('order-status-dropdown')) {
        const orderId = e.target.getAttribute('data-order-id');
        const statusId = e.target.value;
        fetch(`/admin/update_order_status/${orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status_id: statusId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                fetchAndRenderCustomerOrders();
            } else {
                alert('Failed to update order status: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(err => alert('Failed to update order status: ' + err));
    }
});

// Ensure customer orders are fetched and rendered on page load if the table is present
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('customer-orders-table')) {
        fetchAndRenderCustomerOrders();
    }
});

function fetchAndRenderOrderItems() {
    fetch('/admin/order_items_list')
        .then(res => res.json())
        .then(items => renderOrderItemsTable(items))
        .catch(err => {
            console.error('Failed to fetch order items:', err);
            renderOrderItemsTable([]);
        });
}

function renderOrderItemsTable(items) {
    const tbody = document.querySelector('#order-items-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="8">No order items found.</td></tr>';
        return;
    }
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.item_id}</td>
            <td>${item.order_id}</td>
            <td>${item.product_id}</td>
            <td>${item.variant_id || ''}</td>
            <td>${item.quantity}</td>
            <td>${item.unit_price}</td>
            <td>${item.discount_amount}</td>
            <td>
                <!-- Actions if needed -->
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Ensure order items are fetched and rendered on page load if the table is present
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('order-items-table')) {
        fetchAndRenderOrderItems();
    }
});

// SALES
function fetchAndRenderSales() {
    fetch('/admin/sales_list')
        .then(res => res.json())
        .then(data => renderSalesTable(data))
        .catch(err => console.error('Failed to fetch sales:', err));
}

function renderSalesTable(items) {
    const tbody = document.querySelector('.sales-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="7">No sales found.</td></tr>';
        return;
    }
    items.forEach(sale => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sale.sales_id}</td>
            <td>${sale.order_id}</td>
            <td>${sale.product_id}</td>
            <td>${sale.user_id}</td>
            <td>${sale.sale_date}</td>
            <td>${sale.total_amount}</td>
            <td>${sale.payment_id}</td>
            <td>
                <button class="edit-sale-btn" data-id="${sale.sales_id}">Edit</button>
                <button class="delete-sale-btn" data-id="${sale.sales_id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderSales();
});

// CRITICAL STOCK
function fetchAndRenderCriticalStock() {
    fetch('/admin/critical_stock')
        .then(res => res.json())
        .then(data => renderCriticalStockTable(data))
        .catch(err => console.error('Failed to fetch critical stock:', err));
}

function renderCriticalStockTable(items) {
    const tbody = document.querySelector('.critical-stock-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="7">No critical stock found.</td></tr>';
        return;
    }
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.product_id}</td>
            <td>${item.product_name}</td>
            <td>${item.supplier_name}</td>
            <td>${item.available_stock}</td>
            <td style="color:red;">&#9888; ${item.alert_level}</td>
            <td>${item.below_minimum}</td>
            <td><a href="#" class="notify-btn" data-id="${item.product_id}">Notify Supplier</a></td>
        `;
        tbody.appendChild(tr);
    });

    // Optional: Add click event listeners for the notify buttons
    // Use event delegation for dynamically created rows
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('notify-btn')) {
            e.preventDefault();
            // Get product details from the row
            const row = e.target.closest('tr');
            const productId = row.children[0].textContent;
            const productName = row.children[1].textContent;
            const supplierName = row.children[2].textContent;
            // Try to get supplier price from a data attribute, fallback to blank
            let supplierPrice = e.target.getAttribute('data-supplier-price') || '';
            if (!supplierPrice && row.children[3]) {
                supplierPrice = row.children[3].textContent;
            }
            const belowMinimum = row.children[5].textContent;

            // Fill modal
            document.getElementById('modalProductId').value = productId;
            document.getElementById('modalProductName').textContent = productName;
            document.getElementById('modalSupplierName').textContent = supplierName;
            document.getElementById('modalSupplierPrice').textContent = supplierPrice;
            document.getElementById('modalQuantityRequested').value = belowMinimum.replace(/[^\d]/g, ''); // default quantity = below minimum

            document.getElementById('notifySupplierModal').style.display = 'block';
        }
    });

    // Close modal
    document.getElementById('closeNotifyModal').onclick = function() {
        document.getElementById('notifySupplierModal').style.display = 'none';
    };

    // Submit notify supplier form
    document.getElementById('notifySupplierForm').onsubmit = function(e) {
        e.preventDefault();
        const productId = document.getElementById('modalProductId').value;
        const quantityRequested = document.getElementById('modalQuantityRequested').value;
        const notes = document.getElementById('modalNotes').value;

        fetch('/admin/notify_supplier', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                product_id: productId,
                quantity_requested: quantityRequested,
                notes: notes
            })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            document.getElementById('notifySupplierModal').style.display = 'none';
        });
    };
}

// Call this function on page load or when dashboard is shown
document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderCriticalStock();
});

// CRITICAL STOCK
function fetchAndRenderCriticalStock() {
    fetch('/admin/critical_stock')
        .then(res => res.json())
        .then(data => renderCriticalStockTable(data))
        .catch(err => console.error('Failed to fetch critical stock:', err));
}

function renderCriticalStockTable(items) {
    const tbody = document.querySelector('.critical-stock-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="7">No critical stock found.</td></tr>';
        return;
    }
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.product_id}</td>
            <td>${item.product_name}</td>
            <td>${item.supplier_name}</td>
            <td>${item.available_stock}</td>
            <td style="color:red;">&#9888; ${item.alert_level}</td>
            <td>${item.below_minimum}</td>
            <td>
                <a href="#" class="notify-btn"
                   data-id="${item.product_id}"
                   data-product-name="${item.product_name}"
                   data-supplier-name="${item.supplier_name}"
                   data-supplier-price="${item.supplier_price || ''}"
                   data-below-minimum="${item.below_minimum}">
                   Notify Supplier
                </a>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Update the total-stocks-number span
    const totalStocksSpan = document.querySelector('.total-stocks-number');
    if (totalStocksSpan) {
        totalStocksSpan.textContent = items.length;
    }
}

// Set up event listeners ONCE after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderCriticalStock();

    // Event delegation for Notify Supplier button
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('notify-btn')) {
            e.preventDefault();
            // Use data attributes for reliability
            const btn = e.target;
            document.getElementById('modalProductId').value = btn.getAttribute('data-id');
            document.getElementById('modalProductName').textContent = btn.getAttribute('data-product-name');
            document.getElementById('modalSupplierName').textContent = btn.getAttribute('data-supplier-name');
            document.getElementById('modalSupplierPrice').textContent = btn.getAttribute('data-supplier-price') || '';
            document.getElementById('modalQuantityRequested').value = btn.getAttribute('data-below-minimum').replace(/[^\d]/g, '');
            document.getElementById('notifySupplierModal').style.display = 'block';
        }
    });

    // Close modal
    document.getElementById('closeNotifyModal').onclick = function() {
        document.getElementById('notifySupplierModal').style.display = 'none';
    };

    // Submit notify supplier form
    document.getElementById('notifySupplierForm').onsubmit = function(e) {
        e.preventDefault();
        const productId = document.getElementById('modalProductId').value;
        const quantityRequested = document.getElementById('modalQuantityRequested').value;
        const notes = document.getElementById('modalNotes').value;

        fetch('/admin/notify_supplier', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                product_id: productId,
                quantity_requested: quantityRequested,
                notes: notes
            })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            document.getElementById('notifySupplierModal').style.display = 'none';
        });
    };
});

// SUPPLY REQUEST
function fetchAndRenderSupplyRequests() {
    fetch('/admin/supply_requests')
        .then(res => res.json())
        .then(data => renderSupplyRequestTable(data));
}

function renderSupplyRequestTable(requests) {
    const tbody = document.querySelector('.supply-request-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!requests.length) {
        tbody.innerHTML = '<tr><td colspan="10">No supply requests found.</td></tr>';
        return;
    }
    requests.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${req.request_id}</td>
            <td>${req.product_id}</td>
            <td>${req.product_name}</td>
            <td>${req.supplier_price}</td>
            <td>${req.requested_by}</td>
            <td>${req.quantity_requested}</td>
            <td>${req.status}</td>
            <td>${req.notes}</td>
            <td>${req.request_date}</td>
            <td>${req.updated_at}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Call this on DOMContentLoaded so the table is filled when the admin page loads
document.addEventListener('DOMContentLoaded', fetchAndRenderSupplyRequests);

// Fetch and render reviews for the admin reviews table
function fetchAndRenderReviewsTable() {
    const tbody = document.querySelector('#reviews-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#2563eb;">Loading reviews...</td></tr>';
    fetch('/admin/reviews_report')
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;">No reviews found.</td></tr>';
                return;
            }
            tbody.innerHTML = data.map(r => `
                <tr>
                    <td>${r.review_id}</td>
                    <td>${r.product_id}</td>
                    <td>${r.order_id}</td>
                    <td>${r.user_id}</td>
                    <td>${r.rating}</td>
                    <td>${r.comment}</td>
                    <td>${r.created_at}</td>
                </tr>
            `).join('');
        })
        .catch(error => {
            tbody.innerHTML = '<tr><td colspan="7" style="color:red; text-align:center;">Failed to load reviews.</td></tr>';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderReviewsTable();
});
