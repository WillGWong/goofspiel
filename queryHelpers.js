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
  SELECT id, player1_id AS player1, player2_id AS player2
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

const getMatchDataByID = (user_id) => {
  return pool.query(`
  SELECT matches.id, titles.name AS Game_Type, a.email AS player_1, b.email AS player_2, match_state, match_winner_id
  FROM matches
  JOIN titles ON titles.id = matches.title_id
  LEFT JOIN users a ON matches.player1_id = a.id
  LEFT JOIN users b ON matches.player2_id = b.id
  WHERE player1_id = $1
  OR player2_id = $1;
  `, [user_id])
  .then(res => {
    return res.rows;
  })
}

const getScores = (matches) => {
  let resultArr = []
  for (let match of matches) {
    let matchData = []
    let score1 = match["match_state"]["player1"]["score"]
    let score2 = match["match_state"]["player2"]["score"]
    matchData.push(score1)
    matchData.push(score2)
    resultArr.push(matchData)
  }
  return resultArr
}

const getEmailById = (id) => {
  return pool.query(`
  SELECT email
  FROM users
  WHERE id = $1
  `, [id])
  .then(res => {
    return res["rows"][0]["email"];
  })
}

const getGameType = (matches) => {
  let resultArr = []
  for (let match of matches) {
    resultArr.push(match["game_type"])
  }
  return resultArr
}

const getPlayers = (matches) => {
  let resultArr = []
  for (let match of matches) {
    let matchData = []
    let player1 = match["player_1"]
    let player2 = match["player_2"]
    matchData.push(player1)
    matchData.push(player2)
    resultArr.push(matchData)
  }
  return resultArr
}

const getID = (matches) => {
  let resultArr = []
  for (let match of matches) {
    resultArr.push(match["id"])
  }
  return resultArr
}

const getWinner = (matches) => {
  let resultArr = []
  for (let match of matches) {
    if ( match["match_winner_id"] === null) {
      resultArr.push("TBD")
    } else {
      resultArr.push(match["match_winner_id"])
    }
  }
  return resultArr
}

const getLeaderboard = () => {
  return pool.query(`
  SELECT users.email, foo.wins, bar.losses
  FROM users
  JOIN (
    SELECT winner.email, count(winner.id) AS wins
    FROM matches
    JOIN users winner ON match_winner_id = winner.id
    GROUP BY winner.email
  ) AS foo ON users.email = foo.email
  JOIN (
    SELECT losers.email, count(losers.id) AS losses
    FROM matches
    JOIN users losers ON match_loser_id = losers.id
    GROUP BY losers.email
  ) AS bar ON users.email = bar.email
  GROUP BY users.email, foo.wins, bar.losses
  ORDER BY wins DESC
  `)
  .then(res => {
    return res.rows;
  })
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
  getPlayersFromMatch,
  getMatchDataByID,
  getScores,
  getEmailById,
  getGameType,
  getPlayers,
  getID,
  getWinner,
  getLeaderboard
}
