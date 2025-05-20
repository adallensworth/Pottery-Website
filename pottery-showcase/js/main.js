document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !event.target.closest('nav') && 
            !event.target.closest('.mobile-menu-toggle')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Gallery filtering functionality (for gallery page)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide gallery items based on filter
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Lazy loading images for better performance
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
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
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        function lazyLoad() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top <= window.innerHeight && 
                    img.getBoundingClientRect().bottom >= 0 && 
                    getComputedStyle(img).display !== 'none') {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            
            if (lazyImages.length === 0) { 
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationChange', lazyLoad);
            }
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
    
    // Form validation for contact and newsletter forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Create error message if it doesn't exist
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.classList.add('error-message');
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if it exists
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                    
                    // Email validation
                    if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
                        valid = false;
                        field.classList.add('error');
                        
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.classList.add('error-message');
                            errorMsg.textContent = 'Please enter a valid email address';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    }
                }
            });
            
            if (!valid) {
                event.preventDefault();
            } else {
                // For demo purposes - in a real site, you'd handle form submission via AJAX or redirect
                if (form.classList.contains('newsletter-form')) {
                    event.preventDefault();
                    alert('Thank you for subscribing to our newsletter!');
                    form.reset();
                } else if (form.classList.contains('contact-form')) {
                    event.preventDefault();
                    alert('Thank you for your message. We will get back to you soon!');
                    form.reset();
                }
            }
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL but without scrolling
            history.pushState(null, null, targetId);
        }
    });
});

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 50) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Image lightbox functionality
function setupLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    if (galleryImages.length > 0) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Enlarged pottery piece">
                <div class="lightbox-caption"></div>
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&lsaquo;</button>
                <button class="lightbox-next">&rsaquo;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        let currentIndex = 0;
        
        // Open lightbox
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
                
                // Get caption from data attribute or parent element
                const caption = this.dataset.caption || 
                               this.closest('.gallery-item').querySelector('.gallery-title')?.textContent || '';
                lightboxCaption.textContent = caption;
                
                currentIndex = index;
                updateNavButtons();
                
                // Prevent scrolling when lightbox is open
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Navigate through images
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                }
            }
        });
        
        function showPrevImage() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        }
        
        function showNextImage() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightboxImage();
        }
        
        function updateLightboxImage() {
            const img = galleryImages[currentIndex];
            lightboxImg.src = img.src;
            
            const caption = img.dataset.caption || 
                           img.closest('.gallery-item').querySelector('.gallery-title')?.textContent || '';
            lightboxCaption.textContent = caption;
            
            updateNavButtons();
        }
        
        function updateNavButtons() {
            // Only show navigation buttons if there's more than one image
            if (galleryImages.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
        }
    }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', setupLightbox);