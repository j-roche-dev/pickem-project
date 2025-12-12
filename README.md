# Masters Tournament Pick'em Pool

A GitHub Pages site for tracking Masters Golf Tournament pick'em pool scores and posting updates.

## Features

- Real-time leaderboard showing participant standings
- Automatic score fetching from Masters.com API (with manual fallback)
- Blog section for tournament updates
- Mobile-responsive design
- Masters-themed styling

## Setup Instructions

### 1. Customize Your Data

#### Edit Participant Picks (`data/picks.json`):
- Add your pool participants and their golfer picks
- Update golfer IDs (you can find these from the Masters website or use placeholder values)

#### Add Updates (`data/updates.json`):
- Add your blog posts/updates about the tournament
- Updates are displayed in reverse chronological order

#### Manual Score Updates (`data/scores.json`):
- If the API isn't working, you can manually update scores here
- The site will automatically use this as a fallback

### 2. Deploy to GitHub Pages

#### Option A: Using GitHub Web Interface
1. Push this repository to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select the `main` branch
5. Click "Save"
6. Your site will be available at `https://[your-username].github.io/[repository-name]/`

#### Option B: Using GitHub CLI
```bash
# Make sure you're in the project directory
git add .
git commit -m "Initial Masters Pick'em site"
git branch -M main
git remote add origin https://github.com/[your-username]/[repository-name].git
git push -u origin main

# Enable GitHub Pages using gh CLI
gh repo edit --enable-pages --pages-branch main
```

### 3. Update During Tournament

To update scores or add blog posts during the tournament:

1. Edit the relevant JSON files (`data/picks.json`, `data/scores.json`, or `data/updates.json`)
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update tournament scores/posts"
   git push
   ```
3. GitHub Pages will automatically update (may take 1-2 minutes)

## File Structure

```
pickem-project/
├── index.html              # Main page
├── css/
│   └── style.css          # Styling
├── js/
│   ├── main.js            # Navigation and app logic
│   ├── leaderboard.js     # Leaderboard functionality
│   └── updates.js         # Blog updates
├── data/
│   ├── picks.json         # Participant picks
│   ├── scores.json        # Score data (manual fallback)
│   └── updates.json       # Blog posts
└── README.md
```

## Updating Picks and Scores

### Adding Participants
Edit `data/picks.json` and add new participant objects:

```json
{
  "id": 4,
  "name": "New Player",
  "picks": [
    { "golfer": "Tiger Woods", "golferId": "12345" }
  ]
}
```

### Adding Blog Updates
Edit `data/updates.json`:

```json
{
  "id": 3,
  "title": "Round 2 Update",
  "date": "2025-04-11",
  "content": "What an exciting second round! Here's what's happening..."
}
```

## API Integration

The site attempts to fetch live scores from the Masters.com API. If the API is unavailable (due to CORS, timing, or access restrictions), it automatically falls back to the manual `data/scores.json` file.

To manually update scores during the tournament, edit `data/scores.json` with current tournament data.

## Customization

- Colors: Edit CSS variables in `css/style.css`
- Scoring rules: Update in `data/picks.json`
- Auto-refresh interval: Change in `js/leaderboard.js` (default: 5 minutes)

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge).