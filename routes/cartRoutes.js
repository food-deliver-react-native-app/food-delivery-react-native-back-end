const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

router.post("/add", authenticateToken, cartController.addToCart);
router.get("/get", authenticateToken, cartController.getCart);
router.delete("/delete", authenticateToken, cartController.deleteCartItem);

module.exports = router;
