/*
 * All routes for login are defined here
 * Since this file is loaded in server.js into /login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieSession({
  name: 'session',
  keys: ["secret keys", "hello"],
  maxAge: 24 * 60 * 60 * 1000
}));
const {
  getUserIdFromEmail,
  putUser,
  getTitleId,
  createMatch,
  writeMatchState,
  readMatchState,
  getEmailandID,
  getMatchIdsFromPlayerId,
  get1PlayerMatchStates,
  writePlayer2
 } = require('../queryHelpers');

const loginUser = (user_email) => {
  return getUserIdFromEmail(user_email)
  .then(res => {
    if (res.rows.length === 0) {
      return putUser(user_email);
    } else {
      return res.rows[0];
    }
  })
  .catch(err => console.error(err))
}

module.exports = (db) => {
  router.get("/", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
    templateVars = req.session
    } else {
    templateVars = { user_id: null }
    }
    res.render("login", templateVars);
  });

  router.post("/", (req, res) => {
    // console.log(req.body);
    loginUser(req.body.email)
    .then(result => {
      // console.log(result)
      req.session.user_id  = result.id;
      req.session.user_email  = req.body.email;
      res.redirect("/")
    })
    .catch(err => console.error(err));


  })

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  })


  return router;
};
