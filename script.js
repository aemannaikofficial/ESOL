document.addEventListener('DOMContentLoaded', () => {

    /* â”€â”€ 1. INTERSECTION OBSERVER (Scroll Reveal) â”€â”€â”€ */
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


    /* â”€â”€ 2. STICKY HEADER SHRINK ON SCROLL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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


    /* â”€â”€ 3. ELEMENTOR MOBILE BURGER MENU TOGGLE â”€â”€â”€â”€â”€â”€â”€â”€â”€
       Elementor's JS normally drives this; since we run
       as a static replica, we replicate the behaviour.
    â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const menuToggle   = document.querySelector('.elementor-menu-toggle');
    const mobileDropdown = document.querySelector(
        '.elementor-nav-menu--dropdown.elementor-nav-menu__container'
    );

    if (menuToggle && mobileDropdown) {

        // Inject a close (Ã—) button at the top of the fullscreen menu
        if (!mobileDropdown.querySelector('.mobile-close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className  = 'mobile-close-btn';
            closeBtn.innerHTML  = '&times;';
            closeBtn.setAttribute('aria-label', 'Close menu');
            mobileDropdown.prepend(closeBtn);

            closeBtn.addEventListener('click', closeMenu);
        }

        menuToggle.addEventListener('click', () => {
            const isOpen = mobileDropdown.classList.contains('mobile-nav-open');
            isOpen ? closeMenu() : openMenu();
        });

        // Close when any nav link is clicked
        mobileDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    function openMenu() {
        if (!mobileDropdown || !menuToggle) return;
        mobileDropdown.classList.add('mobile-nav-open');
        mobileDropdown.setAttribute('aria-hidden', 'false');
        menuToggle.classList.add('elementor-active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    function closeMenu() {
        if (!mobileDropdown || !menuToggle) return;
        mobileDropdown.classList.remove('mobile-nav-open');
        mobileDropdown.setAttribute('aria-hidden', 'true');
        menuToggle.classList.remove('elementor-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }


    /* â”€â”€ 4. SMOOTH SCROLL FOR ALL ANCHOR LINKS â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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


    /* â”€â”€ 5. COURSE CARD HOVER TILT EFFECT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

    /* â”€â”€ 6. TEACHER CAROUSEL HANDLER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

