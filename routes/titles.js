const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const queryHelpers = require('../queryHelpers');

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
    let templateVars = "";
    if (req.session.user_id) {
    templateVars = req.session;
    } else {
    templateVars = { user_id: null };
    }
    res.render("titles_index", templateVars);
  });

  // show a list of game titles
  router.get("/:title_id", (req, res) => {
    let templateVars = "";
    if (req.session.user_id) {
      templateVars = req.session;
      queryHelpers.getLeaderboard()
      .then(leaderboard => {
        templateVars.leaderboard = leaderboard;
        return res.render("titles_show", templateVars);
      })
    } else {
      templateVars = {
        user_id: null,
      };
      res.render("titles_show", templateVars);
    }
  });


  // show a specific match
  router.get("/:title_id/matches/:match_id", (req, res) => {
    let templateVars = ""
    return getMatchStateById(req.params.match_id)
    .then(matchData => {
      const matchState = matchData[0].match_state;
      templateVars = {
        user_id: req.session.user_id? req.session.user_id : null,
        user_email: req.session.user_email? req.session.user_email : null,
        winner: matchData[0].winner? matchData[0].winner : null,
        loser: matchData[0].loser? matchData[0].loser : null,
        matchState : matchData[0]["match_state"],
        player: checkPlayerById(req.session.user_id, matchData[0]["match_state"])
      }
      if (matchState.prize.hand.length === 0 && matchState.player1.hand.length === 0 && matchState.player2.hand.length === 0) {
        return res.render("match_end", templateVars)
      } else {
        return res.render("match_play", templateVars);
      }
    })
  })




  return router;
};

const getMatchStateById = (match_id) => {
  return pool.query(`
  SELECT match_state, match_winner_id, match_loser_id, winner.email AS winner, loser.email AS loser
  FROM matches
  FULL OUTER JOIN users winner ON match_winner_id = winner.id
  FULL OUTER JOIN users loser ON match_loser_id = loser.id
  WHERE matches.id = $1;
  `, [match_id])
  .then(res => {
    return res.rows;
  })
}

const checkPlayerById = function (userId, matchData) {
  if (userId === matchData["player1"]["id"]) {
    return 1;
  } else if (userId === matchData["player2"]["id"]) {
    return 2;
  } else {
    return null;
  }
}
