// No records currently, so the graph is a blank slate
const sageProgressRecords = [];

// Reusable function to render everything
function renderProgress() {
    renderGraph();
    renderTimeline();
}

function renderGraph() {
    const container = document.getElementById('contribution-graph');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing
    
    // Compute logs mapping
    const sageActivityLogs = {};
    sageProgressRecords.forEach(record => {
        if (sageActivityLogs[record.date]) {
            sageActivityLogs[record.date].level = Math.min(4, sageActivityLogs[record.date].level + 1);
            sageActivityLogs[record.date].log += " | " + record.title;
        } else {
            sageActivityLogs[record.date] = { level: 2, log: record.title }; 
        }
    });

    const targetStartDate = new Date("2026-07-01T12:00:00");
    const startDayOfWeek = targetStartDate.getDay();
    const actualStartDate = new Date(targetStartDate);
    actualStartDate.setDate(actualStartDate.getDate() - startDayOfWeek);

    const totalCells = 52 * 7;
    
    for (let i = 0; i < totalCells; i++) {
        const d = new Date(actualStartDate);
        d.setDate(d.getDate() + i);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const cell = document.createElement('div');
        cell.className = 'contribution-cell';
        cell.title = dateStr;
        
        if (sageActivityLogs[dateStr]) {
            const level = sageActivityLogs[dateStr].level;
            cell.classList.add(`level-${level}`);
            cell.title = `${dateStr}: ${sageActivityLogs[dateStr].log}`;
        }
        
        container.appendChild(cell);
    }
}

function renderTimeline() {
    const container = document.getElementById('sage-timeline-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing
    
    // Sort records by date descending (newest first)
    const sortedRecords = [...sageProgressRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedRecords.forEach((record, index) => {
        const item = document.createElement('div');
        const positionClass = index % 2 === 0 ? 'left' : 'right';
        // We use .appear right away since they are dynamically added, or we can trigger observer if we wanted.
        // For simplicity with dynamic addition, just show them immediately.
        item.className = `timeline-item ${positionClass} fade-in appear`; 
        
        item.innerHTML = `
            <div class="timeline-content glass-panel">
                <span class="timeline-date">${record.date}</span>
                <h3 class="timeline-title">${record.title}</h3>
                <p class="timeline-desc">${record.description}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    renderProgress();
    
    // Setup Modal
    const modal = document.getElementById('log-modal');
    const openBtn = document.getElementById('open-log-btn');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('log-form');
    
    if (openBtn) openBtn.onclick = () => modal.classList.add('active');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    
    window.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
    };
    
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const date = document.getElementById('log-date').value;
            const title = document.getElementById('log-title').value;
            const desc = document.getElementById('log-desc').value;
            
            sageProgressRecords.push({ date, title, description: desc });
            localStorage.setItem('sageProgress', JSON.stringify(sageProgressRecords));
            
            renderProgress();
            
            form.reset();
            modal.classList.remove('active');
        };
    }
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }, 100);
});
