console.log('JavaScript file loaded successfully');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    fetchGitHubProjects();
});

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




