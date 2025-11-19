const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

router.get('/', protect, authorize('products', 'view'), getProducts);
router.get('/:id', protect, authorize('products', 'view'), getProduct);

router.post(
  '/',
  protect,
  authorize('products', 'create'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
    validate
  ],
  createProduct
);

router.put('/:id', protect, authorize('products', 'update'), updateProduct);
router.delete('/:id', protect, authorize('products', 'delete'), deleteProduct);

module.exports = router;
