// get some dependencies. 
const mongoose = require('mongoose')

// create a schema definition. 
const Schema = mongoose.Schema;

let stocksSchema = new Schema(
    {
        name: {type: 'string', required: true, minlength: 4, maxlength: 50},
        symbol: {type: 'string', required: true},
        price: {type: 'number', required: true},
        ipoDate: {type: 'string', required: true},
        exchange: {type: 'string', required: true},
        inTheTop20: {type: 'boolean', required: true}
    }
);

module.exports = mongoose.model("Stocks", stocksSchema);
