const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { Op } = require('sequelize');
const filtersOptions = require('../helpers/productFilterOptions');
const extractPriceRanges = require('../helpers/extractPriceRanges');

router.get('/', async (req, res) => {
    try {
        await Promise.all(filtersOptions.map(async (filter) => {
            if (filter.name == "price") {
                await Promise.all(filter.value.map(async (value) => {
                    let priceFilterRange = extractPriceRanges(value.name);
                    value.count = await countProductsPerFilter(priceFilterRange);
                }));
            }
        }));
        res.status(200).send(filtersOptions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//utility functions

function isPriceFilter(arg) {
    return (
        arg &&
        typeof arg === 'object' &&
        arg.hasOwnProperty('min') &&
        arg.hasOwnProperty('max'))
}

async function countProductsPerFilter(arg) {
    try {
        let count = 0;
        if (isPriceFilter(arg)) {
            count = await Product.count({
                where: {
                    price:
                        (arg.max !== undefined) ?
                            { [Op.between]: [arg.min, arg.max] } :
                            { [Op.gte]: arg.min }
                }
            })
        }
        return count;
    } catch (error) {
        console.error(error);
        throw new Error('Error counting products per filter');
    }
}


module.exports = router;