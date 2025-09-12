// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initGallery();
    initSmoothScrolling();
    initFormHandling();
    initLoadingScreen();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navigation on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.btn');

    // Add smooth scrolling to all navigation links
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.section-title, .section-divider, .bio-content, .performance-card, .press-card, .testimonial-card, .contact-content');
    
    animatedElements.forEach((element, index) => {
        // Add staggered animation delays
        element.style.animationDelay = `${index * 0.1}s`;
        
        if (element.classList.contains('section-title') || element.classList.contains('section-divider')) {
            element.classList.add('fade-in');
        } else if (element.classList.contains('bio-content')) {
            element.classList.add('slide-in-left');
        } else if (element.classList.contains('performance-card') || element.classList.contains('press-card') || element.classList.contains('testimonial-card')) {
            element.classList.add('zoom-in');
        } else {
            element.classList.add('fade-in');
        }
        
        observer.observe(element);
    });
}

// Gallery functionality
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // Image files to load (excluding logo.png) - mixed with new pictures
    const imageFiles = [
        'IMG_1013.JPG',
        'IMG_1015.JPG', 
        'MFP05096.jpg',
        'MFP05088.jpg',
        'IMG_2531.JPG',
        'IMG-20250812-WA0016.jpg',
        'IMG-20250812-WA0017.jpg',
        'JAYMES.jpg',
        'IMG-20250812-WA0021.jpg',
        'IMG-20250812-WA0022.jpg'
    ];

    let currentImageIndex = 0;
    let galleryImages = [];

    // Create gallery items
    imageFiles.forEach((filename, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = `Images/${filename}`;
        img.alt = `Gallery Image ${index + 1}`;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = '<i class="fas fa-search-plus"></i>';

        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        galleryGrid.appendChild(galleryItem);

        galleryImages.push({
            src: `Images/${filename}`,
            alt: `Gallery Image ${index + 1}`
        });

        // Add click event to open lightbox
        galleryItem.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox();
        });
    });

    // Open lightbox
    function openLightbox() {
        lightbox.classList.add('active');
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Show next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
    }

    // Show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
            }
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage(); // Swipe left - next image
            } else {
                showPrevImage(); // Swipe right - previous image
            }
        }
    }
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.form-button');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Submit to Formspree
            fetch('https://formspree.io/f/mqadgwjj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success
                    submitButton.textContent = 'Message Sent!';
                    submitButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitButton.textContent = 'Error - Try Again';
                submitButton.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
                    submitButton.disabled = false;
                }, 3000);
            });
        });
    }
}

// Loading screen
function initLoadingScreen() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingScreen);

    // Hide loading screen when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
}

// Performance card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const performanceCards = document.querySelectorAll('.performance-card');
    
    performanceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', initTypingEffect);

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const suffix = counter.textContent.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when statistics section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.bio-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Add smooth reveal animation to sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize reveal on scroll
document.addEventListener('DOMContentLoaded', revealOnScroll);

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .form-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize ripple effect
document.addEventListener('DOMContentLoaded', addRippleEffect);
