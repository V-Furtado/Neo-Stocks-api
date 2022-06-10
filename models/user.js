const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema
    // name
    // email address
    // password
    // date when created

let userSchema = new Schema (
    {
        name: {
            type: 'string',
            required: true,
            min: 6,
            max: 255
        },
        email: {
            type: 'string',
            required: true,
            min: 6,
            max: 255
        },
        password: {
            type: 'string',
            required: true,
            min: 6,
            max: 255
        },
        date: {
            type: Date,
            default: Date.now
        }
    }

);

module.exports = mongoose.model("user", userSchema);