// User data storage
let users = JSON.parse(localStorage.getItem('users')) || [];

// DOM Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
}

// Registration form handling
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        let isValid = true;

        // Email validation
        if (!email) {
            showError('emailError', 'Email không được để trống');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('emailError', 'Email không đúng định dạng');
            isValid = false;
        } else {
            clearError('emailError');
        }

        // Password validation
        if (!password) {
            showError('passwordError', 'Mật khẩu không được để trống');
            isValid = false;
        } else if (password.length < 6) {
            showError('passwordError', 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        } else {
            clearError('passwordError');
        }

        // Confirm password validation
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Xác nhận mật khẩu không được để trống');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Mật khẩu xác nhận không khớp');
            isValid = false;
        } else {
            clearError('confirmPasswordError');
        }

        if (isValid) {
            // Check if user already exists
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                showError('emailError', 'Email đã được đăng ký');
                return;
            }

            // Register new user
            users.push({ email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// Login form handling
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        let isValid = true;

        // Email validation
        if (!email) {
            showError('loginEmailError', 'Email không được để trống');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('loginEmailError', 'Email không đúng định dạng');
            isValid = false;
        } else {
            clearError('loginEmailError');
        }

        // Password validation
        if (!password) {
            showError('loginPasswordError', 'Mật khẩu không được để trống');
            isValid = false;
        } else {
            clearError('loginPasswordError');
        }

        if (isValid) {
            // Check user credentials
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                // Store logged in user
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                showError('loginPasswordError', 'Email hoặc mật khẩu không đúng');
            }
        }
    });
}

// Logout functionality
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }
}

// Check authentication status
function checkAuth() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    } else if (!loggedInUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Initialize auth check
checkAuth();