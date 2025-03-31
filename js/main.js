// Force dark theme immediately when script loads
(function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    // Force dark theme
    navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
    
    // Handle scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.98)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
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
    document.querySelector('.nav-content').appendChild(menuButton);

    const navLinks = document.querySelector('.nav-links');
    
    // Toggle menu
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle menu icon
        const icon = menuButton.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuButton.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && 
            !e.target.closest('.menu-toggle') && 
            navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuButton.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Prevent menu from staying open on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuButton.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
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

    // Call fetchGitHubProjects when the DOM is loaded
    fetchGitHubProjects();
});

// Move these functions outside of any event listener
async function fetchGitHubProjects() {
    try {
        // Add console log to verify function is being called
        console.log('Fetching GitHub projects...');
        
        const username = 'vradcar'; // Make sure this is your exact GitHub username
        const apiUrl = `https://api.github.com/users/${username}/repos`;
        
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
        }
        
        const repos = await response.json();
        console.log('Fetched repos:', repos);

        if (!repos || repos.length === 0) {
            console.log('No repositories found');
            return;
        }

        // Filter and sort repos by stars
        const filteredRepos = repos
            .filter(repo => !repo.fork && repo.description)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4);

        console.log('Filtered repos:', filteredRepos);

        if (filteredRepos.length === 0) {
            console.log('No repos match the criteria (non-fork with description)');
            return;
        }

        const projectsSection = document.getElementById('projects');
        if (!projectsSection) {
            console.error('Projects section not found');
            return;
        }

        // Add GitHub section title
        const githubTitle = document.createElement('h2');
        githubTitle.className = 'github-projects-title';
        githubTitle.textContent = 'Featured GitHub Projects';
        projectsSection.appendChild(githubTitle);

        // Create container for GitHub projects
        const githubContainer = document.createElement('div');
        githubContainer.className = 'project-grid github-projects';
        
        filteredRepos.forEach(repo => {
            const card = createGitHubProjectCard(repo);
            githubContainer.appendChild(card);
        });

        projectsSection.appendChild(githubContainer);

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

function createGitHubProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card github-card';
    
    const techStack = [...new Set([repo.language, ...(repo.topics || [])])].filter(Boolean);

    card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description}</p>
        <div class="tech-stack">
            ${techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-stats">
            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
        </div>
        <div class="project-links">
            <a href="${repo.html_url}" target="_blank">
                <i class="fab fa-github"></i> View Code
            </a>
            ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Make sure the function is called when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, fetching GitHub projects...');
    fetchGitHubProjects();
});

