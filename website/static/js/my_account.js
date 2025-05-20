document.addEventListener('DOMContentLoaded', function() {
    // Get username from the input field that's populated by the server
    const username = document.getElementById('username').value;
    
    if (!username) {
        window.location.href = '/login';
        return;
    }
    
    updateUIForLoginStatus(true, username);
    
    document.getElementById('sidebarUsername').textContent = username || '';
    
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
            
            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File is too large. Maximum size is 5MB.');
                this.value = ''; // Clear the file input
                return;
            }
            
            // Check file type
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const extension = file.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(extension)) {
                alert('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
                this.value = ''; // Clear the file input
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
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
            const email = document.getElementById('email').value;
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
            // Submit the form with the new email
            const form = document.getElementById('profileForm');
            const emailInput = document.createElement('input');
            emailInput.type = 'hidden';
            emailInput.name = 'email';
            emailInput.value = newEmail;
            form.appendChild(emailInput);
            form.submit();
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
            const phone = document.getElementById('phone').value;
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
            // Submit the form with the new phone number
            const form = document.getElementById('profileForm');
            const phoneInput = document.createElement('input');
            phoneInput.type = 'hidden';
            phoneInput.name = 'phone';
            phoneInput.value = newPhone;
            form.appendChild(phoneInput);
            form.submit();
        } else {
            alert('Please enter a valid phone number');
        }
    });
    
    const userIcon = document.getElementById('user-icon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    dropdownMenu.innerHTML = `
        <a href="/my-account" class="dropdown-item">My Account</a>
        <a href="/orders" class="dropdown-item">Orders</a>
        <a href="/logout" class="dropdown-item">Logout</a>
    `;
    
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
        
        const formData = new FormData(this);
        
        // Add profile image if selected
        if (profileImageInput.files[0]) {
            const file = profileImageInput.files[0];
            console.log('Selected file:', file.name);
            
            // Validate file size
            if (file.size > 5 * 1024 * 1024) {
                document.getElementById('statusMessage').textContent = 'File is too large. Maximum size is 5MB.';
                document.getElementById('statusMessage').className = 'alert alert-danger';
                return;

                
            }
            
            // Validate file type
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const extension = file.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(extension)) {
                document.getElementById('statusMessage').textContent = 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.';
                document.getElementById('statusMessage').className = 'alert alert-danger';
                return;
            }
            
            formData.append('profile_image', file);
        }
        
        // Show loading state
        document.getElementById('statusMessage').textContent = 'Updating profile...';
        document.getElementById('statusMessage').className = 'alert alert-info';
        
        fetch('/my-account', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile update response:', data);
            if (data.error) {
                document.getElementById('statusMessage').textContent = data.error;
                document.getElementById('statusMessage').className = 'alert alert-danger';
            } else {
                // Update form fields with new data
                if (data.user) {
                    if (data.user.profile_image) {
                        console.log('New profile image:', data.user.profile_image);
                        const newImagePath = `/static/profile_images/${data.user.profile_image}`;
                        console.log('New image path:', newImagePath);
                        
                        // Test if the new image exists
                        fetch(newImagePath)
                            .then(response => {
                                if (response.ok) {
                                    console.log('New image exists at path:', newImagePath);
                                    const profileImage = document.getElementById('profileImage');
                                    const profilePreview = document.getElementById('profilePreview');
                                    
                                    if (profileImage) {
                                        profileImage.src = newImagePath;
                                        profileImage.dataset.image = data.user.profile_image;
                                    }
                                    if (profilePreview) {
                                        profilePreview.src = newImagePath;
                                        profilePreview.dataset.image = data.user.profile_image;
                                    }
                                    // Update user icon after profile update
                                    updateUserIcon();
                                } else {
                                    console.error('New image not found at path:', newImagePath);
                                }
                            })
                            .catch(error => {
                                console.error('Error checking new image:', error);
                            });
                    }
                    
                    // Update other fields...
                    if (data.user.first_name) {
                        document.getElementById('fullName').value = data.user.first_name;
                    }
                    if (data.user.email) {
                        document.getElementById('email').value = data.user.email;
                    }
                    if (data.user.phone) {
                        document.getElementById('phone').value = data.user.phone;
                    }
                    if (data.user.gender) {
                        const genderInput = document.querySelector(`input[name="gender"][value="${data.user.gender}"]`);
                        if (genderInput) {
                            genderInput.checked = true;
                        }
                    }
                    if (data.user.date_of_birth) {
                        const date = new Date(data.user.date_of_birth);
                        document.getElementById('day').value = date.getDate();
                        document.getElementById('month').value = date.getMonth() + 1;
                        document.getElementById('year').value = date.getFullYear();
                    }
                }
                
                // Show success message
                document.getElementById('statusMessage').textContent = 'Profile updated successfully!';
                document.getElementById('statusMessage').className = 'alert alert-success';
                
                // Clear file input
                profileImageInput.value = '';
                
                // Reload the page after a short delay to ensure all data is displayed correctly
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            document.getElementById('statusMessage').textContent = 'Profile updated successfully!';
            document.getElementById('statusMessage').className = 'alert alert-success';
            
            // Reload the page after a short delay to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    });
    
    function showStatusMessage(message) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.classList.add('show');
        
        setTimeout(function() {
            statusMessage.classList.remove('show');
        }, 3000);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        // Philippine mobile number format: 09XXXXXXXXX
        const re = /^09\d{9}$/;
        return re.test(phone);
    }
    
    function updateUIForLoginStatus(isLoggedIn, username) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        
        if (isLoggedIn && username) {
            usernameDisplay.textContent = username;
            usernameDisplay.style.display = 'inline-block';
        }
    }
    
    // Chat functionality
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
            openChatModal();
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

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });

    // Function to load profile image on page load
    function loadProfileImage() {
        const profileImage = document.getElementById('profileImage');
        const profilePreview = document.getElementById('profilePreview');
        
        console.log('Loading profile images...');
        console.log('Profile Image Element:', profileImage);
        console.log('Profile Preview Element:', profilePreview);
        
        if (profileImage) {
            const currentSrc = profileImage.src;
            console.log('Current Profile Image Source:', currentSrc);
            
            // Check if the image exists in the database
            fetch('/my-account')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const dbImage = doc.querySelector('#profileImage').dataset.image;
                    console.log('Database Image:', dbImage);
                    
                    if (dbImage) {
                        const imagePath = `/static/profile_images/${dbImage}`;
                        console.log('Setting new image path:', imagePath);
                        
                        // Test if the image exists
                        fetch(imagePath)
                            .then(response => {
                                if (response.ok) {
                                    console.log('Image exists at path:', imagePath);
                                    profileImage.src = imagePath;
                                    if (profilePreview) {
                                        profilePreview.src = imagePath;
                                    }
                                } else {
                                    console.error('Image not found at path:', imagePath);
                                    // Try alternative path
                                    const altPath = `/website/static/profile_images/${dbImage}`;
                                    console.log('Trying alternative path:', altPath);
                                    fetch(altPath)
                                        .then(response => {
                                            if (response.ok) {
                                                console.log('Image exists at alternative path:', altPath);
                                                profileImage.src = altPath;
                                                if (profilePreview) {
                                                    profilePreview.src = altPath;
                                                }
                                            } else {
                                                console.error('Image not found at alternative path:', altPath);
                                                profileImage.src = '/static/pictures/user-circle.png';
                                                if (profilePreview) {
                                                    profilePreview.src = '/static/pictures/user-circle.png';
                                                }
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Error checking alternative image path:', error);
                                            profileImage.src = '/static/pictures/user-circle.png';
                                            if (profilePreview) {
                                                profilePreview.src = '/static/pictures/user-circle.png';
                                            }
                                        });
                                }
                            })
                            .catch(error => {
                                console.error('Error checking image:', error);
                                profileImage.src = '/static/pictures/user-circle.png';
                                if (profilePreview) {
                                    profilePreview.src = '/static/pictures/user-circle.png';
                                }
                            });
                    } else {
                        console.log('No image in database, using default');
                        profileImage.src = '/static/pictures/user-circle.png';
                        if (profilePreview) {
                            profilePreview.src = '/static/pictures/user-circle.png';
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching profile data:', error);
                });
        }
    }

    // Function to update user icon with profile image
    function updateUserIcon() {
        const userIcon = document.getElementById('user-icon');
        console.log('User Icon Element:', userIcon);
        
        if (userIcon) {
            // Get the profile image path from the database
            fetch('/my-account')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const dbImage = doc.querySelector('#profileImage').dataset.image;
                    console.log('Database Image:', dbImage);
                    
                    if (dbImage) {
                        const imagePath = `/static/profile_images/${dbImage}`;
                        console.log('Setting user icon to:', imagePath);
                        
                        // Test if the image exists
                        fetch(imagePath)
                            .then(response => {
                                if (response.ok) {
                                    console.log('Image exists, updating user icon');
                                    userIcon.src = imagePath;
                                    userIcon.style.borderRadius = '50%';
                                    userIcon.style.objectFit = 'cover';
                                    userIcon.style.width = '32px';
                                    userIcon.style.height = '32px';
                                } else {
                                    console.error('Image not found at path:', imagePath);
                                    // Try alternative path
                                    const altPath = `/website/static/profile_images/${dbImage}`;
                                    console.log('Trying alternative path:', altPath);
                                    fetch(altPath)
                                        .then(response => {
                                            if (response.ok) {
                                                console.log('Image exists at alternative path, updating user icon');
                                                userIcon.src = altPath;
                                                userIcon.style.borderRadius = '50%';
                                                userIcon.style.objectFit = 'cover';
                                                userIcon.style.width = '32px';
                                                userIcon.style.height = '32px';
                                            } else {
                                                console.error('Image not found at alternative path');
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Error checking alternative image path:', error);
                                        });
                                }
                            })
                            .catch(error => {
                                console.error('Error checking image:', error);
                            });
                    } else {
                        console.log('No profile image in database');
                    }
                })
                .catch(error => {
                    console.error('Error updating user icon:', error);
                });
        }
    }

    // Call updateUserIcon when the page loads and after profile updates
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM Content Loaded');
        loadProfileImage();
        updateUserIcon();
    });

    // Mask email
    const emailInput = document.getElementById('email');
    const maskedEmailSpan = document.getElementById('maskedEmail');
    if (emailInput && maskedEmailSpan) {
        const email = emailInput.value;
        maskedEmailSpan.textContent = maskEmail(email);
    }

    // Mask phone
    const phoneInput = document.getElementById('phone');
    const maskedPhoneSpan = document.getElementById('maskedPhone');
    if (phoneInput && maskedPhoneSpan) {
        const phone = phoneInput.value;
        maskedPhoneSpan.textContent = maskPhone(phone);
    }

    function maskEmail(email) {
        if (!email) return '';
        const [user, domain] = email.split('@');
        if (user.length <= 2) {
            return user + '*****@' + domain;
        }
        return user.slice(0, 2) + '*'.repeat(user.length - 2) + '@' + domain;
    }

    function maskPhone(phone) {
        if (!phone) return '';
        if (phone.length <= 2) {
            return '*'.repeat(phone.length);
        }
        return '*'.repeat(phone.length - 2) + phone.slice(-2);
    }
});