const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const sequelize = require('../utils/database');

// const User = require('../models/user');
// const Cart = require('../models/cart')
// const WishList = require('../models/wishlist')

const {User, Cart, WishList} = require('../models/index');

const debug = require('debug')('app:startup');
const bcrypt = require('bcrypt');
const validateUser = require('../middleware/validateUser');
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
        debug(err);
    }
});


router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findAll({
            where: { id: userId     },
            attributes: { exclude: ['password'] }
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
        debug(err);
    }
});


router.post('/', async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;
        const { error } = validateUser(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) return res.status(400).send('Email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ fname, lname, email, password: hashedPassword, isAdmin: false });
        const cart = await Cart.create({});
        const wishlist = await WishList.create({});

        await user.setCart(cart);
        // await user.setWishList(wishlist)

        const token = user.generateAuthToken()
        res.status(200).send({
            token: token,
            user: _.pick(user, ['fname', 'lname', 'email', 'password'])
          });
          
        debug(user);
    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const userId = req.params.id;

        const result = await User.destroy({ where: { id: userId }, transaction: t });

        if (result === 0) {
            await t.rollback();
            return res.status(404).send('User not found');
        }

        await Cart.destroy({
            where: { userId },
            transaction: t
        });

        await WishList.destroy({
            where: { userId },
            transaction: t
        });

        await t.commit();
        res.status(200).send('User deleted successfully!!');
        debug(result);
    } catch (error) {
        await t.rollback();
        res.status(500).send(error.message);
        debug(error.message);
    }
});

// console.log(crypto.randomUUID())

module.exports = router;