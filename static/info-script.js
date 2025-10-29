// =====================================================
// OCEANIX Information Page - JavaScript
// Theme toggle, scroll spy and interactions
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initSmoothScroll();
    initScrollSpy();
    initIntersectionObserver();
});

// ===== Theme Toggle =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100; // Adjust for sticky header
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Scroll Spy for Table of Contents =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const tocLinks = document.querySelectorAll('.toc-link, .toc-sublink');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current link
                const activeLink = document.querySelector(`.toc-link[data-section="${id}"], .toc-sublink[data-section="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    
                    // Also activate parent section if it's a subsection
                    if (activeLink.classList.contains('toc-sublink')) {
                        const parentSection = activeLink.closest('.toc-subsections')?.previousElementSibling;
                        if (parentSection && parentSection.classList.contains('toc-link')) {
                            parentSection.classList.add('active');
                        }
                    }
                    
                    // Scroll TOC into view if needed
                    activeLink.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== Intersection Observer for Animations =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for fade-in animation
    document.querySelectorAll('.info-card, .flow-card, .benefit-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== Sticky TOC sidebar on scroll =====
window.addEventListener('scroll', () => {
    const tocSidebar = document.getElementById('tocSidebar');
    if (!tocSidebar) return;
    
    const scrolled = window.pageYOffset;
    
    if (scrolled > 200) {
        tocSidebar.style.boxShadow = 'var(--shadow-lg)';
    } else {
        tocSidebar.style.boxShadow = 'var(--shadow-md)';
    }
});
