// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
//const morgan     = require('morgan');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ["secret keys", "hello"],
  maxAge: 24 * 60 * 60 * 1000
}));
const goofspiel  = require('./goofspiel');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
//app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: false,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const apiUsersRoutes = require("./routes/api/users");
const apiTitlesRoutes = require("./routes/api/titles");
const apiMatchesRoutes = require("./routes/api/matches");
const loginRoutes = require("./routes/login");
const usersRoutes = require("./routes/users");
const titlesRoutes = require("./routes/titles");
const logoutRoutes = require("./routes/logout");
const gameActionsRoutes = require("./routes/game_actions");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", apiUsersRoutes(db));
app.use("/api/titles", apiTitlesRoutes(db));
app.use("/api/matches", apiMatchesRoutes(db));
app.use("/login", loginRoutes(db));
app.use("/users", usersRoutes(db));
app.use("/titles", titlesRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/", gameActionsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  if (req.session.user_id) {
    let templateVars = req.session
    res.render("index", templateVars)
  } else {
    let templateVars = { user_id: null }
    res.render("index", templateVars)
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
