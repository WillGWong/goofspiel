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
  game_state JSONB
);
