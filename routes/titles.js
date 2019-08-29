const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
router.use(cookieSession({
  name: 'session',
  keys: ["secret keys", "hello"],
  maxAge: 24 * 60 * 60 * 1000
}));

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
    templateVars = req.session
    } else {
    templateVars = { user_id: null }
    }
    res.render("titles_index", templateVars);
  });

  router.get("/1", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
    templateVars = req.session
    } else {
    templateVars = { user_id: null }
    }
    res.render("titles_show", templateVars);
  });

  router.get("/:title_id/matches", (req, res) => {
    res.render("matches_index")
  })

  router.get("/:title_id/matches/:match_id", (req, res) => {
    let templateVars = ""
    getMatchStateById(req.params.match_id)
    .then(matchData => {
      templateVars = {
        user_id: req.session.user_id? req.session.user_id : null,
        email: req.session.user_id? req.session.email : null,
        winner: matchData.match_winner_id? matchData.match_winner_id : null,
        loser: matchData.match_loser_id? matchData.match_loser_id : null,
        matchState : matchData[0]["match_state"],
        player: checkPlayerById(req.session.user_id, matchData[0]["match_state"])
      }
      console.log("hi", templateVars["matchState"]["player1"]["hand"])
      res.render("match_play", templateVars);
    })
  })

  return router;
};

const getMatchStateById = (match_id) => {
  return pool.query(`
  SELECT match_state, match_winner_id, match_loser_id
  FROM matches
  WHERE id = $1
  `, [match_id])
  .then(res => {
    return res.rows;
  })
}

const checkPlayerById = function (userId, matchData) {
  if (userId === matchData["player1"]["id"] || userId === matchData["player2"]["id"]) {
    return userId
  } else {
    return null
  }
}
