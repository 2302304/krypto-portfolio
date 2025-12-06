const { body } = require('express-validator');

// Transaction validation rules
const transactionValidation = [
  body('cryptoSymbol')
    .trim()
    .notEmpty()
    .withMessage('Kryptovaluutta symboli vaaditaan')
    .isLength({ min: 1, max: 20 })
    .withMessage('Symboli tulee olla 1-20 merkkiä'),
  
  body('cryptoName')
    .trim()
    .notEmpty()
    .withMessage('Kryptovaluutta nimi vaaditaan')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nimi tulee olla 1-100 merkkiä'),
  
  body('amount')
    .notEmpty()
    .withMessage('Määrä vaaditaan')
    .isFloat({ min: 0.00000001 })
    .withMessage('Määrän tulee olla positiivinen numero'),
  
  body('priceEur')
    .notEmpty()
    .withMessage('Hinta vaaditaan')
    .isFloat({ min: 0.01 })
    .withMessage('Hinnan tulee olla positiivinen numero'),
  
  body('transactionType')
    .notEmpty()
    .withMessage('Transaktiotyyppi vaaditaan')
    .isIn(['buy', 'sell'])
    .withMessage('Transaktiotyypin tulee olla "buy" tai "sell"'),
  
  body('transactionDate')
    .notEmpty()
    .withMessage('Päivämäärä vaaditaan')
    .isISO8601()
    .withMessage('Virheellinen päivämäärä')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date > now) {
        throw new Error('Päivämäärä ei voi olla tulevaisuudessa');
      }
      return true;
    }),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Huomautukset eivät voi olla yli 500 merkkiä')
];

module.exports = {
  transactionValidation
};
