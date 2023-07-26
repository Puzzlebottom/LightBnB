INSERT INTO users(name, email, password)
VALUES ('Bingo', 'bingo@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bongo', 'bongo@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bango', 'bango@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'clown manor', 'an elegant cottage', 'www.picture.com', 'www.anotherpicture.com', 20, 3, 47, 1, 'Mozambique', 'Fake St. W', 'Townville', 'Eastern Bit', 'H0H 0H0', TRUE),
(2, 'clown manor', 'an elegant cottage', 'www.picture.com', 'www.anotherpicture.com', 20, 3, 47, 1, 'Mozambique', 'Fake St. W', 'Townville', 'Eastern Bit', 'H0H 0H0', TRUE),
(3, 'clown manor', 'an elegant cottage', 'www.picture.com', 'www.anotherpicture.com', 20, 3, 47, 1, 'Mozambique', 'Fake St. W', 'Townville', 'Eastern Bit', 'H0H 0H0', TRUE);

INSERT INTO reservations(start_date, end_date, property_id, guest_id)
VALUES ('2023-08-05', '2023-08-07', 1, 3),
('2023-08-05', '2023-08-07', 2, 1),
('2023-08-05', '2023-08-07', 3, 2);

INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 10, 'what an elegant cottage!'),
(1, 2, 2, 10, 'what an elegant cottage!'),
(2, 3, 3, 10, 'what an elegant cottage!');