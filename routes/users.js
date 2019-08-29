/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

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

const { getEmailandID, getMatchDataByID } = require('../queryHelpers');

module.exports = (db) => {
  router.get("/", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
      getEmailandID()
      .then(result => {
        templateVars = { users: result, user_id: req.session.user_id, email: req.session.email}
        res.render("users_index", templateVars);
      })
    } else {
      getEmailandID()
      .then(result => {
        templateVars = { users: result, user_id: null, email: null}
        res.render("users_index", templateVars);
      })
    }

  });


  router.get("/:user_id", (req, res) => {
    let userinfo = ""
    let scoreArr = []
    let useremail = ""
    let titleArr =[]
    let playerArr = []
    let idArr = []
    if (req.session.user_id) {
      userinfo = req.session.user_id
    } else {
      userinfo = null
    }
    getMatchDataByID(req.params.user_id)
    .then(res => {
      scoreArr = getScores(res)
      titleArr = getGameType(res)
      playerArr = getPlayers(res)
      idArr = getID(res)
    })
    getEmailById(req.params.user_id)
    .then(email => {
      useremail = email
      let templateVars = { scores: scoreArr, user_id: userinfo, displayemail: useremail, titles: titleArr, players: playerArr, matchIds: idArr }
      res.render(`users_show`, templateVars)
    })
  })



  return router;
};

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
