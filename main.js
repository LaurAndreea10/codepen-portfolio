const libraryItems = [
  { title: "ClientFlow", desc: "Board SaaS / CRM pentru triere operațională, prioritizare vizuală și decizii rapide pe același ecran.", cats: ["utility", "crm", "saas", "ui"], href: "projects/clientflow.html", type: "Case study" },
  { title: "Alpis Impact Path", desc: "Wizard de onboarding în pași mici, cu progres vizibil și CTA-uri contextuale.", cats: ["ui", "challenge"], href: "projects/alpis-impactpath.html", type: "Case study" },
  { title: "Brief Studio", desc: "Dashboard bilingv pentru brief-uri și comunicare client, gândit ca demo SaaS / CRM.", cats: ["github", "crm", "saas", "ui"], href: "https://laurandreea10.github.io/brief-studio/index.html", type: "Live demo" },
  { title: "ClientOps", desc: "Demo front-end pentru operațiuni client, workflow-uri clare și organizare vizuală într-o interfață de tip dashboard.", cats: ["github", "crm", "saas", "ui"], href: "https://laurandreea10.github.io/clientops/", type: "Live demo" },
  { title: "Alpis Fusion CRM Premium", desc: "Workspace unificat pentru lead-uri, task-uri și billing într-un singur dashboard.", cats: ["github", "crm", "saas", "ui"], href: "https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/", type: "Live demo" },
  { title: "Excel-Quest", desc: "Produs educațional gamificat pentru învățarea Excel.", cats: ["github", "utility"], href: "https://laurandreea10.github.io/Excel-Quest/", type: "Live demo" }
];

const libraryGrid = document.getElementById('libraryGrid');
const searchInput = document.getElementById('searchInput');
const chips = Array.from(document.querySelectorAll('#filterChips .chip'));
const resultsCount = document.getElementById('resultsCount');
const themeToggle = document.getElementById('themeToggle');
let activeFilter = 'all';

function cardTemplate(item) {
  const target = item.href.startsWith('http') ? '_blank' : '_self';
  return `
    <article class="project-card glass" data-category="${item.cats.join(' ')}">
      <div class="project-top">
        <div><h3>${item.title}</h3></div>
        <span class="tag">${item.type}</span>
      </div>
      <p class="project-desc">${item.desc}</p>
      <div class="project-meta-row">${item.cats.map(cat => `<span class="project-meta-tag">${cat}</span>`).join('')}</div>
      <div class="card-actions">
        <a class="btn btn-primary" href="${item.href}" target="${target}" rel="noopener noreferrer">Deschide</a>
      </div>
    </article>`;
}

function renderLibrary() {
  const q = (searchInput.value || '').trim().toLowerCase();
  const filtered = libraryItems.filter(item => {
    const byFilter = activeFilter === 'all' || item.cats.includes(activeFilter);
    const hay = `${item.title} ${item.desc} ${item.cats.join(' ')}`.toLowerCase();
    const bySearch = !q || hay.includes(q);
    return byFilter && bySearch;
  });
  libraryGrid.innerHTML = filtered.map(cardTemplate).join('');
  resultsCount.textContent = String(filtered.length);
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter;
    chips.forEach(c => {
      const isActive = c === chip;
      c.classList.toggle('active', isActive);
      c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    renderLibrary();
  });
});

searchInput.addEventListener('input', renderLibrary);
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '☀️ Light' : '🌙 Dark';
});

renderLibrary();
