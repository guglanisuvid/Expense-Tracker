const mongoose = require('mongoose'); // Importing mongoose
const plm = require('passport-local-mongoose'); // Importing passport-local-mongoose

// User Schema for User model
const userSchema = new mongoose.Schema({
    // Defining user schema with username, email, password and expenses
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to Expense model with expenses field
        ref: 'Expense'
    }],
    income: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to Income model with income field
        ref: 'Income'
    }]
});

userSchema.plugin(plm); // Using passport-local-mongoose plugin for user schema

module.exports = mongoose.model('User', userSchema); // Exporting User model