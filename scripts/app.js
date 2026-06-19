// --- Data ---
const projects = [
    {
        title: "BeatFrame",
        description: "A 'Letterboxd for Music' social platform. Discover, rate, and review albums with Spotify integration, unique rating systems, and a dark-mode premium UI.",
        tech: ["React", "Vite", "Tailwind", "Supabase"],
        link: "https://beat-frame.vercel.app",
        featured: false
    },
    {
        title: "Sage",
        description: "A fully functional, GPT-style transformer built entirely from scratch in PyTorch. No wrappers, no pretrained weights—just pure end-to-end training and fine-tuning.",
        tech: ["PyTorch", "Transformers", "Machine Learning", "Python"],
        link: "#",
        status: "Releasing Soon ⏳",
        progressLink: "sage-progress.html",
        featured: true
    }
];

// --- DOM Elements ---
const projectsContainer = document.getElementById('projects-container');
const currentYearSpan = document.getElementById('current-year');

// --- Render Functions ---
function renderProjects() {
    if (!projectsContainer) return;
    projectsContainer.innerHTML = '';
    projects.forEach((project, index) => {
        const delay = index * 0.1;
        
        const card = document.createElement('div');
        card.className = project.featured ? 'project-card featured fade-in' : 'project-card fade-in';
        card.style.transitionDelay = `${delay}s`;
        
        const techTags = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        
        card.innerHTML = `
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links" style="display: flex; gap: 20px; align-items: center;">
                ${project.status ? `<span style="color: var(--accent-3); font-weight: 600; font-size: 0.9rem;">${project.status}</span>` : `<a href="${project.link}" target="_blank">View Project <span style="color: var(--accent-1);">&rarr;</span></a>`}
                ${project.progressLink ? `<a href="${project.progressLink}" style="color: var(--accent-1); font-weight: 600;">Track Progress &rarr;</a>` : ''}
            </div>
        `;
        
        projectsContainer.appendChild(card);
    });
}

// --- Tab Logic ---
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked
            btn.classList.add('active');
            const targetEl = document.getElementById(target);
            if (targetEl) {
                targetEl.classList.add('active');
                
                // Force appear for any fade-in elements inside the newly active tab
                // because IntersectionObserver sometimes misses display:none -> display:block transitions
                setTimeout(() => {
                    targetEl.querySelectorAll('.fade-in').forEach(el => {
                        el.classList.add('appear');
                    });
                }, 50);
            }
        });
    });
}

// --- Semester Select Logic ---
function initSemesterSelect() {
    const select = document.getElementById('semester-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
        const selectedSem = e.target.value;
        
        // Hide all semester contents
        for (let i = 1; i <= 6; i++) {
            const el = document.getElementById(`sem${i}-content`);
            if (el) el.style.display = 'none';
        }
        
        // Show the selected one
        const targetEl = document.getElementById(`sem${selectedSem}-content`);
        if (targetEl) targetEl.style.display = 'block';
    });
}

// --- Initialization ---
function init() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    renderProjects();
    initTabs();
    initSemesterSelect();
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// --- Removed Coding Profile API fetching in favor of highly stable static layout ---

document.addEventListener('DOMContentLoaded', init);
