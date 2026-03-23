# Anime Next Watch Generator 🎬

A web application for anime enthusiasts who can't decide what to watch next. This app fetches trending anime and allows users to filter by genre, sort by ratings, and read detailed synopses.

## Features

- **Trending Anime List**: Displays the top 25 most popular anime
- **Genre Filtering**: Filter anime by multiple genres (Action, Drama, Fantasy, etc.)
- **Top Rated Sorting**: Sort anime by their ratings
- **Expandable Synopsis**: Click to reveal detailed plot summaries
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API**: [Jikan Anime API](https://docs.api.jikan.moe) - Free, no authentication required
- **Hosting**: Can be deployed on GitHub Pages, Netlify, or Vercel

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/anime-recommendation2.0.git
cd anime-recommendation2.0
```

2. Open `index.html` in your browser:
```bash
open index.html
# or double-click the file
```

**No build process or npm installation required!**

## File Structure

```
anime-recommendation2.0/
├── index.html      # Main HTML structure
├── index.js        # JavaScript logic and API calls
├── style.css       # Styling (optional, referenced in HTML)
└── README.md       # Project documentation
```

## How to Use

1. **View Trending Anime**: The app loads the top 25 trending anime automatically
2. **Filter by Genre**: Select a genre from the dropdown menu to see related anime
3. **Sort by Rating**: Click "Top Rated" to sort by highest scores
4. **Read Synopsis**: Click "Show Synopsis" on any anime card to expand and read the plot summary

## API Reference

This project uses the **Jikan Anime API** v4:

- **Base URL**: `https://api.jikan.moe/v4`
- **Trending Endpoint**: `/top/anime?filter=bypopularity`
- **Genres Endpoint**: `/genres/anime`
- **Rate Limit**: 60 requests per minute (no API key needed)

[Full API Documentation](https://docs.api.jikan.moe)

## Future Enhancements

- [ ] Pagination for large anime lists
- [ ] User ratings and watchlist feature
- [ ] Search by anime title
- [ ] Season/Year filtering
- [ ] Dark mode toggle
- [ ] Local storage for favorite anime

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**Shashvat Singh**

## Acknowledgments

- [Jikan API](https://jikan.moe) - Free anime data API
- Anime community for inspiration

---

**Need help?** Check the [Jikan API Docs](https://docs.api.jikan.moe) or open an issue on GitHub!
