const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "client_id",
      references: {
        model: "clients",
        key: "id",
      },
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: { msg: "At least one item is required" },
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
      validate: {
        min: { args: [0], msg: "Total amount must be positive" },
      },
    },
    paymentMethods: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: "payment_methods",
      validate: {
        notEmpty: { msg: "At least one payment method is required" },
        validateTotal(value) {
          const paymentTotal = value.reduce(
            (sum, pm) => sum + parseFloat(pm.amount),
            0
          );
          const orderTotal = parseFloat(this.totalAmount);
          if (Math.abs(paymentTotal - orderTotal) > 0.01) {
            throw new Error("Payment methods total must equal order total");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
      defaultValue: "pending",
    },
    notes: {
      type: DataTypes.TEXT,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "created_by",
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "orders",
    hooks: {
      beforeValidate: async (order) => {
        if (!order.orderNumber) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000);
          order.orderNumber = `ORD-${timestamp}-${random}`;
        }
      },
    },
  }
);

module.exports = Order;
