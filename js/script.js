document.addEventListener('DOMContentLoaded', () => {

    // 1. Анимации при скролле (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Активация элементов первого экрана при загрузке
    setTimeout(() => {
        const heroReveals = document.querySelectorAll('#hero .reveal');
        heroReveals.forEach(el => el.classList.add('active'));
    }, 100);

    // 2. FAQ Аккордеон
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 3. Установка текущего года в копирайт
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 4. Плавный скролл для меню
    document.querySelectorAll('.nav-link, .logo, .btn-outline').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 5. Логика Бургер-меню
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    if(burgerMenu && mobileNav) {
        const mobileNavLinks = mobileNav.querySelectorAll('a');

        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : ''; 
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 6. Кастомный Select с анимацией
    const customSelect = document.getElementById('customSelect');
    const serviceInput = document.getElementById('serviceInput');
    if(customSelect && serviceInput) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const options = customSelect.querySelectorAll('.custom-option');
        const triggerText = trigger.querySelector('span');

        trigger.addEventListener('click', function() {
            customSelect.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function() {
                triggerText.textContent = this.textContent;
                serviceInput.value = this.getAttribute('data-value');
                triggerText.style.color = 'var(--color-text-main)';
                customSelect.classList.remove('open');
                
                trigger.style.borderColor = 'var(--color-accent)';
                trigger.style.boxShadow = '0 0 20px var(--color-accent-glow)';
                setTimeout(() => {
                    trigger.style.boxShadow = 'none';
                    trigger.style.borderColor = 'var(--border-color)';
                }, 800);
            });
        });

        document.addEventListener('click', function(e) {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // 7. Параллакс фона при движении мыши
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.orb');
        if (orbs.length > 0) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 30;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }
    });

    // 8. Умное воспроизведение видео (Intersection Observer)
    const videoObserverOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                video.play().catch(error => {
                    console.log("Автовоспроизведение заблокировано браузером:", error);
                });
            } else {
                video.pause();
            }
        });
    }, videoObserverOptions);

    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
        videoObserver.observe(video);
    });

    // 9. Обработка формы
    const form = document.getElementById('requestForm');
    const statusDiv = document.getElementById('formStatus');

    if (form && statusDiv) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            statusDiv.style.color = 'var(--color-text-muted)';
            statusDiv.textContent = '';

            try {
                const response = await fetch('php/send.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    form.reset();
                    statusDiv.style.color = '#4CAF50';
                    statusDiv.textContent = 'Спасибо! Ваша заявка успешно отправлена.';
                } else {
                    throw new Error('Ошибка сервера');
                }
            } catch (error) {
                statusDiv.style.color = '#F44336';
                statusDiv.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить запрос';
            }
        });
    }
});