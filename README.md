Lighthouse Labs Midterm Project
=========

# Goofspiel

by @willgwong and @sockbot

## Tech stack

### Back end
- Node
- Express/ejs
- Postgres
- cookie-session

### Front end
- jQuery
- SASS
- Ajax

## Dependencies

1. Node.js
2. npm

## Getting started

1. Clone repo
2. Run `npm install` to install dependencies
3. Run `npm run local` to start server
4. Connect to `http://localhost:8080` in your browser to join server

## How to play goofspiel

2 player game

The objective of the game is to accumulate the most value in prizes by strategically bidding on them.

Each player has 7 tokens valued from 1 to 7 respectively. Each round, the players use one of their tokens to make a secret bid on a randomly chosen prize, each valued from 1 to 7 and shown to all players. After each player has made their secret bid, the bids are revealed with the highest value token winning the prize and the tokens used to bid discarded. No one wins the prize if the bids are tied.

The game continues with the next round revealing another randomly chosen prize from the remaining prize pool until there are no more tokens (or prizes) left.

The winner is the player with the highest value of prizes won.

## Screenshots

