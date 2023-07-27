/* eslint-disable camelcase */
const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool
    .query('SELECT * FROM users WHERE email = $1', [email])
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
  return pool
    .query('SELECT * FROM users WHERE id = $1', [id])
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

  return pool
    .query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;', [name, email, password])
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

  return pool
    .query(queryString, values)
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

  return pool
    .query('SELECT * FROM properties LIMIT $1', [limit])
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
