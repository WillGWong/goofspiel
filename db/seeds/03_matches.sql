INSERT INTO matches (
  player1_id,
  player2_id,
  title_id,
  match_winner_id,
  match_loser_id,
  match_is_draw,
  match_state
) VALUES
(2, 1, 1, 2, 1, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}'),
(2, 3, 1, 2, 3, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}'),
(2, 3, 1, 2, 3, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}'),
(3, 2, 1, 3, 2, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}'),
(3, 1, 1, 3, 1, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}'),
(1, 2, 1, 1, 2, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}'),
(2, 1, 1, 2, 1, FALSE, '{"prize":{"hand":[],"faceUp":null},"player1":{"id":1,"bid":null,"hand":[],"score":4},"player2":{"id":2,"bid":null,"hand":[],"score":0}}')
