const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide comment content' }
    }
  },
  relatedTo: {
    type: DataTypes.ENUM('client', 'order', 'product', 'general'),
    allowNull: false,
    field: 'related_to'
  },
  relatedId: {
    type: DataTypes.UUID,
    field: 'related_id'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'comments'
});

module.exports = Comment;
