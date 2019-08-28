INSERT INTO matches (
  player1_id,
  player2_id,
  title_id,
  match_winner_id,
  match_loser_id,
  match_is_draw,
  game_state
) VALUES (
  1, 2, 1, null, null, FALSE, '{"player1":{"id":1,"bid":5,"hand":[1,2,3,6,7],"score":4},"player2":{"id":2,"bid":4,"hand":[1,3,5,6,7],"score":0},"prize":{"hand":[1,2,3,5,7],"faceUp":6}}');
