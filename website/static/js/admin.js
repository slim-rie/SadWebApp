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
    // Section-specific logic
    if (sectionName === 'supplier') fetchAndRenderSuppliers();
    if (sectionName === 'inventory') fetchAndRenderInventory();
}
// Attach click handlers to nav items
window.addEventListener('DOMContentLoaded', function() {
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
    // Add Personnel button event
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
document.addEventListener('DOMContentLoaded', loadPersonnelTable);

// Show personnel modal
if (addPersonnelBtn) {
        addPersonnelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPersonnelModal();
        });
    }

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
            // Remove password if blank
            if (!formData.password) delete formData.password;
            const res = await fetch(`/admin/update_personnel/${user.user_id}`, {
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

   