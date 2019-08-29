SELECT matches.id, titles.name AS Game_Type, a.email AS player_1, b.email AS player_2, match_state
FROM matches
JOIn titles ON titles.id = matches.title_id
JOIN users a ON matches.player1_id = a.id
JOIN users b ON matches.player2_id = b.id
WHERE player1_id = 1
OR player2_id = 1
ORDER BY matches.id;
