const Joi = require('joi');
function validateUser(user) {
    const schema = {
        fname: Joi.string().min(3).required(),
        lname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
    }

    const result = Joi.validate(user, schema);
    return result;
}

module.exports = validateUser;