
const { WishListProducts} = require('../models/index');

const checkProductInWishList = async (productId, wishListId)=>{
    const product = await WishListProducts.findOne({
        where: {
            productId: productId,
            wishListId: wishListId
        }
    })
    
    return product ? true : false;
}

module.exports = checkProductInWishList;