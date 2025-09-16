// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addProjectModal = document.getElementById('addProjectModal');
    const closeModal = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const contactForm = document.getElementById('contactForm');
    const projectsGrid = document.querySelector('.projects-grid');

    // Menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Scroll suave para seções
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Destacar link ativo na navegação
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Modal para adicionar projeto
    addProjectBtn.addEventListener('click', function() {
        addProjectModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', function() {
        addProjectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        addProjectForm.reset();
    });

    cancelBtn.addEventListener('click', function() {
        addProjectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        addProjectForm.reset();
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target === addProjectModal) {
            addProjectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            addProjectForm.reset();
        }
    });

    // Adicionar novo projeto
    addProjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const projectData = {
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image') || 'https://via.placeholder.com/400x200?text=Projeto',
            demo: formData.get('demo'),
            github: formData.get('github'),
            technologies: formData.get('technologies').split(',').map(tech => tech.trim())
        };

        createProjectCard(projectData);
        
        // Fechar modal e resetar formulário
        addProjectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.reset();
        
        // Mostrar mensagem de sucesso
        showNotification('Projeto adicionado com sucesso!', 'success');
    });

    // Criar card de projeto
    function createProjectCard(project) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x200?text=Projeto'">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo ? `<a href="${project.demo}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                        </a>` : ''}
                        ${project.github ? `<a href="${project.github}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i>
                        </a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
        
        // Animar entrada do novo card
        setTimeout(() => {
            projectCard.classList.add('visible');
        }, 100);
    }

    // Inicializar EmailJS
    emailjs.init("W6n4uUF_2oA1CD9Kg");

    // Formulário de contato
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Enviar via EmailJS
        emailjs.sendForm('service_uk8mgx7', 'template_rwtvw02', this)
            .then(function(response) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, function(error) {
                console.error('Erro ao enviar email:', error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro!';
                showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
    });

    // Sistema de notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const iconClass = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle');
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
        `;

        // Adicionar estilos da notificação se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    z-index: 3000;
                    transform: translateX(400px);
                    transition: all 0.3s ease;
                    border-left: 4px solid var(--primary-color);
                }
                
                .notification-success {
                    border-left-color: #28a745;
                }
                
                .notification-error {
                    border-left-color: #dc3545;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .notification-content i {
                    color: var(--primary-color);
                }
                
                .notification-success .notification-content i {
                    color: #28a745;
                }
                
                .notification-error .notification-content i {
                    color: #dc3545;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Animações de entrada ao fazer scroll
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

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.project-card, .stat-item, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Efeito de digitação no título principal
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Aplicar efeito de digitação ao título
    const mainTitle = document.querySelector('.home-text h1 .highlight');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, originalText, 150);
        }, 1000);
    }

    // Contador animado para estatísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }

    // Observar estatísticas para animação de contador
    const statNumbers = document.querySelectorAll('.stat-item h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Smooth scroll para botões
    const smoothScrollButtons = document.querySelectorAll('a[href^="#"]');
    smoothScrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Adicionar classe ativa ao header no scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Adicionar estilos para header scrolled
    if (!document.querySelector('#header-scroll-styles')) {
        const headerStyles = document.createElement('style');
        headerStyles.id = 'header-scroll-styles';
        headerStyles.textContent = `
            .header.scrolled {
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 2px 30px rgba(0, 0, 0, 0.15);
            }
        `;
        document.head.appendChild(headerStyles);
    }

    // Lazy loading para imagens
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Função para salvar projetos no localStorage
    function saveProjects() {
        const projects = [];
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const image = card.querySelector('img').src;
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
            const links = Array.from(card.querySelectorAll('.project-link')).map(link => link.href);
            
            projects.push({
                title,
                description,
                image,
                technologies: techTags,
                demo: links.find(link => link.includes('http')) || '',
                github: links.find(link => link.includes('github')) || ''
            });
        });
        
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    }

    // Função para carregar projetos do localStorage
    function loadProjects() {
        const savedProjects = localStorage.getItem('portfolioProjects');
        if (savedProjects) {
            const projects = JSON.parse(savedProjects);
            // Remover projetos padrão se existirem projetos salvos
            if (projects.length > 3) {
                projectsGrid.innerHTML = '';
                projects.forEach(project => {
                    createProjectCard(project);
                });
            }
        }
    }

    // Carregar projetos salvos ao inicializar
    loadProjects();

    // Salvar projetos sempre que um novo for adicionado
    const originalCreateProjectCard = createProjectCard;
    createProjectCard = function(project) {
        originalCreateProjectCard(project);
        saveProjects();
    };

    console.log('Portfólio carregado com sucesso! 🚀');
});
