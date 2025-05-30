document.addEventListener('DOMContentLoaded', function() {
    // --- Render Recent Requests Table ---
    fetch('/supplier/recent_requests')
        .then(res => res.json())
        .then(requests => {
            // Update summary cards dynamically by status
            // Make status counting case-insensitive and ignore extra spaces
            const statusKeys = [
                'pending',
                'approved',
                'rejected',
                'in progress',
                'to ship',
                'to deliver',
                'cancelled',
                'completed'
            ];
            const statusCounts = Object.fromEntries(statusKeys.map(k => [k, 0]));
            requests.forEach(req => {
                if (req.status) {
                    const normalized = req.status.trim().toLowerCase();
                    if (statusCounts.hasOwnProperty(normalized)) {
                        statusCounts[normalized]++;
                    }
                }
            });
            // Find all summary cards and update their values (case-insensitive match)
            const summaryCards = document.querySelectorAll('.summary-card');
            summaryCards.forEach(card => {
                const title = card.querySelector('.summary-title');
                const value = card.querySelector('.summary-value');
                if (!title || !value) return;
                const normalizedTitle = title.textContent.trim().toLowerCase();
                if (normalizedTitle === 'total requests') {
                    value.textContent = Array.isArray(requests) ? requests.length : 0;
                } else if (statusCounts.hasOwnProperty(normalizedTitle)) {
                    value.textContent = statusCounts[normalizedTitle];
                }
            });
            const table = document.querySelector('table');
            const tbody = table ? table.querySelector('tbody') : null;
            if (!tbody) return;
            tbody.innerHTML = '';
            if (!Array.isArray(requests) || requests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;">No recent requests found.</td></tr>';
                return;
            }
            requests.forEach(req => {
                // Assign a CSS class based on status
                let statusClass = '';
                switch ((req.status || '').toLowerCase()) {
                    case 'pending': statusClass = 'status-pending'; break;
                    case 'approved': statusClass = 'status-approved'; break;
                    case 'rejected': statusClass = 'status-rejected'; break;
                    case 'in progress': statusClass = 'status-inprogress'; break;
                    case 'to ship': statusClass = 'status-toship'; break;
                    case 'to deliver': statusClass = 'status-todeliver'; break;
                    case 'cancelled': statusClass = 'status-cancelled'; break;
                    case 'completed': statusClass = 'status-completed'; break;
                    default: statusClass = 'status-other'; break;
                }
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${req.request_id}</td>
                    <td>${req.date}</td>
                    <td>${req.products}</td>
                    <td>${req.quantity}</td>
                    <td>${req.total_amount}</td>
                    <td>${req.requested_by}</td>
                    <td><span class="status-badge ${statusClass}">${req.status}</span></td>
                `;
                tbody.appendChild(row);
            });
        });
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
    const openChatModal = document.getElementById('openChatModal');
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

    // Chat attach and send logic
    const chatAttachBtn = document.getElementById('chatAttachBtn');
    const chatFileInput = document.getElementById('chatFileInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.querySelector('.chat-conv-messages');

    // Safe attach button logic
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

    // Send button click
    if (chatSendBtn) {
        chatSendBtn.onclick = function() {
            sendMessage();
        };
    }

    // Enter key support
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // File input change
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

    // Helper functions
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

function isImage(file) {
    return file.type.startsWith('image/');
}
function isVideo(file) {
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
