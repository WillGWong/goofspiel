const {
  getUserIdFromEmail,
  putUser,
  getTitleId,
  createMatch,
  writeMatchState,
  readMatchState,
  getMatchIdsFromPlayerId,
  get1PlayerMatchStates,
  writePlayer2
} = require('./queryHelpers')
const CARDS_PER_HAND = 7;
const TITLE_ID = 1;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const initializeGame = (player1Id) => {
  let matchState = {
    player1: {
      id: player1Id,
      bid: null,
      hand: [],
      score: 0,
    },
    player2: {
      id: null,
      bid: null,
      hand: [],
      score: 0,
    },
    prize: {
      hand: [],
      faceUp: null,
    }
  }
  return createMatch(player1Id, matchState, TITLE_ID)
  .then(res => {
    return writeMatchState(dealCards(res.match_state), res.id)
  })
  .then(res => {
    return writeMatchState(drawPrizeCard(res.match_state), res.id);
  })
}

const addChallenger = (player2Id) => {
  return get1PlayerMatchStates()
  .then(res => {
    console.log(res.length);
    if (res.length === 0) {
      return console.error("no empty matches")
    } else {
      // console.log("query results", res.length);
      const index = getRandomInt(res.length);
      const matchId = res[index].id;
      const matchState = res[index].match_state;
      matchState.player2.id = player2Id;
      // console.log("id", matchId)
      // console.log('state', matchState)
      return writeMatchState(matchState, matchId)
    }
  })
  .then(res => {
    // console.log(res);
    return writePlayer2(res.match_state.player2.id, res.id);
  })
}

const dealCards = (matchState) => {
  const hand = [];
  for (let i = 1; i <= CARDS_PER_HAND; i++) {
    hand.push(i)
  }
  matchState.player1.hand = hand;
  matchState.player2.hand = hand;
  matchState.prize.hand = hand;
  return matchState;
}

const drawPrizeCard = (matchState) => {
  const index = getRandomInt(matchState.prize.hand.length);
  const drawnCard = matchState.prize.hand.splice(index, 1)[0];
  matchState.prize.faceUp = drawnCard;
  return matchState;
}

const bidCard = (matchId, playerNum, cardValue) => {
  return readMatchState(matchId)
  .then(res => {
    let matchState = Object.assign({}, res.match_state);
    let playerMatchState = matchState[playerNum];

    const cardIndex = playerMatchState.hand.findIndex(element => {
      return element == cardValue;
    });

    if (cardIndex === -1) {
      console.log("cardValue not found in hand")
      return;
    } else {
      playerMatchState.bid = playerMatchState.hand.splice(cardIndex, 1)[0]
      writeMatchState(matchState, res.id)
    }
    // write to db
    // console.log(playerMatchState)
  })
}

// bidCard(8, 'player2', 3);
// initializeGame(1);
// addChallenger(2);
