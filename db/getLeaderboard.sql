SELECT users.email, foo.wins, bar.losses
FROM users
JOIN (
  SELECT winner.email, count(winner.id) AS wins
  FROM matches
  JOIN users winner ON match_winner_id = winner.id
  GROUP BY winner.email
) AS foo ON users.email = foo.email
JOIN (
  SELECT losers.email, count(losers.id) AS losses
  FROM matches
  JOIN users losers ON match_loser_id = losers.id
  GROUP BY losers.email
) AS bar ON users.email = bar.email
GROUP BY users.email, foo.wins, bar.losses
ORDER BY wins DESC
;
