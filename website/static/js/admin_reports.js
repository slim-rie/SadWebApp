// admin_reports.js
// Show all products in a modal table when the report icon is clicked

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.report-icon-block[data-report="stock"]').forEach(reportBlock => {
        const label = reportBlock.querySelector('div');
        if (label && label.textContent.trim() === "Product List") {
            reportBlock.addEventListener('click', showProductReportModal);
        }
        if (label && label.textContent.trim() === "Customer Order Report") {
            reportBlock.addEventListener('click', showCustomerOrderReportModal);
        }
    });
});

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

