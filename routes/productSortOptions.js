const express = require('express');
const router = express.Router();
const sortingOptions = require('../helpers/productSortOptions')

let sortingToBeSend = Object.keys(sortingOptions);

router.get('/',async(req,res)=>{
    try{
        res.status(200).send(sortingToBeSend);
    }
    catch (err){
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;