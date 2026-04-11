document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. INTERSECTION OBSERVER (Scroll Reveal) ─── */
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


    /* ── 2. STICKY HEADER SHRINK ON SCROLL ─────────── */
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


    /* ── 3. MOBILE BURGER MENU TOGGLE ───────────────── */
    const burger = document.querySelector('.burger');
    const navUl  = document.querySelector('nav ul');

    if (burger && navUl) {
        burger.addEventListener('click', () => {
            navUl.classList.toggle('nav-active');
            const icon = burger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when any nav link is clicked
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('nav-active');
                const icon = burger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }


    /* ── 4. SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────── */
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


    /* ── 5. COURSE CARD HOVER TILT EFFECT ─────────────── */
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

    /* ── 6. TEACHER CAROUSEL HANDLER ─────────────────── */
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
