document.addEventListener('DOMContentLoaded', function () {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userIcon = document.getElementById('user-icon');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');

    if (isLoggedIn && username) {
        usernameDisplay.textContent = current_user.username;
        usernameDisplay.style.display = 'inline-block';

        sidebarUsername.textContent = current_user.username;

        dropdownMenu.innerHTML = `
            <a href="/my-account" class="dropdown-item">My Account</a>
            <a href="/orders" class="dropdown-item">Orders</a>
            <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
        `;

        document.getElementById('logoutBtn').addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            alert('Logged out successfully!');
            window.location.href = 'index.html'; 
        });
    } else {
        window.location.href = 'login.html';
    }

    userIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove('active');
        }
    });

    const chatLink = document.getElementById('chatLink');
    const chatModal = document.getElementById('chatModal');
    const closeChat = document.getElementById('closeChat');

    chatLink.addEventListener('click', function (e) {
        e.preventDefault();
        chatModal.style.display = 'block';
    });

    closeChat.addEventListener('click', function () {
        chatModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === chatModal) {
            chatModal.style.display = 'none';
        }
    });

    console.log('[privacysettings.js] Script loaded');

    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (!deleteAccountBtn) {
        console.error('[privacysettings.js] deleteAccountBtn not found');
    } else {
        console.log('[privacysettings.js] deleteAccountBtn found');
        deleteAccountBtn.addEventListener('click', function() {
            console.log('[privacysettings.js] Delete Account button clicked');
            const modal = document.getElementById('deleteAccountModal');
            if (!modal) {
                console.error('[privacysettings.js] deleteAccountModal not found');
            } else {
                modal.style.display = 'block';
                console.log('[privacysettings.js] Modal should now be visible');
            }
        });
    }

    document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
        const modal = document.getElementById('deleteAccountModal');
        modal.style.display = 'none';
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        fetch('/api/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                alert('Account deleted successfully.');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Failed to delete account.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error);
        });
    });
});