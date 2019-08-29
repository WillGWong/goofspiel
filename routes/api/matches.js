/*
 * All routes for Matches are defined here
 * Since this file is loaded in server.js into api/matches,
 *   these routes are mounted onto /matches
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM matches`;
    console.log(query);
    db.query(query)
      .then(data => {
        const matches = data.rows;
        res.json({ matches });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:match_id", (req, res) => {
    let query = `
    SELECT * FROM matches
    WHERE id = $1
    `;
    console.log(query);
    db.query(query, [req.params.match_id])
      .then(data => {
        const matches = data.rows;
        res.json({ matches });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
