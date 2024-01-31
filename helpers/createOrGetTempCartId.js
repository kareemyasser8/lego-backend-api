const { TemporaryCart } = require('../models/index');

const createOrGetTempCartId = async (temporaryCartId) => {
    if (!temporaryCartId) {
        return await TemporaryCart.create();
    } else {
        let result;
        result = await TemporaryCart.findByPk(temporaryCartId);

        if (!result) {
            // Note: You might want to throw an error here instead of sending a response
            throw new Error("Temporary cart not found");
        }

        return result;
    }
}

module.exports = createOrGetTempCartId;