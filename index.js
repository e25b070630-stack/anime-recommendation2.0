// extract.js - Simple extraction of anime data

// Import the fetch function
import { fetchTopAnime } from './fetch-anime.js';

// Simple extraction
const extract = async () => {
    console.log('Extracting anime data...');
    
    // Get the data array
    const animeArray = await fetchTopAnime(300);
    
    console.log(`✅ Extracted ${animeArray.length} anime entries`);
    console.log('\nFirst 3 entries:');
    console.log(animeArray.slice(0, 3));
    
    // Return the array
    return animeArray;
};

// Run it
extract().then(data => {
    console.log('\n📊 Final array:', data);
});