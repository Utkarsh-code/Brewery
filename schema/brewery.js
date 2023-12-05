const mongoose = require('mongoose');

// Define the brewery schema
const brewerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required:true,
    },
    postal_code:{
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger, // Ensures the value is an integer
            message: '{VALUE} is not an integer value for postalcode.',
        },
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger, // Ensures the value is an integer
            message: '{VALUE} is not an integer value for phone number.',
        },
    },
    website_url:{
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
});

// Create a model based on the schema
const Brewery = mongoose.model('Brewery', brewerySchema);

// Export the Brewery model
module.exports = Brewery;
