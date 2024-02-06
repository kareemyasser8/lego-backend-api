const {  WishListProducts } = require('../models/index');
const createOrGetWishListId = require("./createOrGetWishListId");
const checkProductInWishList = require('./checkProductInWishList ');

const addOrRemoveProductFromWishList = async (wishListId, product)=>{

    const wishList = await createOrGetWishListId(wishListId)
    const isProductFound = await checkProductInWishList(product.id, wishList.id);
    let result;

    if (!isProductFound) {
        result = await WishListProducts.create({
            WishListId: wishList.id,
            ProductId: product.id,
        })
    } else {
        result = await WishListProducts.destroy({
            where: {
                WishListId: wishList.id,
                ProductId: product.id
            }
        })
    }

    return result;
}

module.exports = addOrRemoveProductFromWishList;