const sequelize = require('../utils/database');
const { TemporaryCartItem } = require('../models/index');

async function getTotalPriceInCart(temporaryCartId){
    const temporaryCartItem = await TemporaryCartItem.findOne({
        attributes: [
            [
                sequelize.literal('SUM(quantity * unit_price)'),
                'total_price'
            ]
        ],
        where: { TemporaryCartId: temporaryCartId }
    });

    return temporaryCartItem.dataValues.total_price;
} 

module.exports = getTotalPriceInCart;



