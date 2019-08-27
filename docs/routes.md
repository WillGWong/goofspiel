# Requirements:
- the app can support multiple types of card games
- to start, just implement Goofspiel: https://en.wikipedia.org/wiki/Goofspiel
- player can create a new game of a certain type (and get randomly paired with another player)
- player can play a game against another player (one move at a time)
- player can have multiple active games going
- player can see in which of their games is their turn
- player can see players rankings per game type (by number of wins)
- player can see archive of games played by each player

# Routes

1. GET / - render index.ejs

2. GET /login - render login.ejs

3. POST /login - post to /login, redirect to /titles

4. GET /users - BROWSE list of users; render users_index.ejs

5. GET /users/:user_id - BROWSE archive of matches played by user_id and show active matches; render users_show.ejs

6. GET /titles - BROWSE list of titles showing player rankings for all titles; render titles_index.ejs

7. GET /titles/:title_id - go to “homepage” of specific title, showing player rankings for title_id; render titles_show.ejs

8. GET /titles/:title_id/matches - BROWSE list of ALL matches in database for specific game; render matches_index.ejs

9. GET /titles/:title_id/matches/:match_id - non-player can BROWSE list of moves played (watch) and player can play match match_id in progress; render matches_show.ejs for non-player, render matches_play.ejs for player

10. POST /titles/:title_id/matches/:match_id - ADD a move to a specific match (starting a new match, if necessary); post to /titles/:title_id/matches/:match_id; redirect to /titles/:title_id/matches/:match_id
