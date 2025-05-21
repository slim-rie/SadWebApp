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
    
    // Get QR code URLs from data attributes
    const bankQr = bankOption.getAttribute('data-qr');
    const gcashQr = gcashOption.getAttribute('data-qr');
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
            account_name: 'JBR Tanching C.O',
            phone_number: '092• ••••459'
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
        // Hide QR code for bank, show for gcash
        if (method === 'bank') {
            qrCodeImage.style.display = 'none';
        } else {
            qrCodeImage.style.display = '';
            qrCodeImage.src = details.qr_url || defaultQr;
        }
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
        if (selectedOption.id === 'bankOption' || selectedOption.id === 'gcashOption') {
            // Show modal and update details
            qrModal.classList.add('show');
            if (selectedOption.id === 'bankOption') updatePaymentDetails('bank');
            if (selectedOption.id === 'gcashOption') updatePaymentDetails('gcash');
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
        const modalTransactionFile = document.getElementById('modalTransactionFile');
        const selectedOption = document.querySelector('.payment-option.selected');
        
        if (!referenceInput.value) {
            alert('Please enter your reference number');
            return;
        }

        if (!modalTransactionFile.files[0]) {
            alert('Please upload proof of payment');
            return;
        }

        // First create the order
        let payment_method = selectedOption.id === 'bankOption' ? 'Bank' : 'GCash';
        
        fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_method })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Then submit payment details
                const formData = new FormData();
                formData.append('order_id', data.order_id);
                formData.append('user_id', data.user_id);
                formData.append('payment_method_id', payment_method);
                formData.append('reference_number', referenceInput.value);
                formData.append('proof_of_payment', modalTransactionFile.files[0]);

                return fetch('/api/payments', {
                    method: 'POST',
                    body: formData
                });
            } else {
                throw new Error(data.message || 'Failed to create order');
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/orders';
            } else {
                throw new Error(data.message || 'Failed to submit payment');
            }
        })
        .catch(error => {
            alert(error.message || 'An error occurred');
        });
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

    if (modalFileInput) {
        modalFileInput.addEventListener('change', function() {
            modalFilePreview.innerHTML = '';
            const file = modalFileInput.files[0];
            if (file) {
                qrModalContent.classList.add('has-file');
                // Only show image if it's an image, no file name or caption, centered
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.style.maxWidth = '120px';
                    img.style.maxHeight = '120px';
                    img.style.display = 'block';
                    img.style.margin = '12px auto 0 auto';
                    img.src = URL.createObjectURL(file);
                    modalFilePreview.appendChild(img);
                    // OCR: Use Tesseract to extract reference number
                    Tesseract.recognize(
                        file,
                        'eng',
                        { logger: m => console.log(m) }
                    ).then(({ data: { text } }) => {
                        // Try to find a reference number (sequence of 8+ digits)
                        const match = text.match(/\b\d{8,}\b/);
                        if (match) {
                            referenceInput.value = match[0];
                            referenceInput.dataset.ocr = match[0]; // Store OCR result in data attribute
                        } else {
                            referenceInput.dataset.ocr = '';
                        }
                        referenceSection.style.display = '';
                        checkProceed();
                    }).catch(() => {
                        referenceInput.dataset.ocr = '';
                        referenceSection.style.display = '';
                        checkProceed();
                    });
                } else {
                    // For non-image files, show nothing
                    // Optionally, you could show an icon or leave blank
                    referenceSection.style.display = '';
                    checkProceed();
                }
            } else {
                referenceSection.style.display = 'none';
                proceedBtn.disabled = true;
            }
        });
    }
});