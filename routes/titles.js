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

  // show a list of game titles
  router.get("/:title_id", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
      templateVars = req.session
    } else {
      templateVars = { user_id: null }
    }
    console.log(templateVars);
    res.render("titles_show", templateVars);
  });

  // show a list of active matches
  router.get("/:title_id/matches", (req, res) => {
    let templateVars = {
      user_id: req.session.user_id? req.session.user_id : null,
      email: req.session.user_id? req.session.email : null
    }
    res.render("matches_index", templateVars)
  })

  // show a specific match
  router.get("/:title_id/matches/:match_id", (req, res) => {
    let templateVars = ""
    getMatchStateById(req.params.match_id)
    .then(matchData => {
      console.log(matchData[0].match_state)
      templateVars = {
        user_id: req.session.user_id? req.session.user_id : null,
        email: req.session.user_id? req.session.email : null,
        winner: matchData.match_winner_id? matchData.match_winner_id : null,
        loser: matchData.match_loser_id? matchData.match_loser_id : null,
        matchState : matchData[0]["match_state"],
        player: checkPlayerById(req.session.user_id, matchData[0]["match_state"])
      }
      if (matchData[0].match_state.prize.hand.length !== 0) {
        res.render("match_play", templateVars);
      } else {
        res.render("match_end", templateVars)
      }
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
  if (userId === matchData["player1"]["id"]) {
    return 1
  } else if (userId === matchData["player2"]["id"]) {
    return 2
  } else {
    return null
  }
}
