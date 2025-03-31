console.log('JavaScript file loaded successfully');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    fetchGitHubProjects();
});

async function fetchGitHubProjects() {
    try {
        console.log('Fetching GitHub projects...');
        
        const username = 'vradcar';
        const apiUrl = `https://api.github.com/users/${username}/repos`;
        
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
        }
        
        const repos = await response.json();
        console.log('Fetched repos:', repos);

        // Modified filter criteria - less strict
        const filteredRepos = repos
            .filter(repo => !repo.fork) // Remove fork check if you want to show forked repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4);

        console.log('Filtered repos:', filteredRepos);

        if (filteredRepos.length === 0) {
            console.log('No repos match the criteria');
            return;
        }

        const projectsSection = document.getElementById('projects');
        if (!projectsSection) {
            console.error('Projects section not found');
            return;
        }

        // Clear existing GitHub projects if any
        const existingGithub = projectsSection.querySelector('.github-projects');
        if (existingGithub) {
            existingGithub.remove();
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
    
    // Handle case where repo might not have language or topics
    const techStack = [repo.language].filter(Boolean);
    if (repo.topics && repo.topics.length > 0) {
        techStack.push(...repo.topics);
    }

    card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available'}</p>
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





