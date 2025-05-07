document.addEventListener('DOMContentLoaded', function () {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const profileImage = document.getElementById('profileImage');

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    const profile = localStorage.getItem('profile'); 

    if (isLoggedIn && username) {
        usernameDisplay.textContent = username;
        sidebarUsername.textContent = username;

        if (profile) {
            const profileData = JSON.parse(profile); 
            if (profileData.image) {
                profileImage.src = profileData.image;
            }
        }

        dropdownMenu.innerHTML = `
            <ul>
                <li><a href="/my-account">My Account</a></li>
                <li><a href="logout.html" id="logoutBtn">Logout</a></li>
            </ul>
        `;

        document.getElementById('logoutBtn').addEventListener('click', function () {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('profile');
            window.location.href = 'index.html';
        });
    } else {
        usernameDisplay.textContent = 'Guest';
        sidebarUsername.textContent = 'Guest';

        dropdownMenu.innerHTML = `
            <ul>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            </ul>
        `;
    }
});