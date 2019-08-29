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

const { getEmailandID, getMatchDataByID, getScores, getEmailById, getGameType, getPlayers, getID, getWinner } = require('../queryHelpers');

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
    let useremail = ""
    let scoreArr = []
    let playeremail = ""
    let titleArr =[]
    let playerArr = []
    let idArr = []
    let winnerArr =[]
    if (req.session.user_id) {
      userinfo = req.session.user_id
      useremail = req.session.email
    } else {
      userinfo = null
    }
    getMatchDataByID(req.params.user_id)
    .then(res => {
      scoreArr = getScores(res)
      titleArr = getGameType(res)
      playerArr = getPlayers(res)
      idArr = getID(res)
      winnerArr = getWinner(res)
    })
    getEmailById(req.params.user_id)
    .then(email => {
      playeremail = email
      let templateVars = { scores: scoreArr, user_id: userinfo, email: useremail, displayemail: playeremail, titles: titleArr, players: playerArr,
        matchIds: idArr, winners: winnerArr }
      res.render(`users_show`, templateVars)
    })
  })



  return router;
};

