SELECT match_state, match_winner_id, match_loser_id, winner.email AS winner, loser.email AS loser
FROM matches
JOIN users winner ON match_winner_id = winner.id
JOIN users loser ON match_loser_id = loser.id
WHERE matches.id = 2
