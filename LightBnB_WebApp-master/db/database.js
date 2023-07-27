/* eslint-disable camelcase */
const { query, getClient } = require('./index.js');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return query('SELECT * FROM users WHERE email = $1', [email])
    .then((result) => {
      const resolvedUser = result.rows[0] ? result.rows[0] : null;
      return resolvedUser;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return query('SELECT * FROM users WHERE id = $1', [id])
    .then((result) => {
      const resolvedUser = result.rows[0] ? result.rows[0] : null;
      return resolvedUser;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const { name, email, password } = user;

  return query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;', [name, email, password])
    .then((user) => user)
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const queryString = `
  SELECT prop.*, AVG(rev.rating) AS average_rating
  FROM properties AS prop
  JOIN reservations AS res ON (prop.id = res.property_id)
  JOIN property_reviews AS rev ON (prop.id = rev.property_id)
 WHERE res.guest_id = $1
 GROUP BY prop.id, res.id
 ORDER BY res.start_date
 LIMIT $2;`;
  const values = [guest_id, limit];

  return query(queryString, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {

  const { city, owner_id, minimum_price_per_night = 0, maximum_price_per_night, minimum_rating } = options;

  let queryString = `
  SELECT prop.*, AVG(rev.rating) as average_rating
  FROM properties prop
  JOIN property_reviews rev ON (property_id = prop.id)
  `;
  const queryParams = [];

  if (city) {
    queryParams.push(`%${city}%`);
    queryString += `WHERE prop.city ILIKE $${queryParams.length} `;
  }

  if (owner_id) {
    const term = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(owner_id);
    queryString += `${term} prop.owner_id = $${queryParams.length} `;
  }

  queryParams.push(Number(minimum_price_per_night) * 100);
  queryString += `GROUP BY prop.id HAVING cost_per_night >= $${queryParams.length} `;

  if (maximum_price_per_night) {
    queryParams.push(maximum_price_per_night * 100);
    queryString += `AND prop.cost_per_night <= $${queryParams.length} `;
  }

  if (minimum_rating) {
    queryParams.push(Number(minimum_rating));
    queryString += `AND AVG(rev.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `ORDER BY prop.cost_per_night LIMIT $${queryParams.length}`;

  return query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const {
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  } = property;

  return query(`
    INSERT INTO properties(    
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`, [
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night * 100,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  ])
    .then((property) => property)
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
