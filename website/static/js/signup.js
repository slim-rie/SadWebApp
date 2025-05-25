document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    // Add Google sign-up button handler
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            window.location.href = url;
        });
    }
    
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
    
    function openModal(modal) {
        modal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; 
    }
    
    function closeModal(modal) {
        modal.classList.remove('show-modal');
        document.body.style.overflow = ''; 
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const signInLink = document.getElementById('signInLink');
    const loginModal = document.getElementById('loginModal');
    const closeModalButton = document.querySelector('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    if (loginBtn) loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(loginModal);
    });
    
    if (signInLink) signInLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(loginModal);
    });
    
    if (closeModalButton) closeModalButton.addEventListener('click', function() {
        closeModal(loginModal);
    });
    
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const parentModal = this.parentElement;
            closeModal(parentModal);
        });
    });
    
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordMatchMessage = document.getElementById('password-match-message');
    const lengthReq = document.getElementById('length');
    const lowercaseReq = document.getElementById('lowercase');
    const uppercaseReq = document.getElementById('uppercase');
    const numberReq = document.getElementById('number');
    const specialReq = document.getElementById('special');
    
    passwordMatchMessage.style.display = 'none';
    
    function validatePassword() {
        const password = passwordInput.value;
        
        const hasLength = password.length >= 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[$%/()[\]{}=?!.,\-_*|+~#]/.test(password);
        
        updateRequirement(lengthReq, hasLength);
        updateRequirement(lowercaseReq, hasLowercase);
        updateRequirement(uppercaseReq, hasUppercase);
        updateRequirement(numberReq, hasNumber);
        updateRequirement(specialReq, hasSpecial);
        
        return hasLength && hasLowercase && hasUppercase && hasNumber && hasSpecial;
    }
    
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }
    
    function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword) {
            passwordMatchMessage.style.display = 'block';
            if (password === confirmPassword) {
                passwordMatchMessage.textContent = 'Passwords match';
                passwordMatchMessage.classList.add('valid');
                passwordMatchMessage.classList.remove('invalid');
                return true;
            } else {
                passwordMatchMessage.textContent = 'Passwords do not match';
                passwordMatchMessage.classList.add('invalid');
                passwordMatchMessage.classList.remove('valid');
                return false;
            }
        } else {
            passwordMatchMessage.style.display = 'none';
            return false;
        }
    }
    
    passwordInput.addEventListener('input', function() {
        validatePassword();
        if (confirmPasswordInput.value) {
            checkPasswordsMatch();
        }
    });
    
    confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
    
    const successModal = document.getElementById('successModal');
    const successLoginBtn = document.getElementById('successLoginBtn');
    const signupForm = document.getElementById('signupForm');
    const loginForm = loginModal.querySelector('.login-form');
    const loginError = document.getElementById('loginError');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            email: document.getElementById('email').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            password: document.getElementById('new-password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        // Validate form data
        if (!validateForm(formData)) {
            return;
        }

        // Store form data for later use
        signupData = formData;

        // Show loading state
        const submitButton = document.getElementById('createAccountBtn');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Send verification email
        fetch('/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(async response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server error: ${response.status} ${errorText}`);
            }
            
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Response data:', data);
                if (data.success) {
                    showVerificationModal();
                } else {
                    showMessage(data.message || 'Error sending verification code', 'error');
                }
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned non-JSON response');
            }
        })
        .catch(error => {
            console.error('Signup error:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                showMessage('Network error: Please check your internet connection and try again.', 'error');
            } else {
                showMessage(`Error: ${error.message}`, 'error');
            }
        })
        .finally(() => {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    });
    
    successLoginBtn.addEventListener('click', function() {
        closeModal(successModal);
        
        openModal(loginModal);
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        })
        .then(async response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (data.success) {
                    window.location.href = data.redirect || '/';
                } else {
                    loginError.textContent = data.message || 'Invalid username or password';
                }
            } else {
                const text = await response.text();
                loginError.textContent = 'Login failed: ' + text;
            }
        })
        .catch(error => {
            loginError.textContent = 'Login failed: ' + error;
        });
    });
    
    // Restrict phone number input to only numbers
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            this.value = this.value.replace(/\D/g, '');
            // Limit to 11 digits
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
    }

    const verificationModal = document.getElementById('verificationModal');
    const closeVerification = document.querySelector('.close-verification');
    const codeInputs = document.querySelectorAll('.code-input');
    const verifyBtn = document.getElementById('verifyCodeBtn');
    const modalTimer = document.getElementById('modalTimer');
    const modalResendBtn = document.getElementById('modalResendCode');
    let timerInterval;
    let signupData = null;

    // Handle code input
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });

    // Start timer
    function startTimer() {
        let timeLeft = 120; // 2 minutes
        modalTimer.textContent = '2:00';
        modalResendBtn.disabled = true;

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            modalTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                modalResendBtn.disabled = false;
            }
        }, 1000);
    }

    // Show verification modal
    function showVerificationModal() {
        verificationModal.classList.add('active');
        startTimer();
    }

    // Close verification modal
    closeVerification.addEventListener('click', () => {
        verificationModal.classList.remove('active');
        clearInterval(timerInterval);
    });

    // Handle resend code
    modalResendBtn.addEventListener('click', () => {
        fetch('/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: signupData.email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Verification code resent successfully', 'success');
                startTimer();
            } else {
                showMessage(data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('Error resending verification code', 'error');
        });
    });

    // Handle verification
    verifyBtn.addEventListener('click', () => {
        const code = Array.from(codeInputs).map(input => input.value).join('');
        
        fetch('/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: signupData.email,
                code: code,
                firstname: signupData.firstname,
                lastname: signupData.lastname,
                password: signupData.password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                verificationModal.classList.remove('active');
                showSuccessModal();
            } else {
                showMessage(data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('Error verifying code', 'error');
        });
    });

    // Form validation
    function validateForm(data) {
        if (!data.email || !data.firstname || !data.lastname || !data.password || !data.confirmPassword) {
            showMessage('All fields are required', 'error');
            return false;
        }

        if (data.password !== data.confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return false;
        }

        if (data.password.length < 7) {
            showMessage('Password must be at least 7 characters', 'error');
            return false;
        }

        return true;
    }

    // Show message
    function showMessage(message, type) {
        const messageElement = document.getElementById('verificationError');
        messageElement.textContent = message;
        messageElement.className = `error-message ${type}`;
    }

    // Show success modal
    function showSuccessModal() {
        const successModal = document.getElementById('successModal');
        successModal.classList.add('active');
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
});