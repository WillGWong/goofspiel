/*
 * All routes for game actions are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
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
 const goofspiel = require('../goofspiel');
 const queryHelpers = require('../queryHelpers')

 module.exports = (db) => {

  // start a new game
  router.post("/titles/:title_id/matches/:match_id/newgame", (req, res) => {
    const titleId = req.params.title_id;
    goofspiel.initializeGame(req.session.user_id)
    .then(resolve => {
      const matchId = resolve.id;
      res.redirect(`/titles/${titleId}/matches/${matchId}`)
    })
    .catch(err => console.error(err.error));
  })

  // join a game as a challenger
  router.post("/titles/:title_id/join", (req, res) => {
    const titleId = req.params.title_id;
    const userId = req.session.user_id;
    return goofspiel.addChallenger(userId)
    .then(result => {
      if (result.length === 0) {
        console.error("NO MATCHES FOUND")
      } else {
        res.redirect(`/titles/${titleId}/matches/${result.id}`)
      }
    })
  })

  // make a bid player_bid
  router.post("/titles/:title_id/matches/:match_id/bid", (req, res) => {
    const titleId = req.params.title_id;
    const matchId = req.params.match_id;
    const userId = req.session.user_id;
    queryHelpers.getPlayersFromMatch(matchId)
    .then(resolve => {
      let playerNum = ''; // player1 or player2
      if (resolve.player1 === userId) {
        playerNum = 'player1'
      } else if (resolve.player2 === userId) {
        playerNum = 'player2'
      } else {
        console.error("NEITHER PLAYER FOUND");
      }
      goofspiel.bidCard(matchId, `${playerNum}`, req.body.player_bid);
      res.redirect(`/titles/${titleId}/matches/${matchId}`);
    })
    .then(resolve => {
      if (resolve.player1.bid != null && resolve.player2.bid != null) {
        goofspiel.resolveRound(resolve.id)
      }
    })
  })

  return router;
};
