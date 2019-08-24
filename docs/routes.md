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

1. GET / - redirect to GET /login or serve dashboard

2. GET /login - render login page

3. POST /login - submit login info to server, redirect to /games

4. GET /users - BROWSE list of users

5. GET /users/:user_id - BROWSE archive of games played by user_id and show active games

6. GET /games - BROWSE list of games showing player rankings for all games

7. GET /games/:game_id - go to “homepage” of specific game, showing player rankings for game :id

8. GET /games/:game_id/matches - BROWSE list of ALL matches in database for specific game

9. GET /games/:game_id/matches/:match_id - non-player can BROWSE list of moves played (watch) and player can play game game_id in progress

10. POST /games/:game_id/matches/:match_id - ADD a move to a specific match (starting a new game, if necessary)
