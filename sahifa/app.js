// Default anime data
const defaultAnimes = [
    {
        id: 1,
        name: "Attack on Titan",
        genre: "action",
        year: 2013,
        image: "https://images.unsplash.com/photo-1578926314433-e46ab3419ed0?w=400&h=500&fit=crop",
        description: "Titanlar devligi, insoniyat turli taraflari qo'riqlangan. Bu anime juda qiziqarli va dramali. Asosiy qahramonlar omon bo'lish uchun juda hard jihnga tushadilar.",
        rating: 9,
        watchLink: "https://www.youtube.com/results?search_query=Attack+on+Titan",
        telegramLink: "https://t.me/anime_dunyosi",
        viewCount: 0
    },
    {
        id: 2,
        name: "Death Note",
        genre: "drama",
        year: 2006,
        image: "https://images.unsplash.com/photo-1609902544443-4ea5dc5c0555?w=400&h=500&fit=crop",
        description: "Yosh shogird o'limning defterini topadi va u defterga yozilgan odamlar o'ladi. Shuning ortida qidirish boshlanadi.",
        rating: 9,
        watchLink: "https://www.youtube.com/results?search_query=Death+Note",
        telegramLink: "https://t.me/anime_dunyosi",
        viewCount: 0
    },
    {
        id: 3,
        name: "One Punch Man",
        genre: "action",
        year: 2015,
        image: "https://images.unsplash.com/photo-1598516311209-942541e4c0aa?w=400&h=500&fit=crop",
        description: "Kuchli qahramonning qiziq sayohatları. U har bir sharikkasini bitta zarbada g'alaba beradi.",
        rating: 8,
        watchLink: "https://www.youtube.com/results?search_query=One+Punch+Man",
        telegramLink: "https://t.me/anime_dunyosi",
        viewCount: 0
    },
    {
        id: 4,
        name: "Steins;Gate",
        genre: "drama",
        year: 2011,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=500&fit=crop",
        description: "Vaqt sayohati va o'zgarish. Yosh ilmiy Okabe Rintaro vaqtni o'zgartirish imkoniyatiga ega bo'ladi.",
        rating: 9,
        watchLink: "https://www.youtube.com/results?search_query=Steins+Gate",
        telegramLink: "https://t.me/anime_dunyosi",
        viewCount: 0
    }
];

// Default genres
const defaultGenres = [
    { id: 'all', label: 'Barchasi' },
    { id: 'action', label: 'Aksion' },
    { id: 'drama', label: 'Drama' },
    { id: 'comedy', label: 'Komediya' },
    { id: 'favorites', label: '⭐ Sevimlilar' }
];

// Default admins
const defaultAdmins = [
    { id: 1, name: "Admin", password: "admin123" }
];

// State
let animes = JSON.parse(localStorage.getItem('animes')) || defaultAnimes;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentFilter = 'all';
let isAdmin = localStorage.getItem('isAdmin') === 'true';
let admins = JSON.parse(localStorage.getItem('admins')) || defaultAdmins;
let currentAdminId = localStorage.getItem('currentAdminId');
let genres = JSON.parse(localStorage.getItem('genres')) || defaultGenres;

// DOM Elements
const animeGrid = document.getElementById('animeGrid');
const addAnimeBtn = document.getElementById('addAnimeBtn');
const addModal = document.getElementById('addModal');
const detailModal = document.getElementById('detailModal');
const addAnimeForm = document.getElementById('addAnimeForm');
const searchInput = document.getElementById('searchInput');
const navBtns = document.querySelectorAll('.nav-btn');
const closeButtons = document.querySelectorAll('.close');
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const exportBtn = document.getElementById('exportBtn');
const genreListEl = document.getElementById('genreList');
const addGenreBtn = document.getElementById('addGenreBtn');
const newGenreName = document.getElementById('newGenreName');
const genreNav = document.getElementById('genreNav');
const topWatchedEl = document.getElementById('topWatched');

// Event Listeners
addAnimeBtn.addEventListener('click', () => addModal.style.display = 'block');

closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target == addModal) addModal.style.display = 'none';
    if (e.target == detailModal) detailModal.style.display = 'none';
    if (e.target == loginModal) loginModal.style.display = 'none';
});

addAnimeForm.addEventListener('submit', addNewAnime);

searchInput.addEventListener('input', filterAnimes);

if (exportBtn) exportBtn.addEventListener('click', exportJSON);

navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        navBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        filterAnimes();
    });
});

// Admin Login
adminBtn.addEventListener('click', () => {
    if (isAdmin) {
        isAdmin = false;
        currentAdminId = null;
        localStorage.setItem('isAdmin', 'false');
        localStorage.removeItem('currentAdminId');
        updateAdminUI();
        alert('👋 Chiqib ketdingiz');
    } else {
        renderAdminList();
        loginModal.style.display = 'block';
    }
});

function renderAdminList() {
    const adminList = document.getElementById('adminList');
    adminList.innerHTML = '';
    
    admins.forEach(admin => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        if (admin.id == currentAdminId) item.classList.add('active');
        
        item.innerHTML = `
            <span style="flex: 1; cursor: pointer;" onclick="selectAdmin(${admin.id}, '${admin.password}')">
                👤 ${admin.name}
            </span>
            <button class="admin-item-delete" onclick="deleteAdmin(${admin.id})" title="O'chirish">🗑️</button>
        `;
        adminList.appendChild(item);
    });
}

// Genres: render nav and admin list
function saveGenres() {
    localStorage.setItem('genres', JSON.stringify(genres));
}

function renderGenres() {
    if (!genreNav) return;
    genreNav.innerHTML = '';
    genres.forEach(g => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn' + (g.id === currentFilter ? ' active' : '');
        btn.dataset.filter = g.id;
        btn.textContent = g.label;
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = g.id;
            filterAnimes();
        });
        genreNav.appendChild(btn);
    });
}

function renderGenreListAdmin() {
    if (!genreListEl) return;
    genreListEl.innerHTML = '';
    genres.forEach(g => {
        if (g.id === 'all' || g.id === 'favorites') return; // don't delete defaults
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `<span style="flex:1">${g.label}</span><button class="admin-item-delete">🗑️</button>`;
        const del = div.querySelector('.admin-item-delete');
        del.addEventListener('click', () => {
            if (!confirm('Janrni o\'chirmoqchimisiz?')) return;
            genres = genres.filter(x => x.id !== g.id);
            saveGenres();
            renderGenres();
            renderGenreListAdmin();
        });
        genreListEl.appendChild(div);
    });
}

if (addGenreBtn) addGenreBtn.addEventListener('click', () => {
    const name = newGenreName.value.trim();
    if (!name) { alert('Janr nomini kiriting'); return; }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (genres.find(g => g.id === id)) { alert('Bu janr mavjud'); return; }
    genres.push({ id, label: name });
    saveGenres();
    newGenreName.value = '';
    renderGenres();
    renderGenreListAdmin();
});

function selectAdmin(adminId, password) {
    currentAdminId = adminId;
    isAdmin = true;
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('currentAdminId', adminId);
    loginModal.style.display = 'none';
    updateAdminUI();
    alert('✅ Xush kelibsiz, Admin!');
}

function deleteAdmin(adminId) {
    if (admins.length === 1) {
        alert('❌ Hech bo\'lmaganda bitta admin bo\'lishi kerak!');
        return;
    }
    if (confirm('Ushbu adminni o\'chirib tashlamoqchimisiz?')) {
        admins = admins.filter(a => a.id !== adminId);
        if (currentAdminId == adminId) {
            isAdmin = false;
            currentAdminId = null;
            localStorage.setItem('isAdmin', 'false');
            localStorage.removeItem('currentAdminId');
            updateAdminUI();
        }
        saveData();
        renderAdminList();
        alert('✅ Admin o\'chirildi');
    }
}

const toggleAdminFormBtn = document.getElementById('toggleAdminFormBtn');
const newAdminForm = document.getElementById('newAdminForm');
const addAdminBtn = document.getElementById('addAdminBtn');

toggleAdminFormBtn.addEventListener('click', () => {
    newAdminForm.style.display = newAdminForm.style.display === 'none' ? 'block' : 'none';
});

addAdminBtn.addEventListener('click', () => {
    const name = document.getElementById('newAdminName').value.trim();
    const password = document.getElementById('newAdminPassword').value.trim();
    
    if (!name || !password) {
        alert('❌ Barcha maydonlarni to\'ldiring!');
        return;
    }
    
    const newAdmin = {
        id: Math.max(...admins.map(a => a.id), 0) + 1,
        name: name,
        password: password
    };
    
    admins.push(newAdmin);
    saveData();
    document.getElementById('newAdminName').value = '';
    document.getElementById('newAdminPassword').value = '';
    renderAdminList();
    alert('✅ Yangi admin qo\'shildi!');
});

// Functions
function renderAnimes() {
    animeGrid.innerHTML = '';

    let filtered = animes;

    // Filter by search
    const search = searchInput.value.toLowerCase();
    if (search) {
        filtered = filtered.filter(anime => 
            anime.name.toLowerCase().includes(search)
        );
    }

    // Filter by category
    if (currentFilter === 'favorites') {
        filtered = filtered.filter(anime => favorites.includes(anime.id));
    } else if (currentFilter !== 'all') {
        filtered = filtered.filter(anime => anime.genre === currentFilter);
    }

    if (filtered.length === 0) {
        animeGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h3>😔 Hech qanday anime topilmadi</h3>
                <p>Boshqa qidiruv yoki kategoriya tanlang</p>
            </div>
        `;
        return;
    }

    filtered.forEach(anime => {
        const card = createAnimeCard(anime);
        animeGrid.appendChild(card);
    });
}

function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'anime-card';
    const isFavorite = favorites.includes(anime.id);

    card.innerHTML = `
        <img src="${anime.image}" alt="${anime.name}" class="anime-image">
        <div class="anime-info">
            <div class="anime-title">${anime.name}</div>
            <span class="anime-genre">${getGenreLabel(anime.genre)}</span>
            <div class="anime-year">📅 ${anime.year}</div>
            <div class="anime-rating">⭐ ${anime.rating}/10</div>
            <div class="anime-actions">
                <button class="anime-btn view-btn" onclick="showDetail(${anime.id})">Ko'rish</button>
                <button class="anime-btn favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${anime.id})" title="Sevimlilar">♥</button>
                ${isAdmin ? `<button class="anime-btn delete-btn" onclick="deleteAnime(${anime.id})" title="O'chirish">🗑️</button>` : ''}
            </div>
        </div>
    `;

    return card;
}

function getGenreLabel(genre) {
    const labels = {
        action: 'Aksion',
        drama: 'Drama',
        comedy: 'Komediya',
        romance: 'Romantika',
        fantasy: 'Fantastika',
        other: 'Boshqa'
    };
    return labels[genre] || genre;
}

function addNewAnime(e) {
    e.preventDefault();

    const newAnime = {
        id: Math.max(...animes.map(a => a.id), 0) + 1,
        name: document.getElementById('animeName').value,
        genre: document.getElementById('animeGenre').value,
        year: parseInt(document.getElementById('animeYear').value) || new Date().getFullYear(),
        image: document.getElementById('animeImage').value || 'https://via.placeholder.com/250x300?text=No+Image',
        description: document.getElementById('animeDescription').value || 'Tavsif yo\'q',
        rating: parseInt(document.getElementById('animeRating').value) || 5,
        watchLink: document.getElementById('animeLink').value || '#',
        telegramLink: document.getElementById('telegramLink').value || 'https://t.me/anime_dunyosi',
        viewCount: 0
    };

    animes.push(newAnime);
    saveData();
    addAnimeForm.reset();
    addModal.style.display = 'none';
    renderAnimes();

    // Show success message
    alert('✅ Anime muvaffaqiyatli qo\'shildi!');
}

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }
    saveData();
    renderAnimes();
}

function deleteAnime(id) {
    if (!isAdmin) { alert('❌ Faqat admin o\'chirishi mumkin'); return; }
    if (confirm('Haqiqatdan o\'chirib tashlamoqchimisiz?')) {
        animes = animes.filter(anime => anime.id !== id);
        favorites = favorites.filter(fav => fav !== id);
        saveData();
        renderAnimes();
        alert('✅ Anime o\'chirildi!');
    }
}

function showDetail(id) {
    const anime = animes.find(a => a.id === id);
    if (!anime) return;

    const isFavorite = favorites.includes(anime.id);
    const detailContent = document.getElementById('detailContent');

    detailContent.innerHTML = `
        <div>
            <img src="${anime.image}" alt="${anime.name}">
        </div>
        <div class="detail-info">
            <h2>${anime.name}</h2>
            <p><strong>Janr:</strong> ${getGenreLabel(anime.genre)}</p>
            <p><strong>Yil:</strong> ${anime.year}</p>
            <div class="detail-rating">⭐ Reyting: ${anime.rating}/10</div>
            <p><strong>Tavsifi:</strong></p>
            <p>${anime.description}</p>
            <button class="detail-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${anime.id})">
                ${isFavorite ? '♥ Sevimlilardan O\'chirish' : '♡ Sevimlilariga Qo\'shish'}
            </button>
            <button class="detail-btn" onclick="watchAndOpen(${anime.id})">🎬 Tomosha Qilish</button>
            <a href="${anime.telegramLink}" target="_blank" class="detail-btn" style="background: linear-gradient(135deg, #0ea5e9, #06b6d4);">📱 Telegram Kanalga O'tish</a>
        </div>
    `;

    detailModal.style.display = 'block';
}

function watchAndOpen(id) {
    const anime = animes.find(a => a.id === id);
    if (!anime) return;
    anime.viewCount = (anime.viewCount || 0) + 1;
    saveData();
    renderTopWatched();
    window.open(anime.watchLink || '#', '_blank');
}

// Top watched
function renderTopWatched() {
    if (!topWatchedEl) return;
    const top = [...animes].sort((a,b) => (b.viewCount||0) - (a.viewCount||0)).slice(0,6);
    topWatchedEl.innerHTML = '';
    top.forEach(a => {
        const d = document.createElement('div');
        d.className = 'anime-card';
        d.style.display = 'inline-block';
        d.style.width = '180px';
        d.style.marginRight = '12px';
        d.innerHTML = `
            <img src="${a.image}" alt="${a.name}" style="width:100%;height:110px;object-fit:cover;border-bottom:1px solid #334155;">
            <div style="padding:8px; color:#e2e8f0;">
                <div style="font-weight:700; font-size:0.95rem;">${a.name}</div>
                <div style="font-size:0.85rem;color:#94a3b8;">⭐ ${a.viewCount||0}</div>
            </div>
        `;
        d.addEventListener('click', () => showDetail(a.id));
        topWatchedEl.appendChild(d);
    });
}

// Export JSON for GitHub/upload
function exportJSON() {
    const data = { animes, admins, genres };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kiwei_data.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function filterAnimes() {
    renderAnimes();
}

function saveData() {
    localStorage.setItem('animes', JSON.stringify(animes));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('admins', JSON.stringify(admins));
    localStorage.setItem('genres', JSON.stringify(genres));
}

function updateAdminUI() {
    if (isAdmin) {
        addAnimeBtn.style.display = 'block';
        adminBtn.textContent = '🚪 Chiqish';
        adminBtn.style.background = '#ff6b6b';
        adminBtn.style.borderColor = '#ff6b6b';
    } else {
        addAnimeBtn.style.display = 'none';
        adminBtn.textContent = '🔐 Admin';
        adminBtn.style.background = 'rgba(255, 215, 0, 0.2)';
        adminBtn.style.borderColor = '#ffd700';
    }
    // re-render cards so admin-only controls update
    renderAnimes();
}

// Initial render
updateAdminUI();
renderGenres();
renderGenreListAdmin();
renderAnimes();
renderTopWatched();
