// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeModals();
    initializeSearch();
    initializeAnimations();
    initializeUserInteractions();
    initializeResponsiveFeatures();
});

// Slider Functionality
function initializeSlider() {
    const carousel = document.querySelector('#mainSlider');
    if (carousel) {
        // Auto-play carousel
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true,
            pause: 'hover'
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            carouselInstance.pause();
        });

        carousel.addEventListener('mouseleave', () => {
            carouselInstance.cycle();
        });

        // Add slide change animation
        carousel.addEventListener('slide.bs.carousel', function (e) {
            const activeSlide = e.relatedTarget;
            const title = activeSlide.querySelector('.slide-title');
            const description = activeSlide.querySelector('.slide-description');
            const button = activeSlide.querySelector('.btn');

            // Reset animations
            [title, description, button].forEach((element, index) => {
                if (element) {
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = `slideInRight 1s ease-out ${index * 0.3}s both`;
                    }, 50);
                }
            });
        });
    }
}

// Modal Functionality
function initializeModals() {
    // Login Modal
    const loginModal = document.getElementById('loginModal');
    const loginForm = loginModal?.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }

    // Register Modal
    const registerModal = document.getElementById('registerModal');
    const registerForm = registerModal?.querySelector('form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister(this);
        });
    }

    // Modal open animations
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-bs-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                setTimeout(() => {
                    modal.querySelector('.modal-content').style.animation = 'fadeInUp 0.5s ease-out';
                }, 100);
            }
        });
    });
}

// Login Handler
function handleLogin(form) {
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;
    const remember = form.querySelector('#rememberMe').checked;

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> در حال ورود...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        if (email && password) {
            showNotification('ورود با موفقیت انجام شد!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            updateUserState(true, { email });
        } else {
            showNotification('لطفا تمام فیلدها را پر کنید!', 'error');
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Register Handler
function handleRegister(form) {
    const name = form.querySelector('#registerName').value;
    const email = form.querySelector('#registerEmail').value;
    const phone = form.querySelector('#registerPhone').value;
    const password = form.querySelector('#registerPassword').value;
    const confirmPassword = form.querySelector('#registerConfirmPassword').value;
    const agreeTerms = form.querySelector('#agreeTerms').checked;

    // Validation
    if (!agreeTerms) {
        showNotification('لطفا قوانین و مقررات را بپذیرید!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('رمز عبور و تکرار آن مطابقت ندارند!', 'error');
        return;
    }

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> در حال ثبت نام...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        if (name && email && phone && password) {
            showNotification('ثبت نام با موفقیت انجام شد!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            updateUserState(true, { name, email });
        } else {
            showNotification('لطفا تمام فیلدها را پر کنید!', 'error');
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Search Functionality
function initializeSearch() {
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');

    if (searchBox && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', function() {
            performSearch(searchBox.value);
        });

        // Search on Enter key
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });

        // Live search suggestions
        let searchTimeout;
        searchBox.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length > 2) {
                    showSearchSuggestions(this.value);
                } else {
                    hideSearchSuggestions();
                }
            }, 300);
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            subscribeNewsletter(email);
        });
    }
}

// Search Function
function performSearch(query) {
    if (!query.trim()) {
        showNotification('لطفا عبارت جستجو را وارد کنید!', 'warning');
        return;
    }

    // Show loading in search button
    const searchBtn = document.querySelector('.search-box button');
    const originalHtml = searchBtn.innerHTML;
    searchBtn.innerHTML = '<span class="loading"></span>';

    // Simulate search
    setTimeout(() => {
        showNotification(`جستجو برای "${query}" انجام شد!`, 'info');
        searchBtn.innerHTML = originalHtml;
        // Here you would typically redirect to search results page
        // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }, 1000);
}

// Search Suggestions
function showSearchSuggestions(query) {
    const suggestions = [
        'دوره جامع شبکه',
        'برنامه‌نویسی پایتون',
        'امنیت شبکه',
        'آموزش لینوکس',
        'پایگاه داده',
        'محاسبات ابری',
        'DevOps و اتوماسیون',
        'هوش مصنوعی'
    ];

    const filteredSuggestions = suggestions.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredSuggestions.length > 0) {
        // Create suggestions dropdown (implement as needed)
        console.log('Suggestions:', filteredSuggestions);
    }
}

function hideSearchSuggestions() {
    // Hide suggestions dropdown
    console.log('Hide suggestions');
}

// Newsletter Subscription
function subscribeNewsletter(email) {
    if (!email || !validateEmail(email)) {
        showNotification('لطفا ایمیل معتبر وارد کنید!', 'error');
        return;
    }

    const btn = document.querySelector('.newsletter-form button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> در حال عضویت...';
    btn.disabled = true;

    setTimeout(() => {
        showNotification('عضویت در خبرنامه با موفقیت انجام شد!', 'success');
        document.querySelector('.newsletter-form input').value = '';
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .sidebar-widget, .section-title').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// User Interactions
function initializeUserInteractions() {
    // Product card interactions
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add to cart functionality
    document.querySelectorAll('.product-overlay .btn-warning').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h4, h5').textContent;
            addToCart(productName);
        });
    });

    // Social media link tracking
    document.querySelectorAll('.social-links a, .social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className;
            trackSocialClick(platform);
        });
    });

    // Category filter
    document.querySelectorAll('.category-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            filterByCategory(category);
        });
    });
}

// Add to Cart Function
function addToCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${productName} به سبد خرید اضافه شد!`, 'success');
}

// Update Cart UI
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart badge (if exists)
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Filter by Category
function filterByCategory(category) {
    showNotification(`نمایش محصولات دسته‌بندی: ${category}`, 'info');
    // Here you would implement actual filtering logic
}

// Social Media Click Tracking
function trackSocialClick(platform) {
    console.log(`Social media click: ${platform}`);
    showNotification('شما به شبکه اجتماعی هدایت می‌شوید...', 'info');
    // Here you would implement actual social media navigation
}

// Responsive Features
function initializeResponsiveFeatures() {
    // Mobile menu enhancements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Add animation class
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.style.animation = 'fadeInUp 0.3s ease-out';
                }
            }, 50);
        });
    }

    // Touch gestures for mobile
    if ('ontouchstart' in window) {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Swipe detection for carousel
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const carousel = document.querySelector('#mainSlider');
                if (carousel) {
                    const carouselInstance = bootstrap.Carousel.getInstance(carousel);
                    if (diffX > 0) {
                        carouselInstance.next();
                    } else {
                        carouselInstance.prev();
                    }
                }
            }
        });
    }

    // Window resize handler
    window.addEventListener('resize', function() {
        adjustLayoutForScreenSize();
    });

    // Initial layout adjustment
    adjustLayoutForScreenSize();
}

// Adjust Layout for Screen Size
function adjustLayoutForScreenSize() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
        // Mobile adjustments
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.marginBottom = '20px';
        });
    } else {
        // Desktop adjustments
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.marginBottom = '';
        });
    }
}

// Update User State
function updateUserState(isLoggedIn, userData = {}) {
    if (isLoggedIn) {
        // Update UI for logged in user
        const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
        const registerBtn = document.querySelector('[data-bs-target="#registerModal"]');
        
        if (loginBtn && registerBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${userData.name || userData.email || 'کاربر'}`;
            loginBtn.removeAttribute('data-bs-toggle');
            loginBtn.removeAttribute('data-bs-target');
            registerBtn.style.display = 'none';
            
            // Add logout functionality
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    showNotification('خروج با موفقیت انجام شد!', 'success');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification alert alert-${getBootstrapType(type)} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.5s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${getIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Helper Functions
function getBootstrapType(type) {
    const types = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    };
    return types[type] || 'info';
}

function getIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
        updateUserState(true, JSON.parse(userData));
    }
});

// Performance optimization
window.addEventListener('load', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});