const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");
const { validate } = require("../middleware/validator");

router.get("/", protect, authorize("users", "view"), getUsers);
router.get("/:id", protect, authorize("users", "view"), getUser);

router.post(
  "/",
  protect,
  authorize("users", "create"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validate,
  ],
  createUser
);

router.put("/:id", protect, authorize("users", "update"), updateUser);

router.delete("/:id", protect, authorize("users", "delete"), deleteUser);

module.exports = router;
