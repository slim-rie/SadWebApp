// Supplier Section Functionality

document.addEventListener('DOMContentLoaded', function() {
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

    // --- PRODUCT TABLES ---
    if (typeof fetchAndRenderProducts === 'function') fetchAndRenderProducts();
    if (typeof fetchAndRenderProductImages === 'function') fetchAndRenderProductImages();
    if (typeof fetchAndRenderProductSpecs === 'function') fetchAndRenderProductSpecs();
    if (typeof fetchAndRenderProductVariants === 'function') fetchAndRenderProductVariants();
    if (typeof fetchAndRenderBrands === 'function') fetchAndRenderBrands();
    if (typeof fetchAndRenderCategories === 'function') fetchAndRenderCategories();
    // --- CUSTOMER ORDERS TABLE ---
    if (document.getElementById('customer-orders-table') && typeof fetchAndRenderCustomerOrders === 'function') {
        fetchAndRenderCustomerOrders();
    }
});

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
            <td>${s.product_category || ''}</td>
            <td>${s.product_name || ''}</td>
            <td>${s.supplier_name || ''}</td>
            <td>${s.contact_person || ''}</td>
            <td>${s.phone_number || ''}</td>
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
                <label for="supplier-product-category">Product Category</label>
                <select id="supplier-product-category" name="product_category">
                  <option value="Sewing Machine">Sewing Machine</option>
                  <option value="Sewing Parts">Sewing Parts</option>
                  <option value="Fabrics">Fabrics</option>
                </select>
              </div>
              <div class="form-group">
                <label for="supplier-product-name">Product Name</label>
                <input type="text" id="supplier-product-name" name="product_name" required>
              </div>
              <div class="form-group">
                <label for="supplier-supplier-name">Supplier Name</label>
                <input type="text" id="supplier-supplier-name" name="supplier_name" required>
              </div>
              <div class="form-group">
                <label for="supplier-contact-person">Contact Person</label>
                <input type="text" id="supplier-contact-person" name="contact_person">
              </div>
              <div class="form-group">
                <label for="supplier-phone-number">Phone Number</label>
                <input type="text" id="supplier-phone-number" name="phone_number">
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
        document.getElementById('supplier-product-category').value = "";
        document.getElementById('supplier-product-name').value = "";
        document.getElementById('supplier-supplier-name').value = "";
        document.getElementById('supplier-contact-person').value = "";
        document.getElementById('supplier-phone-number').value = "";
        document.getElementById('supplier-address').value = "";
        document.getElementById('supplier-status').value = "Active";

        // Change modal title for clarity
        modal.querySelector('h2').textContent = "Add Supplier";

        // Handle form submission for adding
        const form = modal.querySelector('#add-supplier-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            const supplier = {
                product_category: document.getElementById('supplier-product-category').value,
                product_name: document.getElementById('supplier-product-name').value,
                supplier_name: document.getElementById('supplier-supplier-name').value,
                contact_person: document.getElementById('supplier-contact-person').value,
                phone_number: document.getElementById('supplier-phone-number').value,
                address: document.getElementById('supplier-address').value,
                status: document.getElementById('supplier-status').value
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
    document.getElementById('supplier-product-category').value = supplier.product_category;
    document.getElementById('supplier-product-name').value = supplier.product_name;
    document.getElementById('supplier-supplier-name').value = supplier.supplier_name;
    document.getElementById('supplier-contact-person').value = supplier.contact_person;
    document.getElementById('supplier-phone-number').value = supplier.phone_number;
    document.getElementById('supplier-address').value = supplier.address;
    document.getElementById('supplier-status').value = supplier.status;

    // Change the form submission logic
    const form = modal.querySelector('#add-supplier-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const updatedSupplier = {
            product_category: document.getElementById('supplier-product-category').value,
            product_name: document.getElementById('supplier-product-name').value,
            supplier_name: document.getElementById('supplier-supplier-name').value,
            contact_person: document.getElementById('supplier-contact-person').value,
            phone_number: document.getElementById('supplier-phone-number').value,
            address: document.getElementById('supplier-address').value,
            status: document.getElementById('supplier-status').value
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
            <td>${i.id}</td>
            <td>${i.product_name}</td>
            <td>${i.product_code}</td>
            <td>${i.category_name}</td>
            <td>${i.selling_price}</td>
            <td>${i.min_stock}</td>
            <td>${i.max_stock}</td>
            <td>${i.last_updated}</td>
            <td>${i.supplier_name}</td>
            <td>${i.supplier_price}</td>
            <td>${i.available_stock}</td>
            <td>${i.stock_status}</td>
            <td>${i.product_status}</td>
            <td>${i.memo}</td>
            <td>
                <button class="update-inventory-btn" data-id="${i.id}">Update</button>
                <button class="delete-inventory-btn" data-id="${i.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.update-inventory-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const item = items.find(i => i.id == id); // Make sure you have access to the items array
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
    let modal = document.getElementById('add-inventory-modal');
    if (!modal) {
        // Inject modal CSS if not present
        if (!document.getElementById('add-inventory-modal-style')) {
            const style = document.createElement('style');
            style.id = 'add-inventory-modal-style';
            style.textContent = `
                .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100vw; height: 100vh; overflow: auto; background: rgba(0,0,0,0.4); }
                .modal-content { background: #fff; margin: 10% auto; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; position: relative; }
                .modal .close { position: absolute; right: 16px; top: 8px; color: #aaa; font-size: 24px; cursor: pointer; }
                .modal .close:hover { color: #333; }
                .form-group { margin-bottom: 1em; }
                .form-group label { display: block; margin-bottom: 0.3em; }
                .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.5em; border: 1px solid #ccc; border-radius: 4px; }
            `;
            document.head.appendChild(style);
        }
        // Create modal HTML
        modal = document.createElement('div');
        modal.id = 'add-inventory-modal';
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close" id="close-add-inventory-modal">&times;</span>
            <h2>Add Inventory Item</h2>
            <form id="add-inventory-form">
              <div class="form-group">
                <label for="inventory-product-name">Product Name</label>
                <input type="text" id="inventory-product-name" name="product_name" required>
              </div>
              <div class="form-group">
                <label for="inventory-product-code">Product Code</label>
                <input type="text" id="inventory-product-code" name="product_code" required>
              </div>
              <div class="form-group">
                <label for="inventory-category-name">Category Name</label>
                <select id="inventory-category-name" name="category_name" required>
                  <option value="">Select a category</option>
                  <option value="Sewing Machines">Sewing Machines</option>
                  <option value="Machine Parts">Sewing Machine Parts</option>
                  <option value="Fabric">Fabric</option>
                </select>
              </div>
              <div class="form-group">
                <label for="inventory-selling-price">Selling Price</label>
                <input type="number" step="0.01" id="inventory-selling-price" name="selling_price" required>
              </div>
              <div class="form-group">
                <label for="inventory-min-stock">Min Stock</label>
                <input type="number" id="inventory-min-stock" name="min_stock" required>
              </div>
              <div class="form-group">
                <label for="inventory-max-stock">Max Stock</label>
                <input type="number" id="inventory-max-stock" name="max_stock" required>
              </div>
              <div class="form-group">
                <label for="inventory-supplier-name">Supplier Name</label>
                <input type="text" id="inventory-supplier-name" name="supplier_name" required>
              </div>
              <div class="form-group">
                <label for="inventory-supplier-price">Supplier Price</label>
                <input type="number" step="0.01" id="inventory-supplier-price" name="supplier_price" required>
              </div>
              <div class="form-group">
                <label for="inventory-available-stock">Available Stock</label>
                <input type="number" id="inventory-available-stock" name="available_stock" required>
              </div>
              <div class="form-group">
                <label for="inventory-stock-status">Stock Status</label>
                <input type="text" id="inventory-stock-status" name="stock_status" required>
              </div>
              <div class="form-group">
                <label for="inventory-product-status">Product Status</label>
                <select id="inventory-product-status" name="product_status" required>
                  <option value="Good">Good</option>
                  <option value="Defective">Defective</option>
                  <option value="Return">Return</option>
                </select>
              </div>
              <div class="form-group">
                <label for="inventory-memo">Memo</label>
                <textarea id="inventory-memo" name="memo"></textarea>
              </div>
              <div style="text-align:right;">
                <button type="button" id="cancel-add-inventory-btn">Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        `;
        document.body.appendChild(modal);
        // Modal open/close logic
        const closeBtn = modal.querySelector('#close-add-inventory-modal');
        const cancelBtn = modal.querySelector('#cancel-add-inventory-btn');
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        cancelBtn.onclick = () => { modal.style.display = 'none'; };
        modal.addEventListener('click', function(event) {
            if (event.target === modal) modal.style.display = 'none';
        });

         // Reset form fields
         document.getElementById('inventory-product-name').value = "";
         document.getElementById('inventory-product-code').value = "";
         document.getElementById('inventory-category-name').value = "";
         document.getElementById('inventory-selling-price').value = "";
         document.getElementById('inventory-min-stock').value = "";
         document.getElementById('inventory-max-stock').value = "";
         document.getElementById('inventory-supplier-name').value = "";
         document.getElementById('inventory-supplier-price').value = "";
         document.getElementById('inventory-available-stock').value = "";
         document.getElementById('inventory-stock-status').value = "";
         document.getElementById('inventory-product-status').value = "";
         document.getElementById('inventory-memo').value = "";
 
         // Change modal title for clarity
         modal.querySelector('h2').textContent = "Add Inventory";
        // Handle form submission
        const form = modal.querySelector('#add-inventory-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            const inventory = {
                product_name: document.getElementById('inventory-product-name').value,
                product_code: document.getElementById('inventory-product-code').value,
                category_name: document.getElementById('inventory-category-name').value,
                selling_price: parseFloat(document.getElementById('inventory-selling-price').value),
                min_stock: parseInt(document.getElementById('inventory-min-stock').value),
                max_stock: parseInt(document.getElementById('inventory-max-stock').value),
                supplier_name: document.getElementById('inventory-supplier-name').value,
                supplier_price: parseFloat(document.getElementById('inventory-supplier-price').value),
                available_stock: parseInt(document.getElementById('inventory-available-stock').value),
                stock_status: document.getElementById('inventory-stock-status').value,
                product_status: document.getElementById('inventory-product-status').value,
                memo: document.getElementById('inventory-memo').value
            };
            addInventory(inventory);
            modal.style.display = 'none';
            form.reset();
        };
    }
    modal.style.display = 'block';
}

function showUpdateInventoryModal(item) {
    let modal = document.getElementById('add-inventory-modal');
    if (!modal) {
        showAddInventoryModal(); 
        modal = document.getElementById('add-inventory-modal');
    }
    modal.querySelector('h2').textContent = "Update Inventory";
    // Pre-fill the form fields using correct keys and IDs
    document.getElementById('inventory-product-name').value = item.product_name || "";
    document.getElementById('inventory-product-code').value = item.product_code || "";
    document.getElementById('inventory-category-name').value = item.category_name || "";
    document.getElementById('inventory-selling-price').value = item.selling_price || "";
    document.getElementById('inventory-min-stock').value = item.min_stock || "";
    document.getElementById('inventory-max-stock').value = item.max_stock || "";
    document.getElementById('inventory-supplier-name').value = item.supplier_name || "";
    document.getElementById('inventory-supplier-price').value = item.supplier_price || "";
    document.getElementById('inventory-available-stock').value = item.available_stock || "";
    document.getElementById('inventory-stock-status').value = item.stock_status || "";
    document.getElementById('inventory-product-status').value = item.product_status || "";
    document.getElementById('inventory-memo').value = item.memo || "";

    // Change the form submission logic
    const form = modal.querySelector('#add-inventory-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const updatedItem = {
            product_name: document.getElementById('inventory-product-name').value,
            product_code: document.getElementById('inventory-product-code').value,
            category_name: document.getElementById('inventory-category-name').value,
            selling_price: parseFloat(document.getElementById('inventory-selling-price').value),
            min_stock: parseInt(document.getElementById('inventory-min-stock').value),
            max_stock: parseInt(document.getElementById('inventory-max-stock').value),
            supplier_name: document.getElementById('inventory-supplier-name').value,
            supplier_price: parseFloat(document.getElementById('inventory-supplier-price').value),
            available_stock: parseInt(document.getElementById('inventory-available-stock').value),
            stock_status: document.getElementById('inventory-stock-status').value,
            product_status: document.getElementById('inventory-product-status').value,
            memo: document.getElementById('inventory-memo').value
        };
        updateInventory(item.id, updatedItem);
        modal.style.display = 'none';
        form.reset();
    };
    modal.style.display = 'block';
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


function closeAddInventoryModal() {
    const modal = document.getElementById('add-inventory-modal');
    if (modal) {
        modal.style.display = 'none';
    }
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
            closeAddInventoryModal();
            // Wait for modal to close, then refresh table
            setTimeout(() => {
                fetchAndRenderInventory();
                alert('Inventory item added!');
            }, 300); // Adjust delay as needed
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        alert('Error adding inventory item: ' + error);
        console.error('Error:', error);
    });
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

function contactInventory(id) {
    alert("Contact Inventory functionality for ID: " + id + " is not yet implemented.");
    // You can implement your actual contact logic here (e.g., open a modal, send an email, etc.)
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderProducts();
    fetchAndRenderProductImages();
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
        .then(images => renderProductImageTable(images, tbody))
        .catch(err => {
            console.error('Failed to fetch product images:', err);
            if (tbody) tbody.innerHTML = '<tr><td colspan="7">Failed to load product images.</td></tr>';
        });
}

function renderProductImageTable(images, tbody=null) {
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
            <td><img src="${product.image || ''}" alt="Product Image" style="width:48px;height:48px;object-fit:cover;border-radius:4px;"></td>
            <td>${product.product_id || ''}</td>
            <td>${product.name || ''}</td>
            <td>${product.model_number || ''}</td>
            <td>${product.description || ''}</td>
            <td>${product.category_id || ''}</td>
            <td>${product.price !== undefined ? product.price : ''}</td>
            <td>${product.discount !== undefined && product.discount !== null ? product.discount : ''}</td>
            <td>${product.stock_quantity !== undefined ? product.stock_quantity : ''}</td>
            <td>${product.created_at || ''}</td>
            <td>${product.updated_at || ''}</td>
            <td>${product.brand_id || ''}</td>
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
                    <div class="form-group"><label>Discount</label><input type="number" name="discount" id="update-product-discount" step="0.01"></div>
                    <div class="form-group"><label>Stock Quantity</label><input type="number" name="stock_quantity" id="update-product-stock-quantity"></div>
                    <div class="form-group"><label>Brand ID</label><input type="number" name="brand_id" id="update-product-brand-id"></div>
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
    document.getElementById('update-product-discount').value = product.discount || '';
    document.getElementById('update-product-stock-quantity').value = product.stock_quantity || '';
    document.getElementById('update-product-brand-id').value = product.brand_id || '';
    modal.style.display = 'block';

    document.getElementById('update-product-form').onsubmit = function(e) {
        e.preventDefault();
        const updated = {
            name: document.getElementById('update-product-name').value,
            model_number: document.getElementById('update-product-model-number').value,
            description: document.getElementById('update-product-description').value,
            category_id: document.getElementById('update-product-category-id').value,
            price: document.getElementById('update-product-price').value,
            discount: document.getElementById('update-product-discount').value,
            stock_quantity: document.getElementById('update-product-stock-quantity').value,
            brand_id: document.getElementById('update-product-brand-id').value
        };
        updateProduct(product.product_id, updated);
        modal.style.display = 'none';
    };
}

function updateProduct(productId, updated) {
    fetch(`/admin/update_product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            fetchAndRenderProducts();
        } else {
            alert('Failed to update product: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => alert('Failed to update product: ' + err));
}


// --- DEBUGGING DELETE FUNCTION ---
function deleteProduct(productId) {
    console.log('[DEBUG] Attempting to delete product with ID:', productId);
    fetch(`/admin/delete_product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async res => {
        let data;
        try {
            data = await res.json();
        } catch (e) {
            alert('Failed to parse server response.');
            console.error('[DEBUG] Parse error:', e, res);
            return;
        }
        console.log('[DEBUG] Delete response:', data);
        if (res.ok && data.success) {
            fetchAndRenderProducts();
        } else {
            alert('Failed to delete product: ' + (data.error || 'Unknown error'));
            console.error('[DEBUG] Delete failed:', data);
        }
    })
    .catch(err => {
        alert('Failed to delete product: ' + err);
        console.error('[DEBUG] Network or server error:', err);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // --- 1. OPEN MODALS ---
    document.getElementById('openProductModal').onclick = () => $('#productModal').modal('show');
    fetchAndRenderProducts();
    document.getElementById('openProductImageModal').onclick = () => $('#productImageModal').modal('show');
    document.getElementById('openProductSpecModal').onclick = () => $('#productSpecModal').modal('show');
    document.getElementById('openProductVariantModal').onclick = () => $('#productVariantModal').modal('show');
    document.getElementById('openBrandModal').onclick = () => $('#brandModal').modal('show');
    document.getElementById('openCategoryModal').onclick = () => $('#categoryModal').modal('show');

    // --- PRODUCT SPEC TABLE: Always fetch and render ALL product specifications on page load ---
    fetchAndRenderProductSpecs();

    // --- PRODUCT VARIANT TABLE: Always fetch and render ALL product variants on page load ---
    fetchAndRenderProductVariants();
    // --- BRAND TABLE: Always fetch and render ALL brands on page load ---
    fetchAndRenderBrands();
    // --- CATEGORY TABLE: Always fetch and render ALL categories on page load ---
    fetchAndRenderCategories();


    function fetchAndRenderProductVariants() {
        fetch('/admin/product_variant_list')
            .then(res => res.json())
            .then(variants => renderProductVariantTable(variants))
            .catch(err => {
                console.error('Failed to fetch product variants:', err);
                const tbody = document.querySelector('.product-variant-table tbody');
                if (tbody) tbody.innerHTML = '<tr><td colspan="9">Failed to load product variants.</td></tr>';
            });
    }

    function renderProductVariantTable(variants) {
    console.log('Product Variants received:', variants);
        const tbody = document.querySelector('.product-variant-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!Array.isArray(variants) || variants.length === 0 || variants.error) {
            tbody.innerHTML = '<tr><td colspan="9">No product variants found.</td></tr>';
            return;
        }
        variants.forEach(variant => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${variant.variant_id || ''}</td>
                <td>${variant.product_id || ''}</td>
                <td>${variant.variant_name || ''}</td>
                <td>${variant.variant_value || ''}</td>
                <td>${variant.additional_price !== undefined ? variant.additional_price : ''}</td>
                <td>${variant.stock_quantity !== undefined ? variant.stock_quantity : ''}</td>
                <td>${variant.created_at || ''}</td>
                <td>${variant.updated_at || ''}</td>
                <td><!-- Actions (edit/delete) can go here --></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- 2. PRODUCT MODAL DROPDOWNS ---
    // (Auto-fill Brand/Category dropdowns when Product modal opens)
    $('#productModal').on('show.bs.modal', function() {
        fetch('/api/brands').then(r=>r.json()).then(brands => {
            const select = document.querySelector('#productModal [name="brand_id"]');
            select.innerHTML = brands.map(b => `<option value="${b.brand_id}" data-desc="${b.description}">${b.brand_name}</option>`).join('');
            select.onchange = function() {
                let desc = '';
                if (select && select.options && select.selectedIndex >= 0 && select.options.length > 0) {
                    desc = select.options[select.selectedIndex].getAttribute('data-desc') || '';
                }
                // If you have a brand-desc span, update it here
            };
            select.onchange();
        });
        fetch('/api/categories').then(r=>r.json()).then(categories => {
            const select = document.querySelector('#productModal [name="category_id"]');
            select.innerHTML = categories.map(c => `<option value="${c.category_id}" data-name="${c.category_name}">${c.category_name}</option>`).join('');
            select.onchange = function() {
                let name = '';
                if (select && select.options && select.selectedIndex >= 0 && select.options.length > 0) {
                    name = select.options[select.selectedIndex].getAttribute('data-name') || '';
                }
                // If you have a category-name span, update it here
            };
            select.onchange();
        });
    });

    // --- 3. PRODUCT FORM SUBMIT ---
    document.getElementById('modal-product-form').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('/admin/add_product', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#productModal').modal('hide');
                this.reset();
                fetchAndRenderProducts();
                alert('Product added!');
            } else {
                alert('Failed to add product: ' + (data.error || 'Unknown error'));
            }
        }).catch(err => alert('Error adding product: ' + err));
    };

    // --- 4. PRODUCT IMAGE FORM SUBMIT ---
    document.getElementById('modal-product-image-form').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('/admin/add_product_image', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#productImageModal').modal('hide');
                this.reset();
                fetchAndRenderProductImages();
                alert('Product image added!');
            } else {
                alert('Failed to add product image: ' + (data.error || 'Unknown error'));
            }
        }).catch(err => alert('Error adding product image: ' + err));
    };

    // --- 5. PRODUCT SPEC FORM SUBMIT ---
    document.getElementById('modal-product-spec-form').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        // Validate required fields
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

    // --- 7. BRAND FORM SUBMIT ---
    document.getElementById('modal-brand-form').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('/admin/add_brand', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                $('#brandModal').modal('hide');
                this.reset();
                if (typeof fetchAndRenderBrands === 'function') fetchAndRenderBrands();
                alert('Brand added!');
            } else {
                alert('Failed to add brand: ' + (data.error || 'Unknown error'));
            }
        }).catch(err => alert('Error adding brand: ' + err));
    };

    // --- BRAND TABLE RENDERING ---
    function fetchAndRenderBrands() {
        fetch('/admin/brand_list')
            .then(res => res.json())
            .then(brands => renderBrandTable(brands))
            .catch(err => {
                console.error('Failed to fetch brands:', err);
                const tbody = document.querySelector('.brand-table tbody');
                if (tbody) tbody.innerHTML = '<tr><td colspan="4">Failed to load brands.</td></tr>';
            });
    }
    function renderBrandTable(brands) {
        const tbody = document.querySelector('.brand-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!Array.isArray(brands) || brands.length === 0 || brands.error) {
            tbody.innerHTML = '<tr><td colspan="4">No brands found.</td></tr>';
            return;
        }
        brands.forEach(brand => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${brand.brand_id || ''}</td>
                <td>${brand.brand_name || ''}</td>
                <td>${brand.description || ''}</td>
                <td><!-- Actions (edit/delete) can go here --></td>
            `;
            tbody.appendChild(tr);
        });
    }

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
});



// ================= CUSTOMER ORDER MANAGEMENT =================
function fetchAndRenderCustomerOrders() {}

// Ensure customer orders are fetched and rendered on page load
// if the table is present

document.addEventListener('DOMContentLoaded', function() {
    // If the customer orders table is present, fetch and render on load
    if (document.getElementById('customer-orders-table')) {
        fetchAndRenderCustomerOrders();
    }
});



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
        tbody.innerHTML = '<tr><td colspan="16">No orders found.</td></tr>';
        return;
    }
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.items.map(i => i.product_id).join(', ')}</td>
            <td>${order.user_id}</td>
            <td>${order.total_amount}</td>
            <td>${order.status || 'N/A'}</td>
            <td>${order.payment_method || 'N/A'}</td>
            <td>${order.payment_status || 'N/A'}</td>
            <td>${order.shipping_address || 'N/A'}</td>
            <td>${order.order_status || 'N/A'}</td>
            <td>${order.order_date || 'N/A'}</td>
            <td>${order.customer_issue || 'N/A'}</td>
            <td>${order.message || 'N/A'}</td>
            <td>${order.feedback || 'N/A'}</td>
            <td>${order.rate || 'N/A'}</td>
            <td>${order.cancellation_reason || 'N/A'}</td>
        `;
        tbody.appendChild(tr);
    });
}