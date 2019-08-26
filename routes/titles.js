/*
 * All routes for titles are defined here
 * Since this file is loaded in server.js into api/titles,
 *   these routes are mounted onto /titles
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM titles`;
    console.log(query);
    db.query(query)
      .then(data => {
        const titles = data.rows;
        res.json({ titles });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
