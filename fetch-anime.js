const BASE_URL = 'https://api.jikan.moe/v4';
const TOTAL_ANIME_NEEDED = 300;
const PER_PAGE = 25;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

const extractGenres = (genresArray) => {
    if (!genresArray || !Array.isArray(genresArray)) return ['Unknown'];
    return genresArray.map(g => g.name);
};

const transformToFormat = (anime) => ({
    name: anime.title || anime.title_english || anime.title_japanese || 'Unknown',
    rating: anime.score ? parseFloat(anime.score.toFixed(2)) : null,
    release: anime.aired?.from ? formatDate(anime.aired.from.split('T')[0]) : 'Unknown',
    poster: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
    genre: extractGenres(anime.genres)
});

const fetchAnimePage = async (page, type = 'top') => {
    const url = `${BASE_URL}/${type}/anime?page=${page}&limit=${PER_PAGE}`;
    
    try {
        const response = await fetch(url);

        if (response.status === 429) {
            await delay(2000);
            return fetchAnimePage(page, type);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch {
        return [];
    }
};

const fetchTopAnime = async (totalNeeded = TOTAL_ANIME_NEEDED) => {
    const allAnime = [];
    let page = 1;
    let hasMore = true;
    
    while (allAnime.length < totalNeeded && hasMore) {
        const animeList = await fetchAnimePage(page, 'top');
        
        if (animeList.length === 0) {
            hasMore = false;
            break;
        }
        
        allAnime.push(...animeList.map(transformToFormat));
        await delay(1000);
        page++;
    }
    
    return allAnime;
};

const fetchPopularAnime = async (totalNeeded = TOTAL_ANIME_NEEDED) => {
    const allAnime = [];
    let page = 1;
    let hasMore = true;
    
    while (allAnime.length < totalNeeded && hasMore) {
        const animeList = await fetchAnimePage(page, 'popularity');
        
        if (animeList.length === 0) {
            hasMore = false;
            break;
        }
        
        allAnime.push(...animeList.map(transformToFormat));
        await delay(1000);
        page++;
    }
    
    return allAnime;
};

const fetchDiverseAnime = async () => {
    const allAnime = new Map();

    const categories = [
        { name: 'top', pages: 5 },
        { name: 'popularity', pages: 4 },
        { name: 'upcoming', pages: 2 },
        { name: 'airing', pages: 2 }
    ];
    
    for (const category of categories) {
        for (let page = 1; page <= category.pages; page++) {
            const animeList = await fetchAnimePage(page, category.name);
            
            animeList.forEach(anime => {
                const transformed = transformToFormat(anime);
                if (!allAnime.has(transformed.name)) {
                    allAnime.set(transformed.name, transformed);
                }
            });
            
            await delay(1000);
        }
    }
    
    return Array.from(allAnime.values())
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
};

const main = async () => {
    let animeData = await fetchTopAnime(300);
    
    if (animeData.length < 300) {
        const diverseAnime = await fetchDiverseAnime();
        const existingNames = new Set(animeData.map(a => a.name));
        const additionalAnime = diverseAnime.filter(a => !existingNames.has(a.name));
        animeData.push(...additionalAnime.slice(0, 300 - animeData.length));
    }
    
    const validData = animeData.filter(anime => 
        anime.name !== 'Unknown' && 
        anime.genre[0] !== 'Unknown'
    );
    
    return validData;
};

// Export
export { fetchTopAnime, fetchPopularAnime, fetchDiverseAnime, main };