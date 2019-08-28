const {
  getUser,
  putUser,
  getTitleId,
  createMatch,
  writeMatchState,
  readMatchState
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

const addChallenger = (matchState, player2Id) => {
  matchState.player2.id = player2Id;
  return matchState;
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
  console.log("In drawPrizeCard:", matchState);
  return matchState;
}

const bidCard = (matchState, playerNum, cardValue) => {
}

initializeGame(1);
// readMatchState(10)
// .then(res => {
//   addChallenger(res.match_state, 2);
// })
// not working ^^^^
