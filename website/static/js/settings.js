// All code is now wrapped to ensure DOM is loaded

document.addEventListener('DOMContentLoaded', function() {
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

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            window.location.href = 'index.html';
        };
    }

    // Profile picture preview
    const profilePic = document.getElementById('profilePic');
    if (profilePic) {
        profilePic.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profilePicPreview').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.onsubmit = function(e) {
            e.preventDefault();
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        };
    }

    // Chat modal logic
    const openChatModal = document.getElementById('openChatModal');
    const closeChatModal = document.getElementById('closeChatModal');
    const chatHeaderBar = document.getElementById('chatHeaderBar');
    const openConversation = document.getElementById('openConversation');
    const backToList = document.getElementById('backToList');
    const chatList = document.getElementById('chatList');
    const chatConversation = document.getElementById('chatConversation');
    const chatModal = document.getElementById('chatModal');

    if (openChatModal) {
        openChatModal.onclick = function() {
            chatModal.classList.add('show');
            closeChatModal.style.display = 'block';
            chatHeaderBar.style.display = 'flex';
        };
    }
    if (closeChatModal) {
        closeChatModal.onclick = function() {
            chatModal.classList.remove('show');
        };
    }
    if (openConversation) {
        openConversation.onclick = function() {
            chatList.style.display = 'none';
            chatConversation.style.display = 'flex';
            closeChatModal.style.display = 'none';
            chatHeaderBar.style.display = 'none';
            setTimeout(scrollChatToBottom, 0);
        };
    }
    if (backToList) {
        backToList.onclick = function() {
            chatConversation.style.display = 'none';
            chatList.style.display = 'block';
            closeChatModal.style.display = 'block';
            chatHeaderBar.style.display = 'flex';
        };
    }

    // Chat logic
    const chatAttachBtn = document.getElementById('chatAttachBtn');
    const chatFileInput = document.getElementById('chatFileInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.querySelector('.chat-conv-messages');
    const chatInput = document.getElementById('chatInput');

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
    function scrollChatToBottom() {
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatAttachBtn && chatFileInput) {
        chatAttachBtn.onclick = function() {
            chatFileInput.click();
        };
    }

    if (chatFileInput && chatMessages) {
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

    if (chatSendBtn && chatInput) {
        chatSendBtn.onclick = function() {
            sendMessage();
        };
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
});