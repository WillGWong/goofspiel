/*
 * All routes for login are defined here
 * Since this file is loaded in server.js into /login,
 *   these routes are mounted onto /login
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
const { getUser, putUser, getTitleName } = require('./queryHelpers');

const loginUser = (user_email) => {
  return getUser(user_email)
  .then(res => {
    if (res.rows.length === 0) {
      return putUser(user_email);
    } else {
      // console.log("Logged in existing user:", res.rows[0])
      return res.rows[0];
    }
  })
}

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", (req, res) => {
    loginUser(req.body.email)
    .then(res => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!Logged in:", res.id)
      req.session.user_id  = res.id;
    });

    res.redirect("/")
  })

  return router;
};
