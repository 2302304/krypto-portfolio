const { body } = require('express-validator');

// Register validation rules
const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Syötä kelvollinen sähköpostiosoite')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Salasanan tulee olla vähintään 6 merkkiä pitkä')
    .matches(/\d/)
    .withMessage('Salasanan tulee sisältää vähintään yksi numero')
    .matches(/[A-Z]/)
    .withMessage('Salasanan tulee sisältää vähintään yksi iso kirjain'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Salasanat eivät täsmää')
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Syötä kelvollinen sähköpostiosoite')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Salasana vaaditaan')
];

module.exports = {
  registerValidation,
  loginValidation
};
