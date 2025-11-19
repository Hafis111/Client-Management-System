const { sequelize } = require("../config/database");
const User = require("./User");
const Client = require("./Client");
const Product = require("./Product");
const Order = require("./Order");
const Comment = require("./Comment");

// Define associations
User.hasMany(Client, { foreignKey: "createdBy", as: "clients" });
Client.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

User.hasMany(Product, { foreignKey: "createdBy", as: "products" });
Product.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

User.hasMany(Order, { foreignKey: "createdBy", as: "orders" });
Order.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Client.hasMany(Order, { foreignKey: "clientId", as: "orders" });
Order.belongsTo(Client, { foreignKey: "clientId", as: "client" });

User.hasMany(Comment, { foreignKey: "createdBy", as: "comments" });
Comment.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

module.exports = {
  sequelize,
  User,
  Client,
  Product,
  Order,
  Comment,
};
