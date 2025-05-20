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
    const mayaOption = document.getElementById('mayaOption');
    const qrCodeImage = document.getElementById('qrCodeImage');
    
    // Get QR code URLs from data attributes
    const bankQr = bankOption.getAttribute('data-qr');
    const gcashQr = gcashOption.getAttribute('data-qr');
    const mayaQr = mayaOption ? mayaOption.getAttribute('data-qr') : null;
    const defaultQr = qrCodeImage.getAttribute('src');
    
    // Payment details from backend (injected as a JS object)
    const qrCodes = {
        bank: {
            name: 'Bank Account',
            qr_url: bankQr,
            account_name: 'JBR Tanching C.O',
            account_number: '1234-5678-9012',
            bank_name: 'BDO'
        },
        gcash: {
            name: 'GCash',
            qr_url: gcashQr,
            account_name: 'JBR Tanching',
            phone_number: '0912-345-6789'
        },
        maya: {
            name: 'Maya',
            qr_url: mayaQr,
            account_name: 'JBR Tanching',
            phone_number: '0912-345-6789'
        }
    };

    function updatePaymentDetails(method) {
        const details = qrCodes[method];
        document.getElementById('accountName').textContent = details.account_name || '';
        document.getElementById('accountNumberRow').style.display = details.account_number ? '' : 'none';
        document.getElementById('accountNumber').textContent = details.account_number || '';
        document.getElementById('bankNameRow').style.display = details.bank_name ? '' : 'none';
        document.getElementById('bankName').textContent = details.bank_name || '';
        document.getElementById('phoneNumberRow').style.display = details.phone_number ? '' : 'none';
        document.getElementById('phoneNumber').textContent = details.phone_number || '';
        qrCodeImage.src = details.qr_url || defaultQr;
    }

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    bankOption.addEventListener('click', function() {
        updatePaymentDetails('bank');
    });
    
    gcashOption.addEventListener('click', function() {
        updatePaymentDetails('gcash');
    });
    
    if (mayaOption) {
        mayaOption.addEventListener('click', function() {
            updatePaymentDetails('maya');
        });
    }
    
    codOption.addEventListener('click', function() {
        // Hide all payment details for COD
        document.getElementById('accountName').textContent = '';
        document.getElementById('accountNumberRow').style.display = 'none';
        document.getElementById('bankNameRow').style.display = 'none';
        document.getElementById('phoneNumberRow').style.display = 'none';
        qrCodeImage.src = defaultQr;
    });
    
    continueBtn.addEventListener('click', function() {
        const selectedOption = document.querySelector('.payment-option.selected');
        if (!selectedOption) {
            alert('Please select a payment method');
            return;
        }
        if (selectedOption.id === 'bankOption' || selectedOption.id === 'gcashOption' || selectedOption.id === 'mayaOption') {
            // Show modal and update details
            qrModal.classList.add('show');
            if (selectedOption.id === 'bankOption') updatePaymentDetails('bank');
            if (selectedOption.id === 'gcashOption') updatePaymentDetails('gcash');
            if (selectedOption.id === 'mayaOption') updatePaymentDetails('maya');
        } else if (selectedOption.id === 'codOption') {
            // Create order for COD
            fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_method: 'Cash on Delivery' })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/orders';
                } else {
                    alert(data.message || 'Failed to create order.');
                }
            })
            .catch(() => alert('Failed to create order.'));
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        qrModal.classList.remove('show');
    });
    
    proceedBtn.addEventListener('click', function() {
        const referenceInput = document.getElementById('referenceInput');
        const selectedOption = document.querySelector('.payment-option.selected');
        if (!referenceInput.value) {
            alert('Please enter your reference number');
            return;
        }
        // Create order for bank/gcash
        let payment_method = selectedOption.id === 'bankOption' ? 'Bank' : 'GCash';
        fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_method, reference_number: referenceInput.value })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/orders';
            } else {
                alert(data.message || 'Failed to create order.');
            }
        })
        .catch(() => alert('Failed to create order.'));
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