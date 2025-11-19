const { Comment, User } = require('../models');

// @desc    Get all comments
// @route   GET /api/comments
// @access  Private (requires 'view' permission for 'comments')
exports.getComments = async (req, res) => {
  try {
    const { relatedTo, relatedId } = req.query;
    
    const whereClause = {};
    if (relatedTo) whereClause.relatedTo = relatedTo;
    if (relatedId) whereClause.relatedId = relatedId;

    const comments = await Comment.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Private (requires 'view' permission for 'comments')
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private (requires 'create' permission for 'comments')
exports.createComment = async (req, res) => {
  try {
    const { content, relatedTo, relatedId } = req.body;

    const comment = await Comment.create({
      content,
      relatedTo,
      relatedId: relatedId || null,
      createdBy: req.user.id
    });

    // Fetch the complete comment with creator info
    const commentWithCreator = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: commentWithCreator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (requires 'update' permission for 'comments')
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const { content } = req.body;

    if (content !== undefined) {
      await comment.update({ content });
    }

    // Fetch updated comment with creator info
    const updatedComment = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (requires 'delete' permission for 'comments')
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await comment.destroy();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
