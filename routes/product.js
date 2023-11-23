const express = require('express');
const Product = require('../models/product');
const Image = require('../models/image');
const Joi = require('joi');
const router = express.Router();
const debug = require('debug')('app:startup');
const upload = require('../middleware/multer');
const { Op } = require('sequelize');
// const paginateResults = require('../helpers/paginateResults');

router.post('/', upload.array("images", 10), async (req, res) => {
    try {
        const { title, price, rating, description, numInStock } = req.body;
        const images = req.files;
        const { error } = validateProduct(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const product = await Product.create({ title, price, rating, description, numInStock });

        if (!product) {
            return res.status(500).send('Error creating the product');
        }

        if (images && images.length > 0) {
            const createdImages = [];
            for (const file of images) {
                const image = await Image.create({ url: file.path });
                createdImages.push(image);
            }
            await product.setImages(createdImages);
            res.status(200).send({ product, images: createdImages });
        } else {
            res.status(200).send(product);
        }

    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;

        const whereClause = {};

        if(req.query.minPrice && req.query.maxPrice)
            whereClause.price = {
                [Op.between]: [req.query.minPrice, req.query.maxPrice]
            }
        
        if(req.query.title)
            whereClause.title = {
                [Op.like]: `%${req.query.title}%`
            }

        if(req.query.minRating)
            whereClause.rating = {
                [Op.gte]: `%${req.query.minRating}%`
            }

        const products = await Product.findAll({
            include: [{ model: Image }],
            where: whereClause,
            limit: pageSize,
            offset: offset,
        });

        const totalProducts = await Product.count({where: whereClause}); // Get the total number of products

        const totalPages = Math.ceil(totalProducts / pageSize);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const result = {
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
            products: products,
        };

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const product = await Product.findOne({
            where: { id: product_id },
            include: [{ model: Image }]
        });
        if (!product) res.status(404).send('product not found');
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const product = await Product.findOne({ where: { id: product_id } });

        if (!product) return res.status(404).send('Product not found');

        const { name, price, rating, description } = req.body;
        const { error } = validateProduct(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        // Update the product
        const [rowsUpdated] = await Product.update(
            { name, price, rating, description },
            { where: { id: product_id } }
        );

        res.status(200).send({ rowsUpdated });
    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        const product = await Product.findOne({ where: { id: product_id } });

        if (!product) return res.status(404).send('Product not found');

        await Product.destroy({ where: { id: product_id } });

        res.status(200).send('Product deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});




function validateProduct(product) {
    const schema = {
        title: Joi.string().min(3).required(),
        price: Joi.number().min(0).max(1000).required(),
        rating: Joi.number().min(0).max(5).precision(1).required(),
        description: Joi.string().required(),
        images: Joi.array(),
        numInStock: Joi.number().min(0).max(1000).required()
    }

    return Joi.validate(product, schema);
}

module.exports = router;