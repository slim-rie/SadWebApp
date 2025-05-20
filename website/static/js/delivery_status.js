document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('requestModal');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Handle status select changes
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const row = this.closest('tr');
            const requestId = row.querySelector('td:first-child').textContent;
            const newStatus = this.value;
            if (newStatus === 'complete') {
                // Replace select with badge
                const statusCell = this.parentElement;
                statusCell.innerHTML = '<span class="status-badge status-complete">Complete</span>';
            } else {
                // Update select class for color
                this.className = 'status-select status-' + newStatus;
            }
            alert(`Status updated for request ${requestId} to ${newStatus}`);
        });
    });
    
    // Handle view button clicks
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const requestId = row.querySelector('td:first-child').textContent;
            const requestDate = row.querySelector('td:nth-child(3)').textContent;
            const deliveryDate = row.querySelector('td:nth-child(4)').textContent;
            const status = row.querySelector('td:nth-child(5)').textContent.trim();
            const paymentMethod = row.querySelector('td:nth-child(6)').textContent;
            const totalAmount = row.querySelector('td:nth-child(7)').textContent;
            
            // Get products list
            const productsList = row.querySelector('td:nth-child(2) ul').innerHTML;
            
            // Update modal content
            document.getElementById('modalRequestId').textContent = requestId;
            document.getElementById('modalRequestDate').textContent = requestDate;
            document.getElementById('modalDeliveryDate').textContent = deliveryDate;
            document.getElementById('modalStatus').innerHTML = status;
            document.getElementById('modalPaymentMethod').textContent = paymentMethod;
            document.getElementById('modalTotalAmount').textContent = totalAmount;
            document.getElementById('modalProducts').innerHTML = productsList;
            
            // Show modal
            modal.style.display = 'block';
        });
    });
    
    // Close modal functions
    function closeModalFunc() {
        modal.style.display = 'none';
    }
    
    closeModal.addEventListener('click', closeModalFunc);
    closeModalBtn.addEventListener('click', closeModalFunc);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // Profile dropdown
    const profileDropdownToggle = document.getElementById('profileDropdownToggle');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    profileDropdownToggle.onclick = function(e) {
        e.stopPropagation();
        profileDropdownMenu.classList.toggle('show');
    };
    document.addEventListener('click', function(e) {
        if (!profileDropdownMenu.contains(e.target) && e.target !== profileDropdownToggle) {
            profileDropdownMenu.classList.remove('show');
        }
    });
    document.getElementById('logoutBtn').onclick = function() {
        window.location.href = 'index.html';
    };

    // Chat modal logic
    document.getElementById('openChatModal').onclick = function() {
        document.getElementById('chatModal').classList.add('show');
        document.getElementById('closeChatModal').style.display = 'block';
        document.getElementById('chatHeaderBar').style.display = 'flex';
    };
    document.getElementById('closeChatModal').onclick = function() {
        document.getElementById('chatModal').classList.remove('show');
    };
    document.getElementById('openConversation').onclick = function() {
        document.getElementById('chatList').style.display = 'none';
        document.getElementById('chatConversation').style.display = 'flex';
        document.getElementById('closeChatModal').style.display = 'none';
        document.getElementById('chatHeaderBar').style.display = 'none';
        setTimeout(scrollChatToBottom, 0);
    };
    document.getElementById('backToList').onclick = function() {
        document.getElementById('chatConversation').style.display = 'none';
        document.getElementById('chatList').style.display = 'block';
        document.getElementById('closeChatModal').style.display = 'block';
        document.getElementById('chatHeaderBar').style.display = 'flex';
    };

    // Chat attach and send logic
    const chatAttachBtn = document.getElementById('chatAttachBtn');
    const chatFileInput = document.getElementById('chatFileInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.querySelector('.chat-conv-messages');

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

    chatAttachBtn.onclick = function() {
        chatFileInput.click();
    };

    function scrollChatToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

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

    chatSendBtn.onclick = function() {
        sendMessage();
    };

    // Add enter key support
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

    // Filter function
    document.querySelector('.btn.btn-primary').addEventListener('click', function() {
        const statusFilter = document.getElementById('status').value.toLowerCase();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        document.querySelectorAll('.data-table tbody tr').forEach(row => {
            let show = true;
            // Status filter
            if (statusFilter !== 'all status') {
                let cell = row.querySelector('td:nth-child(5)');
                let cellText = cell.textContent.trim().toLowerCase();
                if (!cellText.includes(statusFilter)) show = false;
            }
            // Date filter
            if (startDate) {
                let date = row.querySelector('td:nth-child(4)').textContent.trim();
                if (date < startDate) show = false;
            }
            if (endDate) {
                let date = row.querySelector('td:nth-child(4)').textContent.trim();
                if (date > endDate) show = false;
            }
            row.style.display = show ? '' : 'none';
        });
    });

    // Status select color logic
    function updateStatusSelectColor(select) {
        select.classList.remove('intransit', 'delivered', 'pending', 'cancelled');
        select.classList.add(select.value);
    }
    document.querySelectorAll('.custom-status-select').forEach(function(select) {
        updateStatusSelectColor(select);
        select.addEventListener('change', function() {
            updateStatusSelectColor(this);
        });
    });
}); 