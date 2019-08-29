const {
  getUserIdFromEmail,
  putUser,
  getTitleId,
  createMatch,
  writeMatchState,
  readMatchState,
  getEmailandID,
  getMatchIdsFromPlayerId,
  get1PlayerMatchStates,
  writePlayer2,
  writeMatchOutcome,
  getPlayersFromMatch
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
  .catch(err => console.error(err))
}

const addChallenger = (player2Id) => {
  return get1PlayerMatchStates(player2Id)
  .then(res => {
    if (res.length === 0) {
      console.error("NO AVAILABLE GAMES")
      return res;
    } else {
      const index = getRandomInt(res.length);
      const matchId = res[index].id;
      const matchState = res[index].match_state;
      matchState.player2.id = player2Id;
      return writeMatchState(matchState, matchId)
      .then(res => {
        return writePlayer2(res.match_state.player2.id, res.id);
      })
    }
  })
  .catch(err => console.error(err))
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

    if (matchState[playerNum].bid != null) {
      console.error("bid already entered")
      return;
    } else if (cardIndex === -1) {
      console.error("cardValue not found in hand")
      return;
    } else {
      playerMatchState.bid = playerMatchState.hand.splice(cardIndex, 1)[0]
      return writeMatchState(matchState, res.id)
    }
  })
  .catch(err => console.error(err))
}

const resolveRound = (matchId) => {
  return readMatchState(matchId)
  .then(res => {
    let matchState = Object.assign({}, res.match_state)
    let player1Bid = matchState.player1.bid;
    let player2Bid = matchState.player2.bid;
    let prize = matchState.prize.faceUp;
    const clearCards = () => {
      matchState.player1.bid = null;
      matchState.player2.bid = null;
      matchState.prize.faceUp = null;
    }
    if (player1Bid !== null && player2Bid !== null) {
      if (player1Bid > player2Bid) {
        matchState.player1.score += prize;
      } else if (player1Bid < player2Bid) {
        matchState.player2.score += prize;
      }
      clearCards();
      drawPrizeCard(matchState);
      return writeMatchState(matchState, res.id)
      .then(res => {
        if (res.match_state.prize.hand.length === 0) {
          return resolveMatch(res.id);
        }
      })
      .catch(err => console.error(err))
    }
  })
  .catch(err => console.error(err))
}

const resolveMatch = (matchId) => {
  readMatchState(matchId)
  .then(res => {
    let matchState = Object.assign({}, res.match_state);
    // console.log(matchState);
    const p1Score = res.match_state.player1.score;
    const p2Score = res.match_state.player2.score;
    if (p1Score === p2Score) {
      writeMatchOutcome(res.id, null, null);
    } else if (p1Score > p2Score) {
      writeMatchOutcome(res.id, res.match_state.player1.id, res.match_state.player2.id);
    } else {
      writeMatchOutcome(res.id, res.match_state.player2.id, res.match_state.player1.id);
    }
  })
}

module.exports = {
  getRandomInt,
  initializeGame,
  addChallenger,
  dealCards,
  drawPrizeCard,
  bidCard,
  resolveRound,
  resolveMatch
}

const runGame = async () => {
  // console.log('running game...')
  // await initializeGame(3);
  // const challengerReturn = await addChallenger(3);
  // console.log(challengerReturn);
  // await bidCard(6, 'player1', 1);
  // await bidCard(6, 'player2', 2);
  // await resolveRound(6);
  // await bidCard(6, 'player1', 3);
  // await bidCard(6, 'player2', 3);
  // await resolveRound(6);
  // await bidCard(6, 'player1', 5);
  // await bidCard(6, 'player2', 4);
  // await resolveRound(6);
  // await bidCard(6, 'player1', 7);
  // await bidCard(6, 'player2', 5);
  // await resolveRound(6);
  // await bidCard(6, 'player1', 6);
  // await bidCard(6, 'player2', 6);
  // await resolveRound(6);
  // await bidCard(6, 'player1', 4);
  // await bidCard(6, 'player2', 7);
  // await resolveRound(6);
  // await bidCard(6, 'player1', 2);
  // await bidCard(6, 'player2', 1);
  // await resolveRound(6);
  // await resolveMatch(6);
}
runGame();
