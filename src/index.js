const express = require("express");


const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())


const productRouter = require("./routes/productRoutes")
app.use("/api/products", productRouter)

app.listen(PORT, () => { console.log(`API is listening on port ${PORT}`) })
