const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/client.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

router.get('/', protect, authorize('clients', 'view'), getClients);
router.get('/:id', protect, authorize('clients', 'view'), getClient);

router.post(
  '/',
  protect,
  authorize('clients', 'create'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').notEmpty().withMessage('Phone is required'),
    validate
  ],
  createClient
);

router.put('/:id', protect, authorize('clients', 'update'), updateClient);
router.delete('/:id', protect, authorize('clients', 'delete'), deleteClient);

module.exports = router;
