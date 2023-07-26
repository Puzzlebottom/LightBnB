SELECT p.id, p.title, p.cost_per_night, AVG(rating) as average_rating
FROM properties p
JOIN property_reviews ON (property_id = p.id)
WHERE city ILIKE '%vancouver%'
GROUP BY p.id
HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
