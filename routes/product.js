const express = require('express');
const Product = require('../models/product');
const Image = require('../models/image');
const Joi = require('joi');
const router = express.Router();
const debug = require('debug')('app:startup');
const upload = require('../middleware/multer');
const { Op } = require('sequelize');


router.post('/', upload.array("images", 10), async (req, res) => {
    try {
        const { id, title, price, rating, description, numInStock, previews, imgTitles } = req.body;
        const images = req.files;
        const { error } = validateProduct(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const product = await Product.create({ title, price, rating, description, numInStock });

        if (!product) {
            return res.status(500).send('Error creating the product');
        }

        if (images && images.length > 0) {
            await saveImagesInDB(product, images, previews)
            res.status(200).send('product added successfully');
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

        if (req.query.minPrice && req.query.maxPrice)
            whereClause.price = {
                [Op.between]: [req.query.minPrice, req.query.maxPrice]
            }

        if (req.query.title)
            whereClause.title = {
                [Op.like]: `%${req.query.title}%`
            }

        if (req.query.minRating)
            whereClause.rating = {
                [Op.gte]: `%${req.query.minRating}%`
            }

        const products = await Product.findAll({
            include: [{ model: Image }],
            where: whereClause,
            limit: pageSize,
            offset: offset,
        });

        const totalProducts = await Product.count({ where: whereClause }); // Get the total number of products

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

router.put('/:id', upload.array("images", 10), async (req, res) => {
    try {
        const product_id = req.params.id;
        const product = await Product.findOne({
            where: { id: product_id },
            include: [{ model: Image }]
        });
        if (!product) return res.status(404).send('Product not found');

        const { title, price, rating, description, numInStock, previews, imgTitles } = req.body;
        const images = req.files;
        const { error } = validateProduct(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        // Update product details
        product.title = title;
        product.price = price;
        product.rating = rating;
        product.description = description;
        product.numInStock = numInStock;

        // Save the updated product
        await product.save();

        if (previews === null || previews === undefined) {
            await deleteAllImagesFromDB(product, product_id);
            if (images && images.length > 0) {
                await saveImagesInDB(product, images, previews);
            }
        } else if (previews && previews.length > 0) {
            await deleteSomeImagesFromDB(product, previews, product_id);
            if (images && images.length > 0) {
                await saveImagesInDB(product, images, previews);
            }
        }

        res.status(200).send('Product edited successfully');
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
        id: Joi.string().allow(null).optional(),
        title: Joi.string().min(3).required(),
        price: Joi.number().min(0).max(1000).required(),
        rating: Joi.number().min(0).max(5).precision(1).required(),
        description: Joi.string().required(),
        images: Joi.array(),
        previews: Joi.array(),
        imgTitles: Joi.array(),
        numInStock: Joi.number().min(0).max(1000).required()
    }

    return Joi.validate(product, schema);
}


async function deleteAllImagesFromDB(product, product_id) {
    try {
        await Image.destroy({
            where: {
                productId: product_id
            }
        });

        await product.setImages([]);
    } catch (error) {
        console.error(`Error deleting images: ${error.message}`);
        throw new Error('Deletion failed');
    }
}

async function deleteSomeImagesFromDB(product, previews, product_id) {
    previews = previews.map(preview => {
        let urlObject = new URL(preview);
        return urlObject.pathname.replace('/api/', '').replace(/\//g, '\\');
    });

    try {
        await Image.destroy({
            where: {
                productId: product_id,
                url: { [Op.notIn]: previews }
            }
        });
    } catch (error) {
        console.error(`Error deleting images: ${error.message}`);
        throw new Error('Deletion failed');
    }
}


async function saveImagesInDB(product, images, previews) {
    try {
        let createdImages = [];

        // Filter out images that are already in previews
        const newImages = images.filter(file => {
            const imageUrl = file.path.replace('/api/', '').replace(/\//g, '\\');
            return !previews.includes(imageUrl);
        });

        // Create new images
        for (const file of newImages) {
            const image = await Image.create({ url: file.path });
            createdImages.push(image);
        }

        // Add new images to the existing images
        const existingImages = await product.getImages();
        const allImages = [...existingImages, ...createdImages];

        await product.setImages(allImages);
    } catch (error) {
        console.error(`Creating images failed: ${error.message}`);
        throw new Error('Creating images failed');
    }
}





module.exports = router;