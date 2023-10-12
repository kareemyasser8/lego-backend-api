
const getAllProducts = (req, res, next) => {
    res.send('Gell all products');
}

const getOneProduct = (req,res,next)=>{
    res.send("Get an existing product");
}

const createProduct = (req, res, next) => {
    res.send("Create new product")
}

const updateProduct = (req, res, next) => {
    res.send("Update an existing product")
}

const deleteProduct = (req, res, next) => {
    res.send("Delete an existing product")
}

module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct
}