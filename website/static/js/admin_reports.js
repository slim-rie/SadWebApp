// admin_reports.js

function showPersonnelListReportModal() {
    // Inject custom CSS for modal and table if not already present
    if (!document.getElementById('personnel-list-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'personnel-list-report-modal-style';
        style.innerHTML = `
        #personnel-list-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #personnel-list-report-modal .modal-content {
            max-width: 1400px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-width: 1000px;
            width: 95vw;
            position: relative;
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .modal-content h2 i {
            margin-right: 10px;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.personnel-list-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.personnel-list-report-table th, table.personnel-list-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.personnel-list-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.personnel-list-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    // Modal HTML
    let modal = document.getElementById('personnel-list-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'personnel-list-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closePersonnelListReportModal">&times;</span>
            <h2><i class="fa fa-users"></i> Personnel List</h2>
            <div id="personnel-list-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closePersonnelListReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderPersonnelListReport();
}

function fetchAndRenderPersonnelListReport() {
    const container = document.getElementById('personnel-list-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading personnel...</div>';
    }
    fetch('/admin/personnel_list')
        .then(response => response.json())
        .then(data => {
            // Map data to rows for rendering
            const personnel = data.map(u => [
                u.user_id,
                u.username,
                u.email,
                u.role,
                u.first_name,
                u.last_name,
                u.phone_number,
                u.gender,
                u.date_of_birth || '',
                u.is_active ? 'Active' : 'Inactive',
                u.created_at ? formatDate(u.created_at) : '',
                u.last_login ? formatDate(u.last_login) : ''
            ]);
            renderPersonnelListReportTable(personnel);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load personnel.</div>';
            }
        });
}

function renderPersonnelListReportTable(personnel, headers) {
    const container = document.getElementById('personnel-list-report-table-container');
    if (!container) return;
    // If no headers found, use fallback headers
    if (!headers || headers.length === 0) {
        headers = [
            'User ID',
            'Username',
            'Email',
            'Role',
            'First Name',
            'Last Name',
            'Phone Number',
            'Gender',
            'Date of Birth',
            'Status',
            'Created At',
            'Last Login'
        ];
    }
    let html = '<table class="personnel-list-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (personnel.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No personnel found.</td></tr>`;
    } else {
        personnel.forEach(u => {
            html += '<tr>' + u.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}


function showInventoryListReportModal() {
    // Inject custom CSS for modal and table if not already present
    if (!document.getElementById('inventory-list-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'inventory-list-report-modal-style';
        style.innerHTML = `
        #inventory-list-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #inventory-list-report-modal .modal-content {
            max-width: 1400px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-width: 1000px;
            width: 95vw;
            position: relative;
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .modal-content h2 i {
            margin-right: 10px;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.inventory-list-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.inventory-list-report-table th, table.inventory-list-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.inventory-list-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.inventory-list-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    // Modal HTML
    let modal = document.getElementById('inventory-list-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'inventory-list-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeInventoryListReportModal">&times;</span>
            <h2><i class="fa fa-list"></i> Inventory List</h2>
            <div id="inventory-list-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeInventoryListReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderInventoryListReport();
}

function fetchAndRenderInventoryListReport() {
    const container = document.getElementById('inventory-list-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading inventory...</div>';
    }
    fetch('/admin/inventory_list')
        .then(response => response.json())
        .then(data => {
            // Map data to rows for rendering
            const inventories = data.map(inv => [
                inv.id,
                inv.product_name,
                inv.product_code,
                inv.category_name,
                inv.selling_price !== undefined ? `₱${parseFloat(inv.selling_price).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : '',
                inv.min_stock,
                inv.max_stock,
                inv.available_stock,
                inv.stock_status,
                inv.product_status,
                inv.supplier_name,
                inv.supplier_price !== undefined ? `₱${parseFloat(inv.supplier_price).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : '',
                inv.memo || '',
                inv.last_updated ? formatDate(inv.last_updated) : ''
            ]);
            renderInventoryListReportTable(inventories);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load inventory.</div>';
            }
        });
}

function renderInventoryListReportTable(inventories, headers) {
    const container = document.getElementById('inventory-list-report-table-container');
    if (!container) return;
    // If no headers found, use fallback headers
    if (!headers || headers.length === 0) {
        headers = [
            'ID',
            'Product Name',
            'Product Code',
            'Category',
            'Selling Price',
            'Min Stock',
            'Max Stock',
            'Available Stock',
            'Stock Status',
            'Product Status',
            'Supplier Name',
            'Supplier Price',
            'Memo',
            'Last Updated'
        ];
    }
    let html = '<table class="inventory-list-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (inventories.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No inventory found.</td></tr>`;
    } else {
        inventories.forEach(inv => {
            html += '<tr>' + inv.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Fetch and render refunded orders
function fetchAndRenderRefundedOrders() {
    fetch('/admin/refunds_list')
        .then(res => res.json())
        .then(refunds => renderRefundedOrdersTable(refunds))
        .catch(err => {
            const tbody = document.querySelector('#refunded-order-items-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="8">Failed to load refunds.</td></tr>';
        });
}

function renderRefundedOrdersTable(refunds) {
    const tbody = document.querySelector('#refunded-order-items-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(refunds) || refunds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No refunded orders found.</td></tr>';
        return;
    }
    refunds.forEach(refund => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${refund.refund_id || ''}</td>
            <td>${refund.refund_reason || ''}</td>
            <td>${refund.refund_status || ''}</td>
            <td>${refund.proof_of_refund || ''}</td>
            <td>${refund.order_id || ''}</td>
            <td>${refund.return_id || ''}</td>
            <td>${refund.created_at || ''}</td>
            <td>${refund.updated_at || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Show all products in a modal table when the report icon is clicked

document.addEventListener('DOMContentLoaded', function() {
    // Load refunded orders on page load
    fetchAndRenderRefundedOrders();
    document.querySelectorAll('.report-icon-block[data-report="stock"]').forEach(reportBlock => {
        const label = reportBlock.querySelector('div');
        if (label && label.textContent.trim() === "Personnel List") {
            reportBlock.addEventListener('click', showPersonnelListReportModal);
        }
        if (label && label.textContent.trim() === "Product List") {
            reportBlock.addEventListener('click', showProductReportModal);
        }
        if (label && label.textContent.trim() === "Customer Order Report") {
            reportBlock.addEventListener('click', showCustomerOrderReportModal);
        }
        if (label && label.textContent.trim() === "Customer List") {
            reportBlock.addEventListener('click', showOrderOnlyReportModal);
        }
        if (label && label.textContent.trim() === "Supplier List") {
            reportBlock.addEventListener('click', showSupplierListReportModal);
        }
        if (label && label.textContent.trim() === "Inventory List") {
            reportBlock.addEventListener('click', showInventoryListReportModal);
        }
    });
    // Stock In Report (delivery) - show INVENTORY list
    document.querySelectorAll('.report-icon-block[data-report="delivery"]').forEach(reportBlock => {
        const label = reportBlock.querySelector('div');
        if (label && label.textContent.trim() === "Stock In Report") {
            reportBlock.addEventListener('click', showInventoryListReportModal);
        }
    });
    // Stock Out List (fulfillment) - show INVENTORY list
    document.querySelectorAll('.report-icon-block[data-report="fulfillment"]').forEach(reportBlock => {
        const label = reportBlock.querySelector('div');
        if (label && label.textContent.trim() === "Stock Out List") {
            reportBlock.addEventListener('click', showInventoryListReportModal);
        }
    });
});

function showSupplierListReportModal() {
    // Inject custom CSS for modal and table if not already present
    if (!document.getElementById('supplier-list-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'supplier-list-report-modal-style';
        style.innerHTML = `
        #supplier-list-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #supplier-list-report-modal .modal-content {
            max-width: 1200px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-width: 1000px;
            width: 95vw;
            position: relative;
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .modal-content h2 i {
            margin-right: 10px;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.supplier-list-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.supplier-list-report-table th, table.supplier-list-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.supplier-list-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.supplier-list-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    // Modal HTML
    let modal = document.getElementById('supplier-list-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'supplier-list-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeSupplierListReportModal">&times;</span>
            <h2><i class="fa fa-list"></i> Supplier List</h2>
            <div id="supplier-list-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeSupplierListReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderSupplierListReport();
}

function fetchAndRenderSupplierListReport() {
    const container = document.getElementById('supplier-list-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading suppliers...</div>';
    }
    fetch('/admin/supplier_list')
        .then(response => response.json())
        .then(data => {
            // Map data to rows for rendering
            const suppliers = data.map(s => [
                s.id,
                s.product_category,
                s.product_name,
                s.supplier_name,
                s.contact_person,
                s.phone_number,
                s.address,
                s.status,
                s.registration_date
            ]);
            renderSupplierListReportTable(suppliers);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load suppliers.</div>';
            }
        });
}

function renderSupplierListReportTable(suppliers, headers) {
    const container = document.getElementById('supplier-list-report-table-container');
    if (!container) return;
    // If no headers found, use fallback headers
    if (!headers || headers.length === 0) {
        headers = [
            'Supplier ID',
            'Product Category',
            'Product Name',
            'Supplier Name',
            'Contact Person',
            'Phone Number',
            'Address',
            'Status',
            'Registration Date'
        ];
    }
    let html = '<table class="supplier-list-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (suppliers.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No suppliers found.</td></tr>`;
    } else {
        suppliers.forEach(supplier => {
            html += '<tr>' + supplier.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showOrderOnlyReportModal() {
    // Inject custom CSS for modal and table if not already present
    if (!document.getElementById('order-only-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'order-only-report-modal-style';
        style.innerHTML = `
        #order-only-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #order-only-report-modal .modal-content {
            max-width: 1400px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-width: 1000px;
            width: 95vw;
            position: relative;
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .modal-content h2 i {
            margin-right: 10px;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.order-only-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.order-only-report-table th, table.order-only-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.order-only-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.order-only-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    // Modal HTML
    let modal = document.getElementById('order-only-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'order-only-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeOrderOnlyReportModal">&times;</span>
            <h2><i class="fa fa-list"></i> Customer List</h2>
            <div id="order-only-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeOrderOnlyReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderOrderOnlyReport();
}

function fetchAndRenderOrderOnlyReport() {
    // Fetch order data from a global JS variable, API, or table on the page
    // For demo, try to find a table with id 'customer-orders-table' and use its rows
    const ordersTable = document.getElementById('customer-orders-table');
    let orders = [];
    if (ordersTable) {
        const rows = ordersTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                let order = [];
                cells.forEach(cell => order.push(cell.textContent));
                orders.push(order);
            }
        });
    }
    renderOrderOnlyReportTable(orders);
}

function renderOrderOnlyReportTable(orders) {
    const container = document.getElementById('order-only-report-table-container');
    if (!container) return;
    // Table headers (match admin's order table)
    const headers = [
        'Order ID', 'Product ID(s)', 'User ID', 'Total Amount', 'Status', 'Payment Method', 'Payment Status', 'Shipping Address', 'Order Status', 'Order Date', 'Customer Issue', 'Feedback', 'Rate', 'Cancellation Reason', 'Actions'
    ];
    let html = '<table class="order-only-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (orders.length === 0) {
        html += '<tr><td colspan="15" style="text-align:center;color:#888;">No orders found.</td></tr>';
    } else {
        orders.forEach(order => {
            html += '<tr>' + order.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}


function showCustomerOrderReportModal() {
    // Inject custom CSS for modal and table if not already present
    if (!document.getElementById('customer-order-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'customer-order-report-modal-style';
        style.innerHTML = `
        #customer-order-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #customer-order-report-modal .modal-content {
            max-width: 1400px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-width: 1000px;
            width: 95vw;
            position: relative;
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .modal-content h2 i {
            margin-right: 10px;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
            color: #555;
        }
        #customer-order-report-table-container {
            overflow-x: auto;
            margin-top: 20px;
        }
        #customer-order-report-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #f9fafb;
        }
        #customer-order-report-table th,
        #customer-order-report-table td {
            padding: 12px 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        #customer-order-report-table th {
            background-color: #2563eb;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 13px;
        }
        #customer-order-report-table tr:nth-child(even) {
            background-color: #edf2fa;
        }
        #customer-order-report-table tr:hover {
            background-color: #dbeafe;
        }
        @media (max-width: 768px) {
            .modal-content {
                padding: 16px;
            }
            #customer-order-report-table th,
            #customer-order-report-table td {
                padding: 8px;
                font-size: 12px;
            }
        }
        `;
        document.head.appendChild(style);
    }
    // Create modal if not exists
    let modal = document.getElementById('customer-order-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'customer-order-report-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" id="close-customer-order-report-modal">&times;</span>
                <h2><i class="fa fa-file-alt" style="margin-right:10px;color:#2563eb;"></i> Customer Order Report</h2>
                <div id="customer-order-report-table-container">
                    <table id="customer-order-report-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
<th>Product ID(s)</th>
<th>User ID</th>
<th>Total Amount</th>
<th>Status</th>
<th>Payment Method</th>
<th>Payment Status</th>
<th>Shipping Address</th>
<th>Order Status</th>
<th>Order Date</th>
<th>Customer Issue</th>
<th>Message</th>
<th>Feedback</th>
<th>Rate</th>
<th>Cancellation Reason</th>
<th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-customer-order-report-modal').onclick = () => { modal.style.display = 'none'; };
        modal.onclick = function(event) { if (event.target === modal) modal.style.display = 'none'; };
    }
    modal.style.display = 'flex';
    fetchAndRenderCustomerOrderReport();
}

function fetchAndRenderCustomerOrderReport() {
    fetch('/admin/orders_list')
        .then(res => res.json())
        .then(orders => renderCustomerOrderReportTable(orders))
        .catch(err => {
            const tbody = document.querySelector('#customer-order-report-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="7">Failed to load orders.</td></tr>';
        });
}

function renderCustomerOrderReportTable(orders) {
    const tbody = document.querySelector('#customer-order-report-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(orders) || orders.length === 0 || orders.error) {
        tbody.innerHTML = '<tr><td colspan="16">No orders found.</td></tr>';
        return;
    }
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.order_id || ''}</td>
            <td>${order.product_ids || ''}</td>
            <td>${order.user_id || ''}</td>
            <td>${order.total_amount !== undefined ? `₱${parseFloat(order.total_amount).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : ''}</td>
            <td>${order.status || ''}</td>
            <td>${order.payment_method || ''}</td>
            <td>${order.payment_status || ''}</td>
            <td>${order.shipping_address || ''}</td>
            <td>${order.order_status || ''}</td>
            <td>${formatDate(order.order_date || order.created_at)}</td>
            <td>${order.customer_issue || ''}</td>
            <td>${order.message || ''}</td>
            <td>${order.feedback || ''}</td>
            <td>${order.rate || ''}</td>
            <td>${order.cancellation_reason || ''}</td>
            <td><button class="btn btn-sm btn-info" onclick="alert('Order Details for ID: ${order.order_id}')">View</button></td>
        `;
        tbody.appendChild(tr);
    });
}


function showProductReportModal() {
    // Inject custom CSS for modal and table if not already present
    if (!document.getElementById('product-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'product-report-modal-style';
        style.innerHTML = `
        #product-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7); /* dark overlay */
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #product-report-modal .modal-content {
            max-width: 1400px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-width: 1000px;
            width: 95vw;
            position: relative;
            font-family: 'Segoe UI', sans-serif;
        }

        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }

        .modal-content h2 i {
            margin-right: 10px;
        }

        .close {
            position: absolute;
            top: 16px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
            color: #555;
        }

        #product-report-table-container {
            overflow-x: auto;
            margin-top: 20px;
        }

        #product-report-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #f9fafb;
        }

        #product-report-table th,
        #product-report-table td {
            padding: 12px 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        #product-report-table th {
            background-color: #2563eb;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 13px;
        }

        #product-report-table tr:nth-child(even) {
            background-color: #edf2fa;
        }

        #product-report-table tr:hover {
            background-color: #dbeafe;
        }

        #product-report-table img {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
            .modal-content {
                padding: 16px;
            }

            #product-report-table th,
            #product-report-table td {
                padding: 8px;
                font-size: 12px;
            }

            #product-report-table img {
                width: 36px;
                height: 36px;
            }
        }
        `;

        document.head.appendChild(style);
    }
    // Create modal if not exists
    let modal = document.getElementById('product-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-report-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" id="close-product-report-modal">&times;</span>
                <h2><i class="fa fa-boxes" style="margin-right:10px;color:#2563eb;"></i> Product List Report</h2>
                <div id="product-report-table-container">
                    <table id="product-report-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Model</th>
                                <th>Category</th>
                                <th>Price (₱)</th>
                                <th>Discount (%)</th>
                                <th>Stock</th>
                                <th>Brand</th>
                                <th>Created</th>
                                <th>Updated</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('close-product-report-modal').onclick = () => { modal.style.display = 'none'; };
        modal.onclick = function(event) { if (event.target === modal) modal.style.display = 'none'; };
    }
    modal.style.display = 'flex';
    fetchAndRenderProductReport();
}

// Helper to prettify date
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}


function fetchAndRenderProductReport() {
    fetch('/admin/product_list')
        .then(res => res.json())
        .then(products => renderProductReportTable(products))
        .catch(err => {
            const tbody = document.querySelector('#product-report-table tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="11">Failed to load products.</td></tr>';
        });
}

function renderProductReportTable(products) {
    const tbody = document.querySelector('#product-report-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!Array.isArray(products) || products.length === 0 || products.error) {
        tbody.innerHTML = '<tr><td colspan="11">No products found.</td></tr>';
        return;
    }
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.image ? `<img src='${product.image}' alt='Product Image'>` : '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.product_id || '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.name || '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.model_number || '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.category_id || '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.price !== undefined ? `₱${parseFloat(product.price).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.discount !== undefined && product.discount !== null ? product.discount : '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.stock_quantity !== undefined ? product.stock_quantity : '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${product.brand_id || '<span style="color:#cbd5e1;">N/A</span>'}</td>
            <td>${formatDate(product.created_at)}</td>
            <td>${formatDate(product.updated_at)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function showActivityReportModal() {
    // Inject style only once
    if (!document.getElementById('activity-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'activity-report-modal-style';
        style.innerHTML = `
        #activity-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        #activity-report-modal .modal-content {
            max-width: 1000px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .modal-content h2 i {
            margin-right: 10px;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.activity-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.activity-report-table th, table.activity-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.activity-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.activity-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    // Modal HTML
    let modal = document.getElementById('activity-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'activity-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeActivityReportModal">&times;</span>
            <h2><i class="fa fa-user"></i> Activity Report</h2>
            <div id="activity-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeActivityReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderActivityReport();
}

function fetchAndRenderActivityReport() {
    const container = document.getElementById('activity-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading users...</div>';
    }
    fetch('/admin/activity_report')
        .then(response => response.json())
        .then(data => {
            const users = data.map(u => [
                u.user_id,
                u.username,
                u.first_name,
                u.last_name,
                u.role,
                u.last_login
            ]);
            renderActivityReportTable(users);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load activity report.</div>';
            }
        });
}

function renderActivityReportTable(users) {
    const container = document.getElementById('activity-report-table-container');
    if (!container) return;
    const headers = [
        'User ID',
        'Username',
        'First Name',
        'Last Name',
        'Role',
        
        'Last Login'
    ];
    let html = '<table class="activity-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (users.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No users found.</td></tr>`;
    } else {
        users.forEach(u => {
            html += '<tr>' + u.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

document.querySelectorAll('.report-icon-block[data-report="stock"]').forEach(reportBlock => {
    const label = reportBlock.querySelector('div');
    if (label && label.textContent.trim() === "Sales Order Report") {
        reportBlock.addEventListener('click', showSalesReportModal);
    }
});

function showSalesReportModal() {
    if (!document.getElementById('sales-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'sales-report-modal-style';
        style.innerHTML = `
        #sales-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #sales-report-modal .modal-content {
            max-width: 1000px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.sales-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.sales-report-table th, table.sales-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.sales-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.sales-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    let modal = document.getElementById('sales-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sales-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeSalesReportModal">&times;</span>
            <h2><i class="fa fa-file-alt"></i> Sales Order Report</h2>
            <div id="sales-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeSalesReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderSalesReport();
}

function fetchAndRenderSalesReport() {
    const container = document.getElementById('sales-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading sales...</div>';
    }
    fetch('/admin/sales_report')
        .then(response => response.json())
        .then(data => {
            const sales = data.map(s => [
                s.sales_id,
                s.order_id,
                s.product_id,
                s.user,
                s.sale_date,
                s.total_amount,
                s.payment_id
            ]);
            renderSalesReportTable(sales);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load sales report.</div>';
            }
        });
}

function renderSalesReportTable(sales) {
    const container = document.getElementById('sales-report-table-container');
    if (!container) return;
    const headers = [
        'Sale ID',
        'Order ID',
        'Product ID',
        'User',
        'Sale Date',
        'Total Amount',
        'Payment ID'
    ];
    let html = '<table class="sales-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (sales.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No sales found.</td></tr>`;
    } else {
        sales.forEach(row => {
            html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}


// Personnel List modal trigger
    document.querySelectorAll('.report-icon-block[data-report="personnel"]').forEach(reportBlock => {
        const label = reportBlock.querySelector('div');
        if (label && label.textContent.trim() === "Personnel List") {
            reportBlock.addEventListener('click', showPersonnelListReportModal);
        }
    });
    // Activity Report modal trigger
    document.querySelectorAll('.report-icon-block[data-report="activity"]').forEach(reportBlock => {
        reportBlock.addEventListener('click', showActivityReportModal);
    });

// Attach event for Stock In Report icon
document.querySelectorAll('.report-icon-block[data-report="stockin"]').forEach(reportBlock => {
    const label = reportBlock.querySelector('div');
    if (label && label.textContent.trim() === "Stock In Report") {
        reportBlock.addEventListener('click', showStockInReportModal);
    }
});

function showStockInReportModal() {
    if (!document.getElementById('stock-in-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'stock-in-report-modal-style';
        style.innerHTML = `
        #stock-in-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #stock-in-report-modal .modal-content {
            max-width: 1200px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.stock-in-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.stock-in-report-table th, table.stock-in-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.stock-in-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.stock-in-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    let modal = document.getElementById('stock-in-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'stock-in-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeStockInReportModal">&times;</span>
            <h2><i class="fa fa-file-alt"></i> Stock In Report</h2>
            <div id="stock-in-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeStockInReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderStockInReport();
}

function fetchAndRenderStockInReport() {
    const container = document.getElementById('stock-in-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading stock-in records...</div>';
    }
    fetch('/admin/stock_in_report')
        .then(response => response.json())
        .then(data => {
            const records = data.map(s => [
                s.inventory_id,
                s.product_id,
                s.product_name,
                s.supplier_name,
                s.supplier_price !== undefined ? `₱${parseFloat(s.supplier_price).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : '',
                s.stock_quantity,
                s.stock_in,
                s.available_stock,
                s.stock_status,
                s.created_at,
                s.updated_at
            ]);
            renderStockInReportTable(records);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load stock-in report.</div>';
            }
        });
}

function renderStockInReportTable(records) {
    const container = document.getElementById('stock-in-report-table-container');
    if (!container) return;
    const headers = [
        'Inventory ID',
        'Product ID',
        'Product Name',
        'Supplier Name',
        'Supplier Price',
        'Stock Quantity',
        'Stock In',
        'Available Stock',
        'Stock Status',
        'Created At',
        'Last Updated'
    ];
    let html = '<table class="stock-in-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (records.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No stock-in records found.</td></tr>`;
    } else {
        records.forEach(row => {
            html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}
// Attach event for Stock Out List icon

document.querySelectorAll('.report-icon-block[data-report="stockout"]').forEach(reportBlock => {
    const label = reportBlock.querySelector('div');
    if (label && label.textContent.trim() === "Stock Out List") {
        reportBlock.addEventListener('click', showStockOutReportModal);
    }
});

function showStockOutReportModal() {
    if (!document.getElementById('stock-out-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'stock-out-report-modal-style';
        style.innerHTML = `
        #stock-out-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #stock-out-report-modal .modal-content {
            max-width: 1200px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.stock-out-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.stock-out-report-table th, table.stock-out-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.stock-out-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.stock-out-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    let modal = document.getElementById('stock-out-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'stock-out-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeStockOutReportModal">&times;</span>
            <h2><i class="fa fa-file-alt"></i> Stock Out List</h2>
            <div id="stock-out-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeStockOutReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderStockOutReport();
}

function fetchAndRenderStockOutReport() {
    const container = document.getElementById('stock-out-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading stock-out records...</div>';
    }
    fetch('/admin/stock_out_report')
        .then(response => response.json())
        .then(data => {
            const records = data.map(s => [
                s.inventory_id,
                s.product_id,
                s.product_name,
                s.supplier_name,
                s.supplier_price !== undefined ? `₱${parseFloat(s.supplier_price).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : '',
                s.stock_quantity,
                s.stock_out,
                s.available_stock,
                s.stock_status,
                s.created_at,
                s.updated_at
            ]);
            renderStockOutReportTable(records);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load stock-out report.</div>';
            }
        });
}

function renderStockOutReportTable(records) {
    const container = document.getElementById('stock-out-report-table-container');
    if (!container) return;
    const headers = [
        'Inventory ID',
        'Product ID',
        'Product Name',
        'Supplier Name',
        'Supplier Price',
        'Stock Quantity',
        'Stock Out',
        'Available Stock',
        'Stock Status',
        'Created At',
        'Last Updated'
    ];
    let html = '<table class="stock-out-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (records.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No stock-out records found.</td></tr>`;
    } else {
        records.forEach(row => {
            html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}


// Attach event for Refunded Items Report icon

document.querySelectorAll('.report-icon-block[data-report="refunded"]').forEach(reportBlock => {
    const label = reportBlock.querySelector('div');
    if (label && label.textContent.trim() === "Refunded Items Report") {
        reportBlock.addEventListener('click', showRefundsReportModal);
    }
});

function showRefundsReportModal() {
    if (!document.getElementById('refunds-report-modal-style')) {
        const style = document.createElement('style');
        style.id = 'refunds-report-modal-style';
        style.innerHTML = `
        #refunds-report-modal {
            position: fixed;
            z-index: 9999;
            left: 0; top: 0;
            width: 100vw; height: 100vh;
            background: rgba(34, 41, 47, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #refunds-report-modal .modal-content {
            max-width: 1000px;
            width: 98vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-family: 'Segoe UI', sans-serif;
        }
        .modal-content h2 {
            margin-top: 0;
            font-size: 24px;
            color: #2563eb;
            display: flex;
            align-items: center;
        }
        .close {
            position: absolute;
            top: 16px;
            right: 24px;
            font-size: 28px;
            color: #888;
            cursor: pointer;
        }
        table.refunds-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }
        table.refunds-report-table th, table.refunds-report-table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
            font-size: 16px;
        }
        table.refunds-report-table th {
            background: #f4f6fb;
            color: #2563eb;
        }
        table.refunds-report-table tbody tr:nth-child(even) {
            background: #f9f9f9;
        }
        `;
        document.head.appendChild(style);
    }
    let modal = document.getElementById('refunds-report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'refunds-report-modal';
        modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeRefundsReportModal">&times;</span>
            <h2><i class="fa fa-file-alt"></i> Refunded Items Report</h2>
            <div id="refunds-report-table-container"></div>
        </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('closeRefundsReportModal').onclick = function() {
        modal.style.display = 'none';
    };
    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
    fetchAndRenderRefundsReport();
}

function fetchAndRenderRefundsReport() {
    const container = document.getElementById('refunds-report-table-container');
    if (container) {
        container.innerHTML = '<div style="text-align:center; color:#2563eb; padding:20px;">Loading refund records...</div>';
    }
    fetch('/admin/refunds_report')
        .then(response => response.json())
        .then(data => {
            const records = data.map(r => [
                r.refund_id,
                r.order_id,
                r.product_id,
                r.user_id,
                r.refund_amount !== undefined ? `₱${parseFloat(r.refund_amount).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2})}` : '',
                r.refund_reason,
                r.refund_status,
                r.created_at,
                r.updated_at
            ]);
            renderRefundsReportTable(records);
        })
        .catch(error => {
            if (container) {
                container.innerHTML = '<div style="color:red; text-align:center;">Failed to load refunds report.</div>';
            }
        });
}

function renderRefundsReportTable(records) {
    const container = document.getElementById('refunds-report-table-container');
    if (!container) return;
    const headers = [
        'Refund ID',
        'Order ID',
        'Product ID',
        'User ID',
        'Refund Amount',
        'Refund Reason',
        'Refund Status',
        'Created At',
        'Updated At'
    ];
    let html = '<table class="refunds-report-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    if (records.length === 0) {
        html += `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;">No refund records found.</td></tr>`;
    } else {
        records.forEach(row => {
            html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}



