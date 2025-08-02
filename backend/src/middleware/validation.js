const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Ma\'lumotlar noto\'g\'ri',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('To\'g\'ri email kiriting'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  body('name')
    .isLength({ min: 2 })
    .withMessage('Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  body('role')
    .optional()
    .isIn(['admin', 'merchant', 'blogger', 'customer'])
    .withMessage('Noto\'g\'ri rol'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('To\'g\'ri email kiriting'),
  body('password')
    .notEmpty()
    .withMessage('Parol kiritish majburiy'),
  handleValidationErrors
];

const validateProduct = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Mahsulot nomi kamida 3 ta belgidan iborat bo\'lishi kerak'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Narx musbat son bo\'lishi kerak'),
  body('category_id')
    .isInt()
    .withMessage('Kategoriya tanlash majburiy'),
  body('merchant_id')
    .isInt()
    .withMessage('Sotuvchi tanlash majburiy'),
  handleValidationErrors
];

const validateOrder = [
  body('customer_id')
    .isInt()
    .withMessage('Mijoz ID noto\'g\'ri'),
  body('merchant_id')
    .isInt()
    .withMessage('Sotuvchi ID noto\'g\'ri'),
  body('total_amount')
    .isFloat({ min: 0 })
    .withMessage('Jami summa musbat bo\'lishi kerak'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateProduct,
  validateOrder
}; 