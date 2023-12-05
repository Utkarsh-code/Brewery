const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
