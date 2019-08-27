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

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

const loginUser = (user_email) => {
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1;
  `, [user_email])
  .then(res => {
    if (res.rows.length === 0) {
      return pool.query(`
      INSERT INTO users (email)
      VALUES ($1)
      RETURNING *;
      `, [user_email])
      .then(res => {
        // console.log("Inserted and logged in new user:", res.rows[0]);
        return res.rows[0];
      });
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
