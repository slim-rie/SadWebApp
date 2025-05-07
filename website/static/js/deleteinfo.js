document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (isLoggedIn && !localStorage.getItem('password')) {
        localStorage.setItem('password', 'password123');
    }
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    document.getElementById('sidebarUsername').textContent = username || '';
    
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
        document.getElementById('profileImage').src = savedProfileImage;
    }
    
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        window.location.href = '/my-account';
    });
    
    const cancelBtn = document.getElementById('cancelBtn');
    const proceedBtn = document.getElementById('proceedBtn');
    
    const passwordModal = document.getElementById('passwordModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    const sadMessageModal = document.getElementById('sadMessageModal');
    const sadCancelBtn = document.getElementById('sadCancelBtn');
    const sadContinueBtn = document.getElementById('sadContinueBtn');
    
    const step1Container = document.querySelector('.deletion-info-container');
    
    cancelBtn.addEventListener('click', function() {
        window.location.href = 'privacysettings.html';
    });
    
    proceedBtn.addEventListener('click', function() {
        sadMessageModal.style.display = 'block';
    });
    
    sadCancelBtn.addEventListener('click', function() {
        sadMessageModal.style.display = 'none';
    });
    
    sadContinueBtn.addEventListener('click', function() {
        sadMessageModal.style.display = 'none';
        passwordModal.style.display = 'block';
    });
    
    cancelDeleteBtn.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });
    
    confirmDeleteBtn.addEventListener('click', function() {
        const password = document.getElementById('confirmPassword').value;
        
        if (!password) {
            alert('Please enter your password to confirm deletion');
            return;
        }
        
       
        if (password === storedPassword) {
            
            localStorage.clear();
            
            alert('Account deleted successfully. You will be redirected to the homepage.');
            
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            alert('Incorrect password. Please try again.');
        }
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
        if (event.target === sadMessageModal) {
            sadMessageModal.style.display = 'none';
        }
    });
    
    function updateUIForLoginStatus(isLoggedIn, username) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const usernameDisplay = document.getElementById('usernameDisplay');
        
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';
            
            dropdownMenu.innerHTML = `
                <a href="/my-account" class="dropdown-item">My Account</a>
                <a href="/orders" class="dropdown-item">Orders</a>
                <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    }
});