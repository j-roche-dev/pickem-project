# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static GitHub Pages site for tracking a Masters Golf Tournament pick'em pool. The site features a leaderboard showing participant standings and a blog section for tournament updates. It's designed to be deployed on GitHub Pages with no build process required.

## Architecture

### Data Flow
The application follows a simple client-side architecture:

1. **Data Sources**: Three JSON files in `data/` serve as the database
   - `picks.json`: Contains all participant picks (golfer selections by ID)
   - `scores.json`: Fallback score data (manually updated or used when API is unavailable)
   - `updates.json`: Blog posts/tournament updates

2. **Score Fetching Strategy**: The leaderboard attempts to fetch live scores from Masters.com API first, then falls back to `data/scores.json` if unavailable (see `leaderboard.js:28-43`)

3. **Score Calculation**: The `Leaderboard.calculateLeaderboard()` method (leaderboard.js:98-126) joins participant picks with golfer scores by matching `golferId` from picks.json with score keys in scores.json, then sums all golfer scores per participant

4. **Navigation**: Single-page app with hash-based routing handled by `App` class in main.js

### Module Structure
- `js/main.js`: App class handles navigation and section visibility
- `js/leaderboard.js`: Leaderboard class handles score fetching, calculation, and leaderboard rendering
- `js/updates.js`: Updates class handles blog post loading and display
- All three modules initialize independently on DOMContentLoaded

### Key Implementation Details
- **Golfer ID Mapping**: Participant picks reference golfers by ID (e.g., "46046" for Scottie Scheffler). These IDs must match keys in the scores object
- **Auto-refresh**: Leaderboard refreshes every 5 minutes (leaderboard.js:212-214)
- **Masters API Integration**: The `fetchFromMastersAPI()` method (leaderboard.js:45-71) attempts to fetch from `https://www.masters.com/en_US/scores/feeds/{year}/scores.json`. This will likely fail due to CORS, hence the fallback strategy
- **No Build Step**: Pure vanilla JavaScript with no transpilation or bundling

## Development Commands

### Local Development
```bash
# Serve locally (choose one method):
python -m http.server 8000
# OR
npx serve
# OR
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Deployment to GitHub Pages
```bash
# Update data files, then commit and push
git add data/
git commit -m "Update tournament scores/posts"
git push

# GitHub Pages auto-updates in 1-2 minutes
```

### Updating Tournament Data
Edit JSON files directly:
- `data/picks.json`: Add participants or modify picks
- `data/scores.json`: Update golfer scores manually
- `data/updates.json`: Add new blog posts

## Data Format Requirements

### Adding a Participant
In `data/picks.json`, add to the participants array:
```json
{
  "id": 4,
  "name": "Player Name",
  "picks": [
    { "golfer": "Tiger Woods", "golferId": "12345" }
  ]
}
```

### Adding Blog Updates
In `data/updates.json`, add to the updates array:
```json
{
  "id": 3,
  "title": "Round 2 Update",
  "date": "2025-04-11",
  "content": "Update text here. Use double newlines for paragraphs."
}
```

### Scoring Format
Scores in `data/scores.json` must use this structure:
```json
{
  "scores": {
    "golferId": {
      "name": "Golfer Name",
      "score": -5,
      "thru": "F",
      "position": "T1"
    }
  }
}
```

The `golferId` keys must exactly match the `golferId` values in picks.json.

## Customization

- **Colors/Styling**: Edit CSS variables at top of `css/style.css`
- **Auto-refresh interval**: Change the timeout value in leaderboard.js:212 (default: 300000ms = 5 minutes)
- **Scoring rules**: Currently sums all golfer scores. Modify `calculateLeaderboard()` in leaderboard.js:98 to change logic

## GitHub Pages Setup

This site is designed for GitHub Pages deployment. Enable via:
1. Repository Settings → Pages → Source: main branch
2. Site will be available at `https://[username].github.io/[repo-name]/`

No Jekyll configuration or build process needed - GitHub Pages serves static files directly.
