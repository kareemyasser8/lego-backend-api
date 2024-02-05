const { TemporaryCartItem } = require('../models/index');
const { Product } = require('../models/index');
const sequelize = require('../utils/database')
const PRODUCT_QUANTITY_LIMIT = require("../constants/productQuantityLimit");

const updateOrInsertCartItem = async (temporaryCart, product, change) => {
    const t = await sequelize.transaction();

    try {
        let temporaryCartItem = await TemporaryCartItem.findOne({
            where: {
                TemporaryCartId: temporaryCart.id,
                ProductId: product.id
            },
            transaction: t
        });

        let productInDB = await Product.findOne({
            where: { id: product.id },
            transaction: t
        });

        if (temporaryCartItem) {
            if (change > 0) {
                let canIncrement = (temporaryCartItem.quantity + 1 <= PRODUCT_QUANTITY_LIMIT &&
                    productInDB.numInStock != 0
                )

                if (canIncrement) {
                    await temporaryCartItem.increment('quantity', { by: 1, transaction: t });
                    await productInDB.decrement('numInStock', { by: 1, transaction: t });
                }
            } else {
                await temporaryCartItem.decrement('quantity', { by: 1, transaction: t });
                await productInDB.increment('numInStock', { by: 1, transaction: t });
            }
        } else {
            temporaryCartItem = await TemporaryCartItem.create(
                {
                    TemporaryCartId: temporaryCart.id,
                    ProductId: product.id,
                    quantity: 1,
                    unit_price: product.price
                },
                { transaction: t }
            );

            await productInDB.decrement('numInStock', { by: 1, transaction: t });
        }

        // If everything is successful, commit the transaction
        await t.commit();

        return temporaryCartItem;
    } catch (error) {
        // If an error occurs, rollback the transaction
        await t.rollback();
        throw error;
    }
};


module.exports = updateOrInsertCartItem;