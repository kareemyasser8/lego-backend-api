// const sequelize = require('../utils/database');
const Image = require('./image');
const Product = require('./product')
const Cart = require('./cart')
const CartItem = require('./cart_item')
const TemporaryCart = require('./temporary_cart')
const TemporaryCartItem = require('./temporary_cart_item')
const User = require('./user')
const WishList = require('./wishlist')
const WishListProducts = require('./wishList_product')

Product.hasMany(Image);
Image.belongsTo(Product, { constraints: true, onDelete: 'CASCADE' });


User.hasOne(WishList);
User.hasOne(Cart);

TemporaryCart.belongsToMany(Product, { through: TemporaryCartItem });
Product.belongsToMany(TemporaryCart, { through: TemporaryCartItem });
TemporaryCart.hasMany(TemporaryCartItem)
TemporaryCartItem.belongsTo(TemporaryCart)
TemporaryCartItem.belongsTo(Product)


module.exports = {
    Product,
    Image,
    Cart,
    CartItem,
    TemporaryCart,
    TemporaryCartItem,
    User,
    WishList,
    WishListProducts
};