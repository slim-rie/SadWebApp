// Demo data for each report
const stockRows = `<table style="margin-top:16px;width:100%;"><thead><tr><th>Request ID</th><th>Product</th><th>Quantity</th><th>Status</th><th>Request Date</th><th>Expected Delivery Date</th></tr></thead><tbody><tr><td>REQ-001</td><td>Cotton Fabric</td><td>50m</td><td><span class='status-badge status-pending'>Pending</span></td><td>2025-04-10</td><td>2025-04-20</td></tr><tr><td>REQ-002</td><td>Sewing Needles</td><td>100 pcs</td><td><span class='status-badge status-accepted'>Accepted</span></td><td>2025-04-12</td><td>2025-04-22</td></tr><tr><td>REQ-003</td><td>Polyester Thread</td><td>200 spools</td><td><span class='status-badge status-rejected'>Rejected</span></td><td>2025-04-13</td><td>2025-04-23</td></tr><tr><td>REQ-004</td><td>Silk Fabric</td><td>20m</td><td><span class='status-badge status-delivered'>Delivered</span></td><td>2025-04-14</td><td>2025-04-24</td></tr></tbody></table>`;
const deliveryRows = `<div style='display:flex;gap:32px;align-items:flex-end;'><div><div>On-time Deliveries: <b>3</b></div><div>Late Deliveries: <b>1</b></div><div>Average Delivery Time: <b>3.2 days</b></div><div>Completion Rate: <b>80%</b></div></div><div><canvas id='deliveryChart' width='220' height='100' style='background:#f8f9fa;border-radius:8px;'></canvas><div style='font-size:0.95rem;color:#888;text-align:center;'>Delivery Trends</div></div></div><table style='margin-top:16px;width:100%;'><thead><tr><th>Delivery ID</th><th>Request ID</th><th>Product</th><th>Delivery Date</th><th>Status</th><th>On-time/Late</th><th>Delivery Time (days)</th></tr></thead><tbody><tr><td>DEL-001</td><td>REQ-001</td><td>Cotton Fabric</td><td>2025-04-20</td><td><span class='status-badge status-delivered'>Delivered</span></td><td>On-time</td><td>3</td></tr><tr><td>DEL-002</td><td>REQ-002</td><td>Sewing Needles</td><td>2025-04-22</td><td><span class='status-badge status-delivered'>Delivered</span></td><td>Late</td><td>5</td></tr><tr><td>DEL-003</td><td>REQ-003</td><td>Polyester Thread</td><td>2025-04-23</td><td><span class='status-badge status-delivered'>Delivered</span></td><td>On-time</td><td>2</td></tr></tbody></table>`;
const fulfillmentRows = `<div style='display:flex;gap:32px;align-items:flex-end;'><div><div>Total Requests: <b>12</b></div><div>Total Quantity Supplied: <b>370</b></div><div>Fulfilled Orders: <b>9</b></div><div>Unfulfilled Orders: <b>3</b></div></div><div><canvas id='fulfillmentChart' width='220' height='100' style='background:#f8f9fa;border-radius:8px;'></canvas><div style='font-size:0.95rem;color:#888;text-align:center;'>Fulfillment by Product</div></div></div><table style='margin-top:16px;width:100%;'><thead><tr><th>Product</th><th>Requests</th><th>Supplied</th><th>Fulfilled</th><th>Unfulfilled</th></tr></thead><tbody><tr><td>Cotton Fabric</td><td>4</td><td>200m</td><td>3</td><td>1</td></tr><tr><td>Sewing Needles</td><td>2</td><td>200 pcs</td><td>2</td><td>0</td></tr><tr><td>Polyester Thread</td><td>3</td><td>600 spools</td><td>2</td><td>1</td></tr></tbody></table>`;
const financialRows = `<table style='margin-top:16px;width:100%;'><thead><tr><th>Request ID</th><th>Product</th><th>Quantity</th><th>Value</th><th>Payment Status</th><th>Invoice No.</th></tr></thead><tbody><tr><td>REQ-001</td><td>Cotton Fabric</td><td>50m</td><td>₱10,000</td><td>Paid</td><td>INV-001</td></tr><tr><td>REQ-002</td><td>Sewing Needles</td><td>100 pcs</td><td>₱2,000</td><td>Pending</td><td>INV-002</td></tr><tr><td>REQ-003</td><td>Polyester Thread</td><td>200 spools</td><td>₱5,000</td><td>Paid</td><td>INV-003</td></tr></tbody></table>`;
const productRows = `<table style='margin-top:16px;width:100%;'><thead><tr><th>Product</th><th>Times Requested</th><th>Accepted</th><th>Rejected</th><th>Trend</th></tr></thead><tbody><tr><td>Cotton Fabric</td><td>4</td><td>3</td><td>1</td><td>↑</td></tr><tr><td>Sewing Needles</td><td>2</td><td>2</td><td>0</td><td>→</td></tr><tr><td>Polyester Thread</td><td>3</td><td>2</td><td>1</td><td>↓</td></tr></tbody></table>`;

document.addEventListener('DOMContentLoaded', function() {
    // Chat modal variables (declare once for use everywhere)
    
    // Show modal on icon click
    document.querySelectorAll('.report-icon-block').forEach(block => {
        block.onclick = function() {
            const report = this.dataset.report;
            document.getElementById('filterModal').style.display = 'flex';
            document.getElementById('filterModalTitle').textContent = this.textContent.trim();
            document.getElementById('filterModal').setAttribute('data-report', report);
            // Show/hide status filter for relevant reports
            document.getElementById('modalStatusGroup').style.display = (report === 'stock' || report === 'delivery') ? '' : 'none';
        };
    });
    const closeFilterModalBtn = document.getElementById('closeFilterModal');
    if (closeFilterModalBtn) {
        closeFilterModalBtn.onclick = function() {
            document.getElementById('filterModal').style.display = 'none';
        };
    }
    const applyModalFiltersBtn = document.getElementById('applyModalFilters');
    if (applyModalFiltersBtn) {
        applyModalFiltersBtn.onclick = function() {
            const report = document.getElementById('filterModal').getAttribute('data-report');
            document.querySelectorAll('.report-section').forEach(sec => sec.style.display = 'none');
            if (report === 'stock') document.getElementById('stockReport').innerHTML = stockRows, document.getElementById('stockReport').style.display = '';
            if (report === 'delivery') document.getElementById('deliveryReport').innerHTML = deliveryRows, document.getElementById('deliveryReport').style.display = '';
            if (report === 'fulfillment') document.getElementById('fulfillmentReport').innerHTML = fulfillmentRows, document.getElementById('fulfillmentReport').style.display = '';
            if (report === 'financial') document.getElementById('financialReport').innerHTML = financialRows, document.getElementById('financialReport').style.display = '';
            if (report === 'product') document.getElementById('productReport').innerHTML = productRows, document.getElementById('productReport').style.display = '';
            document.getElementById('filterModal').style.display = 'none';
            // Redraw charts if needed
            setTimeout(function() {
                if (report === 'delivery') drawDemoChart('deliveryChart', [20,40,30,60,50], '#2563eb');
                if (report === 'fulfillment') drawDemoChart('fulfillmentChart', [30,60,40,80,60], '#2e7d32');
            }, 100);
        };
    }
    // Hide modal on outside click
    window.onclick = function(e) {
        const modal = document.getElementById('filterModal');
        if (e.target === modal) modal.style.display = 'none';
    };

    // Profile dropdown
    const profileDropdownToggle = document.getElementById('profileDropdownToggle');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    if (profileDropdownToggle && profileDropdownMenu) {
        profileDropdownToggle.onclick = function(e) {
            e.stopPropagation();
            profileDropdownMenu.classList.toggle('show');
        };
        document.addEventListener('click', function(e) {
            if (!profileDropdownMenu.contains(e.target) && e.target !== profileDropdownToggle) {
                profileDropdownMenu.classList.remove('show');
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            window.location.href = 'index.html';
        };
    }

    // Chat modal logic
    const openChatModalBtn = document.getElementById('openChatModal');
    if (openChatModalBtn) {
        openChatModalBtn.onclick = function() {
            document.getElementById('chatModal').classList.add('show');
            document.getElementById('closeChatModal').style.display = 'block';
            document.getElementById('chatHeaderBar').style.display = 'flex';
        };
    }
    const closeChatModalBtn = document.getElementById('closeChatModal');
    if (closeChatModalBtn) {
        closeChatModalBtn.onclick = function() {
            document.getElementById('chatModal').classList.remove('show');
        };
    }
    const openConversationBtn = document.getElementById('openConversation');
    if (openConversationBtn) {
        openConversationBtn.onclick = function() {
            document.getElementById('chatList').style.display = 'none';
            document.getElementById('chatConversation').style.display = 'flex';
            document.getElementById('closeChatModal').style.display = 'none';
            document.getElementById('chatHeaderBar').style.display = 'none';
            setTimeout(scrollChatToBottom, 0);
        };
    }
    const backToListBtn = document.getElementById('backToList');
    if (backToListBtn) {
        backToListBtn.onclick = function() {
            document.getElementById('chatConversation').style.display = 'none';
            document.getElementById('chatList').style.display = 'block';
            document.getElementById('closeChatModal').style.display = 'block';
            document.getElementById('chatHeaderBar').style.display = 'flex';
        };
    }

    // Chat attach and send logic

    if (chatAttachBtn) {
        chatAttachBtn.onclick = function() {
            chatFileInput.click();
        };
    }
    function scrollChatToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
    if (chatSendBtn) {
        chatSendBtn.onclick = function() {
            sendMessage();
        };
    }
    // Add enter key support
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
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

    function getFileTypeIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        if (["pdf"].includes(ext)) return '<i class="fa-solid fa-file-pdf chat-message-file-icon"></i>';
        if (["doc","docx"].includes(ext)) return '<i class="fa-solid fa-file-word chat-message-file-icon"></i>';
        if (["xls","xlsx"].includes(ext)) return '<i class="fa-solid fa-file-excel chat-message-file-icon"></i>';
        return '<i class="fa-solid fa-file-lines chat-message-file-icon"></i>';
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
});

// Demo chart drawing
function drawDemoChart(canvasId, values, color) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0,0,c.width,c.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 90-values[0]);
    for(let i=1;i<values.length;i++) ctx.lineTo(10+50*i, 90-values[i]);
    ctx.stroke();
}
// Profile dropdown
const profileDropdownToggle = document.getElementById('profileDropdownToggle');
const profileDropdownMenu = document.getElementById('profileDropdownMenu');
if (profileDropdownToggle && profileDropdownMenu) {
    profileDropdownToggle.onclick = function(e) {
        e.stopPropagation();
        profileDropdownMenu.classList.toggle('show');
    };
    document.addEventListener('click', function(e) {
        if (!profileDropdownMenu.contains(e.target) && e.target !== profileDropdownToggle) {
            profileDropdownMenu.classList.remove('show');
        }
    });
}

// Chat modal logic
const openChatModalBtn = document.getElementById('openChatModal');
if (openChatModalBtn) {
    openChatModalBtn.onclick = function() {
        document.getElementById('chatModal').classList.add('show');
        document.getElementById('closeChatModal').style.display = 'block';
        document.getElementById('chatHeaderBar').style.display = 'flex';
    };
}
const closeChatModalBtn = document.getElementById('closeChatModal');
if (closeChatModalBtn) {
    closeChatModalBtn.onclick = function() {
        document.getElementById('chatModal').classList.remove('show');
    };
}
const openConversationBtn = document.getElementById('openConversation');
if (openConversationBtn) {
    openConversationBtn.onclick = function() {
        document.getElementById('chatList').style.display = 'none';
        document.getElementById('chatConversation').style.display = 'flex';
        document.getElementById('closeChatModal').style.display = 'none';
        document.getElementById('chatHeaderBar').style.display = 'none';
        setTimeout(scrollChatToBottom, 0);
    };
}
const backToListBtn = document.getElementById('backToList');
if (backToListBtn) {
    backToListBtn.onclick = function() {
        document.getElementById('chatConversation').style.display = 'none';
        document.getElementById('chatList').style.display = 'block';
        document.getElementById('closeChatModal').style.display = 'block';
        document.getElementById('chatHeaderBar').style.display = 'flex';
    };
}

// Chat attach and send logic

function getFileTypeIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (["pdf"].includes(ext)) return '<i class="fa-solid fa-file-pdf chat-message-file-icon"></i>';
    if (["doc","docx"].includes(ext)) return '<i class="fa-solid fa-file-word chat-message-file-icon"></i>';
    if (["xls","xlsx"].includes(ext)) return '<i class="fa-solid fa-file-excel chat-message-file-icon"></i>';
    return '<i class="fa-solid fa-file-lines chat-message-file-icon"></i>';
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
if (typeof chatInput !== 'undefined' && chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
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
}
 