const express = require('express')
const router = express.Router();
const { WishList, WishListProducts, Product, Image } = require('../models/index');
const checkProductInWishList = require('../helpers/checkProductInWishList ');
const addOrRemoveProductFromWishList = require('../helpers/addOrRemoveProductFromWishList');

router.get('/:id', async (req, res) => {
    try {
        const wishListId = req.params.id;
        const wishList = await WishList.findOne({
            where: { id: wishListId },
            include: [
                {
                    model: WishListProducts,
                    include: [{
                        model: Product,
                        attributes: ['id', 'title'],
                        include: [
                            {
                                model: Image,
                            }
                        ]
                    }]
                }
            ],
            order: [[WishListProducts, 'createdAt', 'DESC']]
        })

        if (!wishList) res.status(404).send("WishList is not found")
        res.status(200).send(wishList);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})


router.post('/', async (req, res) => {
    try {
        const { productId, wishListId } = req.body;
        if (!productId)
            return res.status(400).send("Product ID is required");

        const product = await Product.findByPk(productId);

        if (!product) return res.status(404).send("product is not found");

        let result = await addOrRemoveProductFromWishList(wishListId, product);

        if (!result) res.status(500).send("Failed to add Product to WishList")

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const productId = req.query.productId;
        const wishListId = req.query.wishListId;

        // if (!productId || !wishListId) {
        //     return res.status(400).json({ error: "Product ID and Wishlist ID are required" });
        // }
        if(!wishListId) return res.status(200).json({isProductInWishList: false})


        const wishList = await WishList.findByPk(wishListId);
        if (!wishList) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        const isProductFound = await checkProductInWishList(productId, wishList.id);
        res.status(200).json({ isProductInWishList: isProductFound });
    } catch (error) {
        console.error("Error in handler:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;
