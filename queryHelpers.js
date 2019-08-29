const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

// get a list of players in a match
const getPlayersFromMatch = (matchId) => {
  return pool.query(`
  SELECT player1_id AS player1, player2_id AS player2
  FROM matches
  WHERE id = $1
  `, [matchId])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.error(err))
}

// get an existing user.id from the db
const getUserIdFromEmail = (email) => {
  return pool.query(`
  SELECT id
  FROM users
  WHERE email = $1;
  `, [email])
  .then(res => {
    return res;
  })
  .catch(err => console.error(err))
}

// add a new user to the db
const putUser = (email) => {
  return pool.query(`
  INSERT INTO users (email)
  VALUES ($1)
  RETURNING id;
  `, [email])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.error(err))
}

// get title id from the titleName
const getTitleId = (titleName) => {
  return pool.query(`
  SELECT id
  FROM titles
  WHERE name = $1;
  `, [titleName])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.error(err))
}

const createMatch = (player1Id, matchState, titleId) => {
  return pool.query(`
  INSERT INTO matches (player1_id, match_state, title_id) VALUES
  ($1, $2, $3)
  RETURNING id, match_state;
  `, [player1Id, matchState, titleId])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.error(err))
}

const writeMatchState = (matchState, matchId) => {
  return pool.query(`
  UPDATE matches
  SET match_state = $1
  WHERE id = $2
  RETURNING id, match_state;
  `, [matchState, matchId])
  .then(res => {
    return res.rows[0]
  })
  .catch(err => console.error(err))
}

const readMatchState = (matchId) => {
  return pool.query(`
  SELECT id, match_state
  FROM matches
  WHERE id = $1
  `, [matchId])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.error(err))
}

const getEmailandID = () => {
  return pool.query(`
  SELECT id, email
  FROM users
  `)
  .then(res => res.rows)
  .catch(err => console.error(err))
}

const getMatchIdsFromPlayerId = (playerId) => {
  return pool.query(`
  SELECT id
  FROM matches
  WHERE player1_id = $1 OR player2_id = $1
  `, [playerId])
  .then(res => res.rows)
  .catch(err => console.error(err))
}

const get1PlayerMatchStates = (userId) => {
  return pool.query(`
  SELECT id, match_state
  FROM matches
  WHERE player1_id <> $1 AND player2_id IS NULL;
  `, [userId])
  .then(res => {
    return res.rows;
  })
  .catch(err => console.error(err))
}

const writePlayer2 = (playerId, matchId) => {
  return pool.query(`
  UPDATE matches
  SET player2_id = $1
  WHERE id = $2
  RETURNING id
  `, [playerId, matchId])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => console.error(err))
}

const writeMatchOutcome = (matchId, winnerId, loserId) => {
  if (winnerId == null || loserId == null) {
    // capture falsy values
    return pool.query(`
    UPDATE matches
    SET match_winner_id = NULL,
        match_loser_id = NULL,
        match_is_draw = TRUE
    WHERE id = $1
    `, [matchId])
  } else {
    return pool.query(`
    UPDATE matches
    SET match_winner_id = $1,
        match_loser_id = $2,
        match_is_draw = FALSE
    WHERE id = $3
    `, [winnerId, loserId, matchId])
    .catch(err => console.error(err))
  }
}

module.exports = {
  getUserIdFromEmail,
  putUser,
  getTitleId,
  createMatch,
  writeMatchState,
  readMatchState,
  getEmailandID,
  getMatchIdsFromPlayerId,
  get1PlayerMatchStates,
  writePlayer2,
  writeMatchOutcome,
  getPlayersFromMatch
}
