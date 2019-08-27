const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
router.use(cookieSession({
  name: 'session',
  keys: ["secret keys", "hello"],
  maxAge: 24 * 60 * 60 * 1000
}));

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("titles_index")
  });

  router.get("/:title_id", (req, res) => {
    res.render("titles_show")
  });

  router.get("/:title_id/matches", (req, res) => {
    res.render("matches_index")
  })

  router.get("/:title_id/matches/:match_id", (req, res) => {
    if (req.session.user_id) {
      res.render("matches_play");
    } else {
      res.render("matches_show");
    }
  })

  return router;
};
