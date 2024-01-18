const express = require('express');
const Joi = require('joi');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/user');
const debug = require('debug')('app:startup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config');

function validateUser(req) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
    }

    const result = Joi.validate(req, schema);
    return result;
}

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = validateUser(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).send('Invalid email or password');

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(400).send('Invalid email or password');

        const token = user.generateAuthToken()
        res.status(200).send(token); 

    } catch (error) {
        res.status(500).send(error.message);
        debug(error.message);
    }
});



module.exports = router;