const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validator");

router.get("/", protect, authorize("orders", "view"), getOrders);
router.get("/:id", protect, authorize("orders", "view"), getOrder);

router.post(
  "/",
  protect,
  authorize("orders", "create"),
  [
    body("clientId").notEmpty().withMessage("Client is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("paymentMethods")
      .isArray({ min: 1 })
      .withMessage("At least one payment method is required"),
    validate,
  ],
  createOrder
);

router.put("/:id", protect, authorize("orders", "update"), updateOrder);
router.delete("/:id", protect, authorize("orders", "delete"), deleteOrder);

module.exports = router;
