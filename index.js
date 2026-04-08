import { fetchTopAnime, searchAnimeByQuery, fetchGenres } from './fetch-anime.js';

// ================= STATE =================
let theme = 0; 
let allAnime = [];
let filteredAnime = [];
let selectedGenres = new Set();
let searchQuery = '';
let sortBy = '';

// ================= THEME TOGGLE =================

const toggleTheme = () => {
    theme ^= 1; // 0 -> 1, 1 -> 0
    document.body.classList.toggle('light', theme === 1);
    
    // Update theme button text if it exists
    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
        themeBtn.innerText = theme === 0 ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
};

// ================= CARD FUNCTION =================

const card = (anime) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.id = `anime-${anime.id}`;

    div.innerHTML = `
        <div class="poster-container">
            <img src="${anime.poster}" alt="${anime.name}" loading="lazy">
            <div class="rating-badge">${anime.rating || 'N/A'}</div>
        </div>
        <div class="card-info">
            <h3 title="${anime.name}">${anime.name}</h3>
            <p>Released: ${anime.release}</p>
            <div class="genres">
                ${anime.genres.slice(0, 3).map(g => `<span class="genre-tag">${g}</span>`).join('')}
            </div>
        </div>
    `;

    return div;
};

// ================= RENDER =================

const render = (data) => {
    const container = document.getElementById('TOP_Trending_animes');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<div class="loader">No anime found matching your criteria.</div>';
        return;
    }

    data.forEach(anime => {
        container.appendChild(card(anime));
    });
};

// ================= FILTERING & SORTING =================

const applyFilters = () => {

    let results = [...allAnime];

    if (searchQuery) {
        results = results.filter(anime => 
            anime.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (selectedGenres.size > 0) {
        results = results.filter(anime => 
            [...selectedGenres].every(selectedGenreName => 
                anime.genres.includes(selectedGenreName)
            )
        );
    }

    if (sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
        results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'release') {
        results.sort((a, b) => b.release - a.release);
    }

    render(results);
};

// ================= HANDLERS =================
const handleSearch = async (query) => {
    searchQuery = query;
    if (query.length > 2) {
        const container = document.getElementById('TOP_Trending_animes');
        container.innerHTML = '<div class="loader">Searching...</div>';
        allAnime = await searchAnimeByQuery(query);
    } else if (query.length === 0) {
        allAnime = await fetchTopAnime();
    }
    applyFilters();
};

const handleSort = (type) => {
    sortBy = type;
    applyFilters();
};

const handleGenreToggle = (genreName, btn) => {
    if (selectedGenres.has(genreName)) {
        selectedGenres.delete(genreName);
        btn.classList.remove('active');
    } else {
        selectedGenres.add(genreName);
        btn.classList.add('active');
    }
    applyFilters();
};

// ================= UI SETUP =================
const setupUI = async () => {
    const controls = document.getElementById('top-controls');
    
    // Theme Button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-btn';
    themeBtn.innerText = '🌙 Dark Mode';
    themeBtn.onclick = toggleTheme;

    // Search Input
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Search your anime...';
    search.oninput = (e) => handleSearch(e.target.value.trim());

    // Sort Dropdown
    const sort = document.createElement('select');
    sort.innerHTML = `
        <option value="">Sort by</option>
        <option value="rating">Top Rated</option>
        <option value="name">Alphabetical</option>
        <option value="release">Newest</option>
    `;
    sort.onchange = (e) => handleSort(e.target.value);

    controls.append(search, sort, themeBtn);

    // Genre Sidebar
    const genreButtons = document.getElementById('genre-buttons');
    const genres = await fetchGenres();
    
    // Popular genres to show first
    const popularNames = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Supernatural', 'Thriller'];
    
    genres.forEach(g => {
        const btn = document.createElement('button');
        btn.innerText = g.name;
        btn.onclick = () => handleGenreToggle(g.name, btn);
        genreButtons.appendChild(btn);
    });
};

// ================= INITIALIZATION =================
const init = async () => {
    // Initial fetch of trending anime
    allAnime = await fetchTopAnime();
    render(allAnime);
    
    // Setup UI components
    setupUI();
};

// Start the app
init();
