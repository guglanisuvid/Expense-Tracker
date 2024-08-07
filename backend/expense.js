const mongoose = require('mongoose'); // Importing mongoose

// Expense Schema for Expense model
const expenseSchema = new mongoose.Schema({
    // Defining expense schema with title, amount, category, date and userId
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
        enum: ['Academic', 'Housing', 'Food/Groceries', 'Transportation', 'Healthcare', 'Personal', 'Entertainment', 'Clothing', 'Miscellaneous']
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

module.exports = mongoose.model('Expense', expenseSchema); // Exporting Expense model