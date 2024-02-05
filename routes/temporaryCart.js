const express = require("express");
const router = express.Router();
const sequelize = require('../utils/database');
const { TemporaryCart, TemporaryCartItem, Product, Image } = require('../models/index');
const createOrGetTempCartId = require("../helpers/createOrGetTempCartId");
const updateOrInsertCartItem = require("../helpers/updateOrInsertCartItem");
const getTotalPriceInCart = require('../helpers/getTotalPriceInCart')


router.get('/:id', async (req, res) => {
    try {
        const temporaryCartId = req.params.id;
        const temporaryCart = await TemporaryCart.findOne({
            where: { id: temporaryCartId },
            include: [
                {
                    model: TemporaryCartItem,
                    attributes: ['TemporaryCartId', 'quantity', 'unit_price'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'title'],
                            include: [
                                {
                                    model: Image,
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [[TemporaryCartItem, 'createdAt', 'DESC']]
        });

        if (!temporaryCart) res.status(404).send('temporary cart not found');

        temporaryCart.dataValues.totalPrice = await getTotalPriceInCart(temporaryCartId)
        res.status(200).send(temporaryCart);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/', async (req, res) => {
    try {
        const { productId, temporaryCartId, change } = req.body;
        if (!productId)
            return res.status(400).send("Product ID is required");

        let temporaryCart = await createOrGetTempCartId(temporaryCartId)
        const product = await Product.findByPk(productId);
        if (!product)
            return res.status(404).send("Product not found");



        let temporaryCartItem = await updateOrInsertCartItem(temporaryCart, product, change);
        return res.status(200).send(temporaryCart);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
});


router.delete('/', async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { temporaryCartId, productId } = req.body;

        let productQuantityInCart;

        if (temporaryCartId && productId) {
            const result = await TemporaryCartItem.findOne({
                where: {
                    TemporaryCartId: temporaryCartId,
                    ProductId: productId
                },
                transaction: t
            })

            if (!result) return res.status(404).send("product Item is not found")
            productQuantityInCart = result.quantity;

            await TemporaryCartItem.destroy({
                where: {
                    TemporaryCartId: temporaryCartId,
                    ProductId: productId
                },
                transaction: t
            })

            const productInDB = await Product.findOne({ where: { id: productId }, transaction: t });
            await productInDB.increment('numInStock', { by: productQuantityInCart, transaction: t });

            await t.commit(); // Commit the transaction if all operations are successful

            res.status(200).send('product deleted successfully from the cart');

        } else
            return res.status(400).send("error: tempCartId and ProductId are requird");

    }
    catch (error) {
        await t.rollback(); // Rollback the transaction if an error occurs
        return res.status(500).send('Error deleting product from the cart');
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const temporaryCartId = req.params.id;
        const temporaryCart = await TemporaryCart.findOne({
            where: { id: temporaryCartId }
        });

        if (!temporaryCart) {
            return res.status(404).send('temporary cart not found');
        }

        // Delete items associated with the temporary cart
        await TemporaryCartItem.destroy({
            where: { temporaryCartId: temporaryCartId }
        });

        // Delete the temporary cart itself
        await TemporaryCart.destroy({
            where: { id: temporaryCartId }
        });

        res.status(200).send('Temporary Cart deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
