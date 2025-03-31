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
    
    // Add animation delay to nav items
    const navItems = navLinks.querySelectorAll('li');
    navItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Toggle menu
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = menuButton.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Toggle body scroll
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuButton.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            document.body.style.overflow = '';
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
            document.body.style.overflow = '';
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
        const username = 'vradcar';
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
        };
        
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
        }

        const repos = await response.json();
        
        // Sort all repos by latest update
        const filteredRepos = repos
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6); // Show latest 6 repos

        if (filteredRepos.length === 0) {
            throw new Error('No matching GitHub projects found');
        }

        const projectsContainer = document.querySelector('.project-grid');
        if (!projectsContainer) {
            throw new Error('Project grid not found');
        }

        // Remove existing GitHub section if it exists
        const existingGithubSection = document.querySelector('.github-projects-section');
        if (existingGithubSection) {
            existingGithubSection.remove();
        }

        // Create container for GitHub section
        const githubSection = document.createElement('div');
        githubSection.className = 'github-projects-section';

        const githubTitle = document.createElement('h2');
        githubTitle.className = 'github-projects-title';
        githubTitle.textContent = 'Latest GitHub Projects';

        const githubContainer = document.createElement('div');
        githubContainer.className = 'project-grid github-projects';
        
        filteredRepos.forEach(repo => {
            const card = createGitHubProjectCard(repo);
            githubContainer.appendChild(card);
        });

        // Create button container for centering
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'view-all-button-container';

        const viewAllButton = document.createElement('a');
        viewAllButton.href = `https://github.com/${username}?tab=repositories`;
        viewAllButton.target = '_blank';
        viewAllButton.className = 'view-all-button';
        viewAllButton.textContent = 'View All Projects';

        buttonContainer.appendChild(viewAllButton);

        githubSection.appendChild(githubTitle);
        githubSection.appendChild(githubContainer);
        githubSection.appendChild(buttonContainer);
        projectsContainer.parentElement.insertBefore(githubSection, projectsContainer.nextSibling);

    } catch (error) {
        console.error('GitHub projects error:', error.message);
    }
}

function createGitHubProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card github-card';
    
    // Convert topics/languages to tech stack
    const techStack = repo.topics || [];
    if (repo.language) techStack.unshift(repo.language);

    // Use a default description if none is provided
    const description = repo.description || 'No description available';

    card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${description}</p>
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

// Optional: Add this function to show fallback projects when API fails
function addFallbackProjects() {
    const projectsContainer = document.querySelector('.project-grid');
    if (!projectsContainer) return;

    const fallbackProjects = [
        {
            name: "Portfolio Website",
            description: "Personal portfolio website built with modern web technologies",
            language: "JavaScript",
            topics: ["HTML", "CSS", "JavaScript"],
            html_url: "https://github.com/vradcar/vradcar.github.io"
        }
        // Add more fallback projects as needed
    ];

    const githubContainer = document.createElement('div');
    githubContainer.className = 'project-grid github-projects';
    
    fallbackProjects.forEach(repo => {
        const card = createGitHubProjectCard(repo);
        githubContainer.appendChild(card);
    });

    projectsContainer.parentElement.appendChild(githubContainer);
}






