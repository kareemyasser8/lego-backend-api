const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController')

router.get("/", productController.getAllProducts)
router.get("/:productId", productController.getOneProduct)
router.post("/", productController.createProduct)
router.patch("/:productId", productController.updateProduct)
router.delete("/:productId", productController.deleteProduct)

module.exports = router;