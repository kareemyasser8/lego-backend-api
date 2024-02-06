const { WishList } = require('../models/index');

const createOrGetWishListId = async (wishListId) => {
    if (!wishListId) {
        return await WishList.create();
    } else {
        let result;
        result = await WishList.findByPk(wishListId);

        if (!result) {
            // Note: You might want to throw an error here instead of sending a response
            throw new Error("Wishlist is not found");
        }

        return result;
    }
}

module.exports = createOrGetWishListId;