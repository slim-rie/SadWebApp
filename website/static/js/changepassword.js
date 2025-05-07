document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
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
    
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const cancelBtn = document.getElementById('cancelBtn');
    const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');
    const successMessage = document.getElementById('successMessage');
    
    const lowercaseRequirement = document.getElementById('lowercase');
    const uppercaseRequirement = document.getElementById('uppercase');
    const lengthRequirement = document.getElementById('length');
    const allowedRequirement = document.getElementById('allowed');
    
    toggleNewPasswordBtn.addEventListener('click', function() {
        const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        newPasswordInput.setAttribute('type', type);
        
        const icon = toggleNewPasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
    
    newPasswordInput.addEventListener('input', validatePassword);
    
    function validatePassword() {
        const password = newPasswordInput.value;
        
        const hasLowercase = /[a-z]/.test(password);
        lowercaseRequirement.classList.toggle('valid', hasLowercase);
        
        const hasUppercase = /[A-Z]/.test(password);
        uppercaseRequirement.classList.toggle('valid', hasUppercase);
        
        const hasValidLength = password.length >= 8 && password.length <= 16;
        lengthRequirement.classList.toggle('valid', hasValidLength);
        
        const hasValidChars = /^[a-zA-Z0-9\s\.,;:!?@#$%^&*()_+\-=\[\]{}|\\/<>'"`~]*$/.test(password);
        allowedRequirement.classList.toggle('valid', hasValidChars);
        
        return hasLowercase && hasUppercase && hasValidLength && hasValidChars;
    }
    
    passwordChangeForm.addEventListener('submit', function(e) {
        e.preventDefault();
     
        if (!currentPasswordInput.value) {
            alert('Please enter your current password');
            return;
        }
        
        if (!validatePassword()) {
            alert('Please ensure your new password meets all requirements');
            return;
        }
        
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            alert('New password and confirmation password do not match');
            return;
        }

        // AJAX call to backend to change password
        fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                current_password: currentPasswordInput.value,
                new_password: newPasswordInput.value,
                confirm_password: confirmPasswordInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage();
                passwordChangeForm.reset();
                lowercaseRequirement.classList.remove('valid');
                uppercaseRequirement.classList.remove('valid');
                lengthRequirement.classList.remove('valid');
                allowedRequirement.classList.remove('valid');
            } else {
                alert(data.message || 'Failed to change password.');
            }
        })
        .catch(error => {
            alert('Error: ' + error);
        });
    });
    
    cancelBtn.addEventListener('click', function() {
        passwordChangeForm.reset();
        
        lowercaseRequirement.classList.remove('valid');
        uppercaseRequirement.classList.remove('valid');
        lengthRequirement.classList.remove('valid');
        allowedRequirement.classList.remove('valid');
    });
    
    function showSuccessMessage() {
        successMessage.classList.add('show');
        
        setTimeout(function() {
            successMessage.classList.remove('show');
        }, 3000);
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
    
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        window.location.href = '/my-account';
    });
});