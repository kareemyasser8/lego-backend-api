const Joi = require('joi');
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(course, schema);
    return result;
}

module.exports = validateCourse;