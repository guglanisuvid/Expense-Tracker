const bcrypt = require("bcryptjs");

/**
 * Generates password hash from plain text
 * @param {string} text
 * @returns {string}
 */
const generatePasswordHash = (text) => {
  const salt = bcrypt.genSaltSync(Number(process.env.SALT));
  const hash = bcrypt.hashSync(text, salt);
  return hash;
};

/**
 * Matching Password Hash
 * @param {string} text
 * @param {string} hashedText
 * @returns {boolean}
 */
const matchHashedPassword = (text, hashedText) => {
  return bcrypt.compareSync(text, hashedText);
};

module.exports = {
  matchHashedPassword,
  generatePasswordHash,
};
