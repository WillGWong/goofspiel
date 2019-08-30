SELECT users.email, COALESCE(foo.wins, 0) AS wins, COALESCE(bar.losses, 0) AS losses
FROM users
FULL OUTER JOIN (
  SELECT winner.email, count(winner.id) AS wins
  FROM matches
  JOIN users winner ON match_winner_id = winner.id
  GROUP BY winner.email
) AS foo ON users.email = foo.email
FULL OUTER JOIN (
  SELECT losers.email, count(losers.id) AS losses
  FROM matches
  JOIN users losers ON match_loser_id = losers.id
  GROUP BY losers.email
) AS bar ON users.email = bar.email
GROUP BY users.email, foo.wins, bar.losses
ORDER BY wins DESC
;
