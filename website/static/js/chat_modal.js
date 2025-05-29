// chat_modal.js - Handles chat modal open/close and basic interaction

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openChatBtn = document.getElementById('chat-modal-btn');
    const chatModal = document.getElementById('chatModal');
    const closeChatBtn = document.getElementById('closeChatModal');
    const chatList = document.getElementById('chatList');
    const chatConversation = document.getElementById('chatConversation');
    const openConversation = document.getElementById('openConversation');
    const backToList = document.getElementById('backToList');

    // Open modal
    if (openChatBtn && chatModal) {
        openChatBtn.addEventListener('click', function() {
            chatModal.style.display = 'block';
            if (chatList) chatList.style.display = 'block';
            if (chatConversation) chatConversation.style.display = 'none';
        });
    }

    // Close modal
    if (closeChatBtn && chatModal) {
        closeChatBtn.addEventListener('click', function() {
            chatModal.style.display = 'none';
        });
    }

    // Open a conversation
    if (openConversation && chatList && chatConversation) {
        openConversation.addEventListener('click', function() {
            chatList.style.display = 'none';
            chatConversation.style.display = 'block';
        });
    }

    // Back to chat list
    if (backToList && chatList && chatConversation) {
        backToList.addEventListener('click', function() {
            chatConversation.style.display = 'none';
            chatList.style.display = 'block';
        });
    }

    // Close modal on outside click
    if (chatModal) {
        chatModal.addEventListener('click', function(event) {
            if (event.target === chatModal) {
                chatModal.style.display = 'none';
            }
        });
    }
});
