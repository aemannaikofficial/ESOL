document.addEventListener('DOMContentLoaded', () => {

    /* —— 1. INTERSECTION OBSERVER (Scroll Reveal) ——— */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.06,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* —— 2. STICKY HEADER SHRINK ON SCROLL ——————————— */
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.style.padding = '12px 0';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)';
        } else {
            header.style.padding = '18px 0';
            header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        }
    }, { passive: true });


    /* —— 3. ELEMENTOR MOBILE BURGER MENU TOGGLE ———————
       Elementor's JS normally drives this; since we run
       as a static replica, we replicate the behaviour.
    ———————————————————————————————————————————————————— */
    const menuToggles   = document.querySelectorAll('.elementor-menu-toggle');
    const mobileDropdowns = document.querySelectorAll(
        '.elementor-nav-menu--dropdown.elementor-nav-menu__container'
    );

    if (menuToggles.length > 0 && mobileDropdowns.length > 0) {
        menuToggles.forEach((menuToggle, index) => {
            const mobileDropdown = mobileDropdowns[index] || mobileDropdowns[0];

            // Inject a close (x) button at the top of the fullscreen menu
            if (!mobileDropdown.querySelector('.mobile-close-btn')) {
                const closeBtn = document.createElement('button');
                closeBtn.className  = 'mobile-close-btn';
                closeBtn.innerHTML  = '&times;';
                closeBtn.setAttribute('aria-label', 'Close menu');
                mobileDropdown.prepend(closeBtn);

                closeBtn.addEventListener('click', () => closeMenu(menuToggle, mobileDropdown));
            }

            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu toggle clicked');
                const isOpen = mobileDropdown.classList.contains('mobile-nav-open') || mobileDropdown.classList.contains('elementor-active');
                if (isOpen) {
                    closeMenu(menuToggle, mobileDropdown);
                    mobileDropdown.classList.remove('elementor-active');
                } else {
                    openMenu(menuToggle, mobileDropdown);
                    mobileDropdown.classList.add('elementor-active');
                }
            }, true); // Use capture phase to intercept before Elementor

            // Close when any nav link is clicked
            mobileDropdown.querySelectorAll('a').forEach(link => {
            if (link.parentElement.classList.contains('menu-item-has-children')) {
                link.addEventListener('click', (e) => {
                    if (!link.parentElement.classList.contains('submenu-open')) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Close other submenus
                        mobileDropdown.querySelectorAll('.submenu-open').forEach(el => {
                            if (el !== link.parentElement) el.classList.remove('submenu-open');
                        });
                        link.parentElement.classList.add('submenu-open');
                    }
                });
            } else {
                link.addEventListener('click', () => closeMenu(menuToggle, mobileDropdown));
            }
        });
        });

        // Close on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                menuToggles.forEach((t, i) => closeMenu(t, mobileDropdowns[i] || mobileDropdowns[0]));
            }
        });
    }

    function openMenu(toggle, dropdown) {
        if (!dropdown || !toggle) return;
        dropdown.classList.add('mobile-nav-open');
        dropdown.setAttribute('aria-hidden', 'false');
        dropdown.style.setProperty('display', 'flex', 'important');
        dropdown.style.setProperty('visibility', 'visible', 'important');
        dropdown.style.setProperty('opacity', '1', 'important');
        toggle.classList.add('elementor-active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    function closeMenu(toggle, dropdown) {
        if (!dropdown || !toggle) return;
        dropdown.classList.remove('mobile-nav-open');
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.style.setProperty('display', 'none', 'important');
        toggle.classList.remove('elementor-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }


    /* —— 4. SMOOTH SCROLL FOR ALL ANCHOR LINKS ———————— */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerH = header ? header.offsetHeight : 0;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - headerH - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    /* —— 5. COURSE CARD HOVER TILT EFFECT ————————————— */
    document.querySelectorAll('.course-card, .info-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
            card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* —— 6. TEACHER CAROUSEL HANDLER —————————————————— */
    const carouselGrid = document.querySelector('.teacher-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots-container');

    if (carouselGrid && prevBtn && nextBtn && dotsContainer) {
        const cards = Array.from(carouselGrid.querySelectorAll('.teacher-card'));
        
        // Generate dots dynamically based on items
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const scrollLeft = cards[index].offsetLeft - carouselGrid.offsetLeft;
                carouselGrid.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            });
            
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        // Execute horizontal scrolling
        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(carouselGrid).gap || 20);
            carouselGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(carouselGrid).gap || 20);
            carouselGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        // Smart highlight the active dot based on current scroll position
        carouselGrid.addEventListener('scroll', () => {
            let activeIndex = 0;
            let minDistance = Infinity;
            const containerScrollLeft = carouselGrid.scrollLeft;
            
            cards.forEach((card, index) => {
                const distance = Math.abs((card.offsetLeft - carouselGrid.offsetLeft) - containerScrollLeft);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });

            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[activeIndex]) dots[activeIndex].classList.add('active');
        }, { passive: true });
    }

});
