// app.js - Main interactive logic for Photon Flux Energy

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar & Nav styling
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // Progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';

        // Nav background
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu?.classList.toggle('hidden');
        mobileMenu?.classList.toggle('flex');
        document.body.style.overflow = mobileMenu?.classList.contains('hidden') ? '' : 'hidden';
    }

    mobileMenuBtn?.addEventListener('click', toggleMenu);
    closeMenuBtn?.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Number Counter Animation (for Stats)
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const start = 0;
                let startTime = null;

                const isFloat = target % 1 !== 0;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Easing out function
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    
                    const currentVal = easeProgress * target;
                    
                    entry.target.innerText = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);

                    if (progress < 1) {
                        requestAnimationFrame(animation);
                    } else {
                        entry.target.innerText = target;
                    }
                }
                
                requestAnimationFrame(animation);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 5. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    // Respect user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    }

    // 6. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('button');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        btn.addEventListener('click', () => {
            // Close others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-content').classList.remove('active');
                    otherItem.querySelector('.faq-icon').classList.remove('active');
                }
            });

            // Toggle current
            const isActive = content.classList.contains('active');
            if (isActive) {
                content.classList.remove('active');
                icon.classList.remove('active');
            } else {
                // We use a tiny timeout to ensure display:block applies before animating opacity/height
                content.classList.add('active');
                icon.classList.add('active');
            }
        });
    });

});
