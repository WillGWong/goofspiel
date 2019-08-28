const {
  getUser,
  putUser,
  getTitleId,
  createMatch,
  writeMatchState,
  readMatchState
} = require('./queryHelpers')
const CARDS_PER_HAND = 7;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const initializeGame = (player1Id) => {
  const matchState = {
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
  createMatch(player1Id, titleId);
  dealCards(matchState, player1Id);
  writeMatchState(matchState, matchId);
}

const dealCards = (matchState, playerId) => {
  const hand = [];
  for (const i = 1; i <= CARDS_PER_HAND; i++) {
    hand.push(i)
  }
  matchState.player1.hand = hand;
  matchState.player2.hand = hand;
  matchState.prize.hand = hand;
  return matchState;
}

const drawPrizeCard = (matchState) => {
  const index = getRandomInt(matchState.prize.hand.length);
  matchState.prize.faceUp = matchState.hand.splice(index, 1);
  return matchState;
}

const bidCard = (matchState, playerNum, cardValue) => {
}
