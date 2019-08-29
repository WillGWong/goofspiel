DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS titles CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE titles (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  min_players SMALLINT NOT NULL,
  max_players SMALLINT NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY NOT NULL,
  player1_id INTEGER REFERENCES users(id) NOT NULL,
  player2_id INTEGER REFERENCES users(id),
  title_id INTEGER REFERENCES titles(id) NOT NULL,
  match_winner_id INTEGER REFERENCES users(id),
  match_loser_id INTEGER REFERENCES users(id),
  match_is_draw BOOLEAN DEFAULT FALSE,
  match_state JSONB
);
INSERT INTO titles (
  name,
  description,
  min_players,
  max_players,
  thumbnail_url
)
VALUES
(
  'Goofspiel',
  'The objective of the game is to accumulate the most value in prizes by strategically bidding on them. Each player has 13 tokens valued from 1 to 13 respectively. Each round, the players use one of their tokens to make a secret bid on a randomly chosen prize, each valued from 1 to 13 and shown to all players. After each player has made their secret bid, the bids are revealed with the highest value token winning the prize and the tokens used to bid discarded. No one wins the prize if the bids are tied. The game continues with the next round revealing another randomly chosen prize from the remaining prize pool until there are no more tokens (or prizes) left. The winner is the player with the highest cumulative value of prizes won.',
  2,
  2,
  'http://fillmurray.com/200/200'
),
(
  'Coup',
  'You are head of a family in an Italian city-state, a city run by a weak and corrupt court. You need to manipulate, bluff and bribe your way to power. Your object is to destroy the influence of all the other families, forcing them into exile. Only one family will survive... In Coup, you want to be the last player with influence in the game, with influence being represented by face-down character cards in your playing area.',
  2,
  6,
  'http://fillmurray.com/200/200'
)
;

INSERT INTO users (email) VALUES
('willeyw@gmail.com'),
('sockbot@sockbot.com'),
('asdf@asdf.com')
;
INSERT INTO matches (
  player1_id,
  player2_id,
  title_id,
  match_winner_id,
  match_loser_id,
  match_is_draw,
  match_state
) VALUES
(1, 2, 1, NULL, NULL, FALSE, '{"prize":{"hand":[1,2,3,5,7],"faceUp":6},"player1":{"id":1,"bid":5,"hand":[1,2,3,6,7],"score":4},"player2":{"id":2,"bid":4,"hand":[1,3,5,6,7],"score":0}}')
