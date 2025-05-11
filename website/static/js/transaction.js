document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    const paymentOptions = document.querySelectorAll('.payment-option');
    const qrModal = document.getElementById('qrModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const proceedBtn = document.getElementById('proceedBtn');
    const continueBtn = document.getElementById('continueBtn');
    const bankOption = document.getElementById('bankOption');
    const gcashOption = document.getElementById('gcashOption');
    const codOption = document.getElementById('codOption');
    const qrCodeImage = document.getElementById('qrCodeImage');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    bankOption.addEventListener('click', function() {
        qrCodeImage.src = "images/bank_qr_code.jpg"; 
    });
    
    gcashOption.addEventListener('click', function() {
        qrCodeImage.src = "images/gcash_qr_code.jpg"; 
    });
    
    continueBtn.addEventListener('click', function() {
        const selectedOption = document.querySelector('.payment-option.selected');
        
        if (!selectedOption) {
            alert('Please select a payment method');
            return;
        }
        
        if (selectedOption.id === 'bankOption' || selectedOption.id === 'gcashOption') {
            qrModal.classList.add('show');
        } else if (selectedOption.id === 'codOption') {
            window.location.href = '/confirmation';
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        qrModal.classList.remove('show');
    });
    
    proceedBtn.addEventListener('click', function() {
        const referenceInput = document.getElementById('referenceInput');
        if (!referenceInput.value) {
            alert('Please enter your reference number');
            return;
        }
        window.location.href = '/confirmation';
    });
    
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    userIcon.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    window.addEventListener('click', function(event) {
        if (!event.target.matches('#user-icon')) {
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            }
        }
    });
    
    function updateUIForLoginStatus(isLoggedIn, username) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const usernameDisplay = document.getElementById('usernameDisplay');
        const footerShopLink = document.getElementById('footerShopLink');
        
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
            
            footerShopLink.onclick = function(e) {
                e.preventDefault();
                window.location.href = '/sewingmachines';
            };
            
        } else {
            usernameDisplay.textContent = '';
            usernameDisplay.style.display = 'none';
            
            dropdownMenu.innerHTML = `
                <button class="login-btn" id="loginBtn">LOGIN</button>
                <a href="${SIGNUP_URL}" class="signup-btn">SIGN UP</a>
            `;
            
            document.getElementById('loginBtn').addEventListener('click', function() {
                window.location.href = '/sign-up';
            });
            
            footerShopLink.onclick = function(e) {
                e.preventDefault();
                window.location.href = 'index.html';
            };
        }
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        updateUIForLoginStatus(false, null);
    }
});