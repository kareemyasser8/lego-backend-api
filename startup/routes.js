const express = require('express');
const path = require('path')
const auth = require('../routes/auth');
const courses = require('../routes/courses')
const users = require('../routes/user');
const products = require('../routes/product');
const productFiltersOptions = require('../routes/productFilterOptions');
const productSortOptions = require('../routes/productSortOptions');
const temporaryCart = require('../routes/temporaryCart');
const wishList = require('../routes/wishList');
const error = require('../middleware/error')

module.exports = function (app) {
    app.use(express.json())
    // app.use('/', (req, res) => {
    //    res.send("The server is running!!")
    // })
    app.use("/api/images", express.static('images'));
    app.use('/api/courses', courses);
    app.use('/api/users/', users)
    app.use('/api/temporaryCart', temporaryCart)
    app.use('/api/wishList', wishList);
    app.use('/api/auth/', auth)
    app.use('/api/products/', products)
    app.use('/api/productFilterOptions/', productFiltersOptions)
    app.use('/api/productSortOptions/', productSortOptions)
    app.use(error)
}