/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("users_index");
  });

  router.get("/:user_id", (req, res) => {
    const userId = req.params.user_id;

    res.render("users_show");
  })
  return router;
};
