const { TemporaryCart, TemporaryCartItem } = require('../models/index');

const updateOrInsertCartItem = async (temporaryCart, product) => {
    let temporaryCartItem = await TemporaryCartItem.findOne({
        where: {
            TemporaryCartId: temporaryCart.id,
            ProductId: product.id
        }
    });

    if (temporaryCartItem) {
        await temporaryCartItem.increment('quantity');
    } else {
        temporaryCartItem = await TemporaryCartItem.create({
            TemporaryCartId: temporaryCart.id,
            ProductId: product.id,
            quantity: 1,
            unit_price: product.price
        });
    }

    return temporaryCartItem;
};

module.exports = updateOrInsertCartItem;