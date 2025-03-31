document.addEventListener('DOMContentLoaded', function() {
    // Add dark theme class immediately on load
    const navbar = document.querySelector('.navbar');
    navbar.classList.add('dark-theme');

    // Update navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add scroll progress indicator with dark theme colors
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });

    // Add mobile menu toggle
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.nav-content').prepend(menuButton);

    menuButton.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add smooth reveal animations
    const revealElements = document.querySelectorAll('.project-card, .experience-card, .skill-category');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Add stagger effect for child elements
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('revealed');
                });
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(element => revealObserver.observe(element));

    // Add animation for timeline items
    document.addEventListener('DOMContentLoaded', () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });

        // Add hover effect for skill categories
        const skillCategories = document.querySelectorAll('.skill-category');
        
        skillCategories.forEach(category => {
            category.addEventListener('mouseenter', () => {
                const tags = category.querySelectorAll('.skill-tag');
                tags.forEach((tag, index) => {
                    tag.style.transitionDelay = `${index * 0.05}s`;
                    tag.style.transform = 'scale(1.05)';
                });
            });

            category.addEventListener('mouseleave', () => {
                const tags = category.querySelectorAll('.skill-tag');
                tags.forEach(tag => {
                    tag.style.transitionDelay = '0s';
                    tag.style.transform = 'scale(1)';
                });
            });
        });
    });
});


