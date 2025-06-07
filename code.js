// Funcionalidades do site da Odontologia Sorrisão

// Configurações globais
const CONFIG = {
    scrollOffset: 100,
    animationDuration: 300,
    breakpoints: {
        mobile: 768,
        tablet: 1024
    }
};

// Classe principal do site
class DentalSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupFormValidation();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.initializeComponents();
    }

    // Event Listeners
    setupEventListeners() {
        // Quando o DOM estiver carregado
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMContentLoaded();
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    onDOMContentLoaded() {
        // Adicionar classe de fade-in aos elementos
        this.addFadeInAnimations();
        
        // Verificar se há âncora na URL
        this.handleUrlAnchor();
        
        // Mostrar loading concluído
        document.body.classList.remove('loading');
    }

    // Navegação mobile
    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu(hamburger, navMenu);
            });

            // Fechar menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu(hamburger, navMenu);
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu(hamburger, navMenu);
                }
            });
        }
    }

    toggleMobileMenu(hamburger, navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animar as barras do hamburger
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
        
        // Prevenir scroll no body quando menu estiver aberto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu(hamburger, navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
        
        document.body.style.overflow = '';
    }

    // Smooth scrolling
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const targetPosition = element.offsetTop - CONFIG.scrollOffset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Animações de scroll
    setupScrollAnimations() {
        this.observeElements();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos que devem ter animação
        const elementsToObserve = document.querySelectorAll('.service-card, .info-item, .about-text, .about-image');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    addFadeInAnimations() {
        const elements = document.querySelectorAll('.hero-content, .section-header');
        elements.forEach(el => el.classList.add('fade-in-up'));
    }

    // Validação de formulário
    setupFormValidation() {
        const form = document.getElementById('contactForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });

            // Validação em tempo real
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remover erros anteriores
        this.clearFieldError(field);

        // Validações específicas
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um email válido';
                }
                break;
            case 'tel':
                const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                if (!phoneRegex.test(value) && value.length > 0) {
                    isValid = false;
                    errorMessage = 'Formato: (11) 99999-9999';
                }
                break;
            default:
                if (field.hasAttribute('required') && value === '') {
                    isValid = false;
                    errorMessage = 'Este campo é obrigatório';
                }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Criar elemento de erro se não existir
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validar todos os campos
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(data, form);
        } else {
            this.showFormError('Por favor, corrija os erros acima');
        }
    }

    async submitForm(data, form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Estado de loading
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        form.classList.add('loading');

        try {
            // Simular envio (aqui você integraria com seu backend)
            await this.simulateFormSubmission(data);
            
            // Sucesso
            this.showFormSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            form.reset();
            
        } catch (error) {
            this.showFormError('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            // Restaurar estado do botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        }
    }

    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados do formulário:', data);
                resolve();
            }, 2000);
        });
    }

    showFormSuccess(message) {
        this.showFormMessage(message, 'success');
    }

    showFormError(message) {
        this.showFormMessage(message, 'error');
    }

    showFormMessage(message, type) {
        // Remover mensagens anteriores
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Criar nova mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Adicionar ao formulário
        const form = document.getElementById('contactForm');
        form.insertBefore(messageElement, form.firstChild);

        // Remover após 5 segundos
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Manipulação de scroll
    handleScroll() {
        this.updateNavbarOnScroll();
        this.updateActiveNavLink();
    }

    updateNavbarOnScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Redimensionamento
    handleResize() {
        // Fechar menu mobile se mudar para desktop
        if (window.innerWidth > CONFIG.breakpoints.mobile) {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                this.closeMobileMenu(hamburger, navMenu);
            }
        }
    }

    // Manipular âncora da URL
    handleUrlAnchor() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    this.scrollToElement(targetElement);
                }, 100);
            }
        }
    }

    // Inicializar componentes adicionais
    initializeComponents() {
        this.setupPhoneMask();
        this.setupLazyLoading();
        this.setupBackToTop();
    }

    // Máscara para telefone
    setupPhoneMask() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 7) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d*)/, '$1');
                }
                
                e.target.value = value;
            });
        });
    }

    // Lazy loading para imagens
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Botão voltar ao topo
    setupBackToTop() {
        // Criar botão se não existir
        let backToTopBtn = document.querySelector('.back-to-top');
        
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
            document.body.appendChild(backToTopBtn);
        }

        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Ação do clique
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Utilitários
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Verificar se é dispositivo móvel
    isMobile() {
        return window.innerWidth <= CONFIG.breakpoints.mobile;
    },

    // Formatação de texto
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }
};

// Adicionar estilos CSS dinâmicos para componentes JavaScript
const additionalStyles = `
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }

    .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 5px;
    }

    .form-message {
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
    }

    .form-message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .form-message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .nav-link.active {
        color: #2B8CE8;
        font-weight: 600;
    }

    .back-to-top {
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        background: #2B8CE8;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(43, 140, 232, 0.3);
    }

    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
    }

    .back-to-top:hover {
        background: #1E6BBF;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(43, 140, 232, 0.4);
    }

    @media (max-width: 768px) {
        .back-to-top {
            left: 20px;
            bottom: 90px;
        }
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Inicializar aplicação
const dentalSite = new DentalSite();