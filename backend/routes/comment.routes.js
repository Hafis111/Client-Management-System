const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/comment.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

router.get('/', protect, authorize('comments', 'view'), getComments);
router.get('/:id', protect, authorize('comments', 'view'), getComment);

router.post(
  '/',
  protect,
  authorize('comments', 'create'),
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('relatedTo').isIn(['client', 'order', 'product', 'general']).withMessage('Invalid relatedTo value'),
    validate
  ],
  createComment
);

router.put(
  '/:id',
  protect,
  authorize('comments', 'update'),
  [
    body('content').notEmpty().withMessage('Content is required'),
    validate
  ],
  updateComment
);

router.delete('/:id', protect, authorize('comments', 'delete'), deleteComment);

module.exports = router;
