document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    updateUIForLoginStatus(isLoggedIn, username);
    
    document.getElementById('sidebarUsername').textContent = username || '';
    document.getElementById('username').value = username || '';
    
    loadUserData();
    
    populateDateDropdowns();
    
    const profileImageInput = document.getElementById('profileImageInput');
    const profilePreview = document.getElementById('profilePreview');
    const profileImage = document.getElementById('profileImage');
    const selectImageBtn = document.getElementById('selectImageBtn');
    
    selectImageBtn.addEventListener('click', function() {
        profileImageInput.click();
    });
    
    profileImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            if (file.size > 1048576) {
                alert('File is too large. Maximum size is 1MB.');
                return;
            }
            
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const extension = file.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(extension)) {
                alert('Invalid file type. Only JPEG and PNG are allowed.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
                profileImage.src = e.target.result;
                localStorage.setItem('profileImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
        profilePreview.src = savedProfileImage;
        profileImage.src = savedProfileImage;
    }
    
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        document.getElementById('fullName').focus();
    });
    
    const emailModal = document.getElementById('emailModal');
    const closeEmailModal = document.getElementById('closeEmailModal');
    const cancelEmailModal = document.getElementById('cancelEmailModal');
    const saveEmailModal = document.getElementById('saveEmailModal');
    const modalEmail = document.getElementById('modalEmail');
    const emailModalTitle = document.getElementById('emailModalTitle');
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === "addEmailBtn") {
            emailModalTitle.textContent = "Add Email Address";
            modalEmail.value = "";
            emailModal.classList.add('active');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === "changeEmailBtn") {
            emailModalTitle.textContent = "Change Email Address";
            const email = localStorage.getItem('email') || "";
            modalEmail.value = email;
            emailModal.classList.add('active');
        }
    });
    
    closeEmailModal.addEventListener('click', function() {
        emailModal.classList.remove('active');
    });
    
    cancelEmailModal.addEventListener('click', function() {
        emailModal.classList.remove('active');
    });
    
    saveEmailModal.addEventListener('click', function() {
        const newEmail = modalEmail.value.trim();
        if (newEmail && validateEmail(newEmail)) {
            localStorage.setItem('email', newEmail);
            updateEmailField();
            emailModal.classList.remove('active');
            showStatusMessage("Email updated successfully!");
        } else {
            alert('Please enter a valid email address');
        }
    });
    
    const phoneModal = document.getElementById('phoneModal');
    const closePhoneModal = document.getElementById('closePhoneModal');
    const cancelPhoneModal = document.getElementById('cancelPhoneModal');
    const savePhoneModal = document.getElementById('savePhoneModal');
    const modalPhone = document.getElementById('modalPhone');
    const phoneModalTitle = document.getElementById('phoneModalTitle');
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === "addPhoneBtn") {
            phoneModalTitle.textContent = "Add Phone Number";
            modalPhone.value = "";
            phoneModal.classList.add('active');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === "changePhoneBtn") {
            phoneModalTitle.textContent = "Change Phone Number";
            const phone = localStorage.getItem('phone') || "";
            modalPhone.value = phone;
            phoneModal.classList.add('active');
        }
    });
    
    closePhoneModal.addEventListener('click', function() {
        phoneModal.classList.remove('active');
    });
    
    cancelPhoneModal.addEventListener('click', function() {
        phoneModal.classList.remove('active');
    });
    
    savePhoneModal.addEventListener('click', function() {
        const newPhone = modalPhone.value.trim();
        if (newPhone && validatePhone(newPhone)) {
            localStorage.setItem('phone', newPhone);
            updatePhoneField();
            phoneModal.classList.remove('active');
            showStatusMessage("Phone number updated successfully!");
        } else {
            alert('Please enter a valid phone number');
        }
    });
    
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (isLoggedIn) {
        dropdownMenu.innerHTML = `
            <a href="/my-account" class="dropdown-item">My Account</a>
            <a href="/orders" class="dropdown-item">Orders</a>
            <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    } else {
        dropdownMenu.innerHTML = `
            <a href="login.html" class="dropdown-item">Login</a>
            <a href="register.html" class="dropdown-item">Register</a>
        `;
    }
    
    userIcon.addEventListener('click', function(e) {
        e.stopPropagation(); 
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        
        if (fullName) {
            localStorage.setItem('fullName', fullName);
            if (gender) localStorage.setItem('gender', gender);
            if (day && month && year) {
                localStorage.setItem('dob', `${day}/${month}/${year}`);
            }
            
            showStatusMessage("Profile updated successfully!");
        } else {
            alert('Please enter your name');
        }
    });
    
    function showStatusMessage(message) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.classList.add('show');
        
        setTimeout(function() {
            statusMessage.classList.remove('show');
        }, 3000);
    }
    
    function loadUserData() {
        const savedName = localStorage.getItem('fullName');
        const savedGender = localStorage.getItem('gender');
        const savedDOB = localStorage.getItem('dob');
        
        if (savedName) document.getElementById('fullName').value = savedName;
        
        if (savedGender) {
            document.querySelector(`input[name="gender"][value="${savedGender}"]`).checked = true;
        }
        
        if (savedDOB) {
            const [day, month, year] = savedDOB.split('/');
            document.getElementById('day').value = day;
            document.getElementById('month').value = month;
            document.getElementById('year').value = year;
        }
        
        updateEmailField();
        updatePhoneField();
    }
 
function updateEmailField() {
const emailField = document.getElementById('emailField');
const savedEmail = localStorage.getItem('email');

if (savedEmail) {
emailField.innerHTML = `
    <input type="email" id="email" value="${protectEmail(savedEmail)}" disabled>
    <a href="#" class="change-link" id="changeEmailBtn">Change</a>
`;
} else {
emailField.innerHTML = `
    <div class="empty-field">
        <div class="empty-field-icon">
            <i class="fas fa-envelope"></i>
        </div>
        <div class="empty-field-content">
            <p class="empty-field-message">No email address added yet</p>
            <a href="#" class="add-link" id="addEmailBtn">
                <i class="fas fa-plus-circle"></i> Add Email Address
            </a>
        </div>
    </div>
`;
}
}

function updatePhoneField() {
const phoneField = document.getElementById('phoneField');
const savedPhone = localStorage.getItem('phone');

if (savedPhone) {
phoneField.innerHTML = `
    <input type="tel" id="phone" value="${protectPhone(savedPhone)}" disabled>
    <a href="#" class="change-link" id="changePhoneBtn">Change</a>
`;
} else {
phoneField.innerHTML = `
    <div class="empty-field">
        <div class="empty-field-icon">
            <i class="fas fa-phone-alt"></i>
        </div>
        <div class="empty-field-content">
            <p class="empty-field-message">No phone number added yet</p>
            <a href="#" class="add-link" id="addPhoneBtn">
                <i class="fas fa-plus-circle"></i> Add Phone Number
            </a>
        </div>
    </div>
`;
}
}
    
    function protectEmail(email) {
        if (!email) return '';
        const [username, domain] = email.split('@');
        if (username.length <= 2) return email;
        return username.substring(0, 2) + '*'.repeat(username.length - 2) + '@' + domain;
    }
    
    function protectPhone(phone) {
        if (!phone) return '';
        return '*'.repeat(phone.length - 2) + phone.slice(-2);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        return phone.length >= 6;
    }
    
const chatLink = document.getElementById('chatLink');
const chatModal = document.getElementById('chatModal');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const quickQuestions = document.querySelectorAll('.quick-question-btn');

function addMessage(text, className) {
const messageElement = document.createElement('div');
messageElement.classList.add('message', className);
messageElement.textContent = text;
chatMessages.appendChild(messageElement);

chatMessages.scrollTop = chatMessages.scrollHeight;
}

quickQuestions.forEach(button => {
button.addEventListener('click', function () {
    const question = this.getAttribute('data-question');
    addMessage(question, 'user-message'); 
    setTimeout(() => {
        let response = '';
        switch (question.toLowerCase()) {
            case 'shipping policy':
                response = 'Our shipping policy ensures delivery within 3-5 business days.';
                break;
            case 'return policy':
                response = 'You can return items within 30 days of purchase.';
                break;
            case 'product inquiry':
                response = 'Please provide the product name for more details.';
                break;
            case 'payment methods':
                response = 'We accept GCash, bank transfers, and cash on delivery.';
                break;
            case 'order tracking':
                response = 'You can track your order using the tracking ID sent to your email.';
                break;
            default:
                response = 'Thank you for your message! Our team will get back to you shortly.';
                break;
        }
        addMessage(response, 'bot-message'); 
    }, 1000);
});
});

function openChatModal() {
chatModal.classList.add('show-modal');
document.body.style.overflow = 'hidden';
}

function closeChatModal() {
chatModal.classList.remove('show-modal');
document.body.style.overflow = '';
}

if (chatLink) {
chatLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (isLoggedIn) {
        openChatModal();
    } else {
        openLoginModal();
    }
});
}

if (chatForm) {
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        
        chatInput.value = '';
        
        setTimeout(() => {
            addMessage('Thank you for your message! Our team will get back to you shortly.', 'system-message');
        }, 1000);
    }
});
}

if (chatModal) {
const closeChatBtn = chatModal.querySelector('.close-chat');

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', closeChatModal);
}
}

    function updateUIForLoginStatus(isLoggedIn, username) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';
        }
    }
    
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        console.log('Email and phone data have been cleared.');
        window.location.href = 'index.html';
    }
    
    function populateDateDropdowns() {
        const daySelect = document.getElementById('day');
        const monthSelect = document.getElementById('month');
        const yearSelect = document.getElementById('year');
        
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = String(i).padStart(2, '0');
            option.textContent = i;
            daySelect.appendChild(option);
        }
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = String(index + 1).padStart(2, '0');
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 100; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
    }

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
});