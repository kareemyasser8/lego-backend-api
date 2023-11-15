const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/user');
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


router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findAll({ where: { id: userId } });

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

        const token = user.generateAuthToken()
        res.header('x-auth-token', token).status(200).send(_.pick(user, ['fname', 'lname', 'email', 'password']));
        debug(user);
    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await User.destroy({ where: { id: userId } });

        if (result === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted successfully!!');
        debug(result);
    } catch (error) {
        res.status(500).send(error);
        debug(error);
    }
});



module.exports = router;