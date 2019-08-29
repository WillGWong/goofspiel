const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const goofspiel = require('../goofspiel');
const queryHelpers = require('../queryHelpers')

router.use(cookieSession({
  name: 'session',
  keys: ["secret keys", "hello"],
  maxAge: 24 * 60 * 60 * 1000
}));

module.exports = (db) => {
  router.get("/", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
    templateVars = req.session
    } else {
    templateVars = { user_id: null }
    }
    res.render("titles_index", templateVars);
  });

  // show a list of game titles
  router.get("/:title_id", (req, res) => {
    let templateVars = ""
    if (req.session.user_id) {
      templateVars = req.session
    } else {
      templateVars = { user_id: null }
    }
    res.render("titles_show", templateVars);
  });

  // show a list of active matches
  router.get("/:title_id/matches", (req, res) => {
    res.render("matches_index")
  })

  // start a new game
  router.post("/:title_id/matches/", (req, res) => {
    const titleId = req.params.title_id;
    goofspiel.initializeGame(req.session.user_id)
    .then(resolve => {
      console.log(resolve);
      const matchId = resolve.id;
      res.redirect(`/${titleId}/matches/${matchId}`)
    })
    .catch(err => console.error(err));
  })

  // show a specific match
  router.get("/:title_id/matches/:match_id", (req, res) => {
    if (req.session.user_id) {
      res.render("matches_play");
    } else {
      res.render("matches_show");
    }
  })

  // join a game as a challenger
  router.post("/:title_id/matches/join", (req, res) => {
    const titleId = req.params.title_id;
    const userId = req.session.user_id;
    return goofspiel.addChallenger(userId)
    .then(result => {
      if (result.length === 0) {
        console.error("NO MATCHES FOUND")
      } else {
        res.redirect(`/${titleId}/matches/${result.id}`)
      }
    })
  })

  // make a bid
  router.post("/:title_id/matches/:match_id/bid", (req, res) => {
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
      res.redirect(`/${titleId}/matches/${matchId}`);
    })
  })

  return router;
};
