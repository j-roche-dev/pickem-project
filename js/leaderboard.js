// Leaderboard management
class Leaderboard {
    constructor() {
        this.picks = null;
        this.scores = null;
        this.leaderboardData = [];
    }

    async init() {
        try {
            await this.loadPicks();
            await this.loadScores();
            this.calculateLeaderboard();
            this.render();
        } catch (error) {
            console.error('Error initializing leaderboard:', error);
            this.showError('Failed to load leaderboard data');
        }
    }

    async loadPicks() {
        const response = await fetch('data/picks.json');
        if (!response.ok) throw new Error('Failed to load picks');
        this.picks = await response.json();
    }

    async loadScores() {
        // Try to fetch from Masters API first
        try {
            const apiScores = await this.fetchFromMastersAPI();
            if (apiScores) {
                this.scores = apiScores;
                return;
            }
        } catch (error) {
            console.log('Masters API not available, using fallback data');
        }

        // Fallback to local scores.json
        const response = await fetch('data/scores.json');
        if (!response.ok) throw new Error('Failed to load scores');
        this.scores = await response.json();
    }

    async fetchFromMastersAPI() {
        // Masters.com API endpoint (this may need adjustment based on actual API)
        // The Masters typically uses https://www.masters.com/en_US/scores/feeds/[year]/scores.json
        // However, this might not be accessible due to CORS or may require specific timing

        const year = new Date().getFullYear();
        const apiUrl = `https://www.masters.com/en_US/scores/feeds/${year}/scores.json`;

        try {
            const response = await fetch(apiUrl, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) return null;

            const data = await response.json();

            // Transform Masters API data to our format
            return this.transformMastersAPIData(data);
        } catch (error) {
            console.log('Could not fetch from Masters API:', error.message);
            return null;
        }
    }

    transformMastersAPIData(apiData) {
        // This function transforms the Masters API response to our format
        // Note: The actual API structure may vary - this is a best-guess implementation

        const transformed = {
            lastUpdated: new Date().toISOString(),
            tournamentStatus: apiData.tournament?.status || 'In Progress',
            currentRound: apiData.tournament?.round || 'Round 1',
            scores: {}
        };

        if (apiData.player) {
            apiData.player.forEach(player => {
                transformed.scores[player.id] = {
                    name: `${player.first_name} ${player.last_name}`,
                    score: parseInt(player.total_strokes) || 0,
                    thru: player.thru || 'F',
                    position: player.current_position || '-'
                };
            });
        }

        return transformed;
    }

    calculateLeaderboard() {
        this.leaderboardData = this.picks.participants.map(participant => {
            let totalScore = 0;
            const golferScores = [];

            participant.picks.forEach(pick => {
                const golferScore = this.scores.scores[pick.golferId];
                if (golferScore) {
                    golferScores.push({
                        name: golferScore.name,
                        score: golferScore.score,
                        position: golferScore.position,
                        thru: golferScore.thru
                    });
                    totalScore += golferScore.score;
                }
            });

            return {
                participant: participant.name,
                totalScore: totalScore,
                golfers: golferScores,
                picks: participant.picks
            };
        });

        // Sort by total score (lower is better in golf)
        this.leaderboardData.sort((a, b) => a.totalScore - b.totalScore);
    }

    render() {
        const container = document.getElementById('leaderboard-container');

        // Update tournament status
        document.getElementById('current-round').textContent = this.scores.currentRound || '-';
        document.getElementById('tournament-status').textContent = this.scores.tournamentStatus || '-';
        document.getElementById('last-update-time').textContent = this.formatDateTime(this.scores.lastUpdated);

        // Create leaderboard table
        const table = document.createElement('div');
        table.className = 'leaderboard-table';

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Golfers</th>
                        <th>Total Score</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.leaderboardData.forEach((entry, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'first' : (rank === 2 ? 'second' : (rank === 3 ? 'third' : ''));

            const golfersHtml = entry.golfers.map(g =>
                `${g.name} (${g.score > 0 ? '+' : ''}${g.score})`
            ).join(', ');

            html += `
                <tr>
                    <td><span class="rank ${rankClass}">${rank}</span></td>
                    <td>
                        <div class="player-name">${entry.participant}</div>
                        <div class="golfer-picks">${golfersHtml}</div>
                    </td>
                    <td>${entry.golfers.length} golfers</td>
                    <td><span class="score">${entry.totalScore > 0 ? '+' : ''}${entry.totalScore}</span></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        table.innerHTML = html;
        container.innerHTML = '';
        container.appendChild(table);
    }

    showError(message) {
        const container = document.getElementById('leaderboard-container');
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    formatDateTime(isoString) {
        if (!isoString) return 'Unknown';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    async refresh() {
        await this.init();
    }
}

// Initialize leaderboard
let leaderboard;
document.addEventListener('DOMContentLoaded', () => {
    leaderboard = new Leaderboard();
    leaderboard.init();

    // Auto-refresh every 5 minutes during tournament
    setInterval(() => {
        leaderboard.refresh();
    }, 5 * 60 * 1000);
});
