
(function () {
    'use strict';

    console.log('Raiz Bottle JS Loaded');
    const header = document.querySelector('.header');
    const menuButton = document.querySelector('.menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const modal = document.getElementById('checkout-modal');
    const summaryPlan = document.getElementById('summary-plan');
    const summaryPrice = document.getElementById('summary-price');
    const toast = document.getElementById('toast');
    let lastFocus = null;

    // ============ MENU MOBILE ============
    function setMenu(open) {
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        mobileMenu.classList.toggle('is-open', open);
        mobileMenu.setAttribute('aria-hidden', String(!open));
    }

    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        setMenu(!isOpen);
    });

    mobileMenu.querySelectorAll('a, button').forEach(item => item.addEventListener('click', () => setMenu(false)));

    // ============ SCROLL SUAVE ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const id = anchor.getAttribute('href');
            if (id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;
            event.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ============ MODAL ============
    function openModal(plan, price) {
        lastFocus = document.activeElement;
        summaryPlan.textContent = plan || '';
        summaryPrice.textContent = 'R$ ' + (price || '79,90');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('name').focus(), 80);
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-open-modal]').forEach(button => {
        button.addEventListener('click', () => openModal(button.dataset.plan, button.dataset.price));
    });

    document.querySelector('[data-close-modal]').addEventListener('click', closeModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

    // ============ TECLADO ============
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') { setMenu(false); closeModal(); }
        if (event.key === 'Tab' && modal.classList.contains('is-open')) {
            const focusable = modal.querySelectorAll('button, input, select, a, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });

    // ============ FAQ ============
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('is-open');
                faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('is-open');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ============ FORMULÁRIO ============
    document.getElementById('checkout-form').addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) { form.reportValidity(); return; }
        closeModal();
        form.reset();
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 3500);
    });

    // ============ REVEAL ANIMATIONS ============
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }

    // ============ SELETOR DE CORES ============
        // ============ SELETOR DE CORES ============
    const colorOptions = document.querySelectorAll('.color-option');
    const mainProductImg = document.getElementById('main-product-img');
    
    // Mapeamento usando as suas imagens locais na pasta assets
    // Certifique-se de que os nomes dos arquivos (ex: garrafa-bambu.jpg) estejam corretos
        const colorImages = {
            "Bambu": "assets/garrafa-bambu.png",
        "Carvão": "assets/Carvão.png",
        "Dusty Rose": "assets/Dusty Rose.png",
        "Slate-Blue": "assets/Slate-Blue.png",
        "Ice Blue": "assets/Ice Blue.png",
        "Off White": "assets/Off White.png",
    };

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const colorName = option.dataset.colorName;
            
            colorOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.setAttribute('aria-checked', 'false');
            });
            
            option.classList.add('active');
            option.setAttribute('aria-checked', 'true');

            // Troca a imagem local com efeito de fade
            if (mainProductImg && colorImages[colorName]) {
                mainProductImg.style.opacity = '0';
                setTimeout(() => {
                    mainProductImg.src = colorImages[colorName];
                    mainProductImg.onload = () => {
                        mainProductImg.style.opacity = '1';
                    };
                }, 200);
            }
        });
    });
    // ============ SCROLL HEADER SHADOW ============
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        window.requestAnimationFrame(() => {
            header.style.boxShadow = window.scrollY > 12 ? '0 10px 30px rgba(28, 28, 28, .08)' : 'none';
            ticking = false;
        });
        ticking = true;
    });
})();
