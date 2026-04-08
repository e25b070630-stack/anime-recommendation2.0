const BASE_URL = 'https://api.jikan.moe/v4';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transformAnime = (anime) => ({
    id: anime.mal_id,
    name: anime.title || anime.title_english || 'Unknown',
    rating: anime.score || 0,
    release: anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'N/A',
    poster: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
    genres: anime.genres?.map(g => g.name) || [],
    genreIds: anime.genres?.map(g => g.mal_id) || []
});

const isSafe = (anime) => {
    const forbidden = ['Hentai', 'Erotica'];
    return !anime.genres.some(g => forbidden.includes(g.name));
};

/**
 * Fetch top trending anime
 */
export const fetchTopAnime = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/top/anime?page=${page}&limit=24`);
        if (response.status === 429) {
            await delay(1000);
            return fetchTopAnime(page);
        }
        const data = await response.json();
        return data.data.filter(isSafe).map(transformAnime);
    } catch (error) {
        console.error('Error fetching top anime:', error);
        return [];
    }
};

/**
 * Search anime by query
 */
export const searchAnimeByQuery = async (query, page = 1) => {
    if (!query) return fetchTopAnime();
    try {
        const response = await fetch(`${BASE_URL}/anime?q=${query}&page=${page}&limit=24`);
        if (response.status === 429) {
            await delay(1000);
            return searchAnimeByQuery(query, page);
        }
        const data = await response.json();
        return data.data.filter(isSafe).map(transformAnime);
    } catch (error) {
        console.error('Error searching anime:', error);
        return [];
    }
};

/**
 * Fetch all available genres
 */
export const fetchGenres = async () => {
    try {
        const response = await fetch(`${BASE_URL}/genres/anime`);
        if (response.status === 429) {
            await delay(1000);
            return fetchGenres();
        }
        const data = await response.json();
        const forbidden = [
            'Hentai', 'Erotica', 'Boys Love', 'Girls Love', 
            'Adult Cast', 'Childcare', 'Crossdressing', 
            'Magical Sex Shift', 'Otaku Culture', 'Pets', 
            'Reverse Harem', 'Love Status Quo'
        ];
        return data.data
            .filter(g => !forbidden.includes(g.name))
            .map(g => ({ id: g.mal_id, name: g.name }));
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};
