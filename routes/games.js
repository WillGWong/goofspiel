const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("games_index")
  });

  router.get("/goofspiel", (req, res) => {
    res.render("games_show")
  });


  return router;
};
