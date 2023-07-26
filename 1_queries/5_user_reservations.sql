SELECT res.id, prop.title, res.start_date, prop.cost_per_night, AVG(rev.rating) AS average_rating
  FROM reservations AS res
  JOIN properties AS prop ON (prop.id = res.property_id)
  JOIN property_reviews AS rev ON (prop.id = rev.property_id)
 WHERE res.guest_id = 1
 GROUP BY prop.id, res.id
 ORDER BY res.start_date
 LIMIT 10;