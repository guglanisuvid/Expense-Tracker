const mongoose = require('mongoose'); // Importing mongoose

// Income Schema for Income model
const incomeSchema = new mongoose.Schema({
    // Defining income schema with title, amount, category, date and userId
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Salary', 'Business', 'Investments', 'Rentals', 'Benefits/Insurance', 'Miscellaneous']
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model with userId field
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Income', incomeSchema); // Exporting Income model