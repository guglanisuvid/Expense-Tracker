const express = require('express'); // Importing express
const cors = require('cors'); // Importing cors
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken
const User = require('./user'); // Importing User model
const Expense = require('./expense'); // Importing Expense model
const Income = require('./income'); // Importing Income model
const joi = require('joi'); // Importing joi for validation
const dotenv = require('dotenv'); // Importing dotenv for environment variables
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const mongoose = require('mongoose'); // Importing mongoose
const user = require('./user');

const app = express(); // Creating express app instance
app.use(express.json()); // Using json parser

dotenv.config(); // Configuring dotenv

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(
    () => console.log('MongoDB connected')
).catch(
    err => {
        console.error(err.message);
        process.exit(1);
    }
);

// CORS Configuration
const corsOptions = {
    origin: process.env.REQUEST_ORIGIN, // Allowing origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowing methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowing headers
    credentials: true, // Allowing credentials
    optionsSuccessStatus: 200, // Setting options success status to 200
};

app.use(cors(corsOptions)); // Using cors with corsOptions

app.options('*', cors(corsOptions)); // Handle preflight requests

app.set('trust proxy', 1); // Trusting first proxy

app.use(express.urlencoded({ extended: true })); // Using urlencoded parser for form data parsing in POST requests

// JWT Middleware for token verification
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    
    if (!token) {
        return res.json({ error: true, message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.json({ error: true, message: 'Invalid token' });
    }
};

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
    );
};

// Generating Password Hash
const generatePasswordHash = (text) => {
    const salt = bcrypt.genSaltSync(10); // Generating salt for password hash with 10 rounds of hashing
    const hash = bcrypt.hashSync(text, salt); // Generating password hash with salt and user password
    return hash; // Returning password hash to store in database
};

// Matching Password Hash
const matchHashedPassword = (text, hashedText) => {
    return bcrypt.compareSync(text, hashedText); // Comparing password hash with user password
};

// User Registration Validation Schema using joi
const userRegisterationValidationSchema = joi.object({
    email: joi.string().email().required().min(5), // Email validation with minimum 5 characters
    password: joi.string().required().min(3).max(100), // Password validation with minimum 3 and maximum 100 characters
    username: joi.string().required(), // Username validation with minimum 1 character
});

// Register new user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // Getting username, email, and password from request body

    // Validating user registration data
    const validationResults = userRegisterationValidationSchema.validate({
        email,
        password,
        username,
    });

    // If validation error occurs
    if (validationResults.error) {
        return res.json({
            error: true,
            message: validationResults.error || "Something went wrong",
        });
    }

    // Checking if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    // If user does not exist
    if (!existingUser) {
        // Creating new user
        const newUser = new User({
            email,
            password: generatePasswordHash(password),
            username,
        });

        try {
            await newUser.save(); // Saving new user
            const token = generateToken(newUser);
            return res.json({ error: false, message: "Sign up success", token }); // If user is signed up successfully
        } catch (err) {
            return res.json({ error: true, message: err }); // If error occurs while saving user
        }
    } else {
        return res.json({ error: true, message: "User already exists" }); // If user already exists
    }
});

// Login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username }); // Finding user by username

        if (!user) {
            return res.json({ error: true, message: 'Incorrect username.' });
        }

        if (!user.password) {
            return res.json({ error: true, message: 'User password is undefined.' });
        }

        const isValid = matchHashedPassword(password, user.password); // Matching password hash with user password

        if (isValid) {
            const token = generateToken(user);
            return res.json({
                error: false,
                message: "Login success",
                token
            });
        } else {
            return res.json({ error: true, message: 'Incorrect password.' });
        }
    } catch (err) {
        console.error(err);
        res.json({ error: true, message: err || "Something went wrong" });
    }
});

// Sign out user
app.get('/logout', (req, res) => {
    return res.json({ error: false, message: "User logged out successfully" });
});

// Check current user authentication status
app.get('/is-authenticated', verifyToken, async (req, res) => {
    try {
        // Finding user by username and populating expenses and income
        const user = await User.findOne(
            {
                username: req.user.username
            }
        ).populate(
            {
                path: 'expenses',
                options: {
                    sort: { date: -1 }
                }
            }
        ).populate(
            {
                path: 'income',
                options: {
                    sort: { date: -1 }
                }
            }
        );

        return res.json({ error: false, message: "User is Signed In", user: user }); // If user is authenticated
    } catch (err) {
        console.error(err);
        return res.json({ error: true, message: err });
    }
});

// Add new expense
app.post('/add-expense', verifyToken, async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    const user = await User.findOne({ username: req.user.username }); // Finding user by username

    // Creating new expense
    const newExpense = new Expense({
        title,
        amount,
        category,
        userId: user._id,
    });

    try {
        await newExpense.save(); // Saving new expense
        user.expenses.push(newExpense._id); // Pushing new expense to user expenses array
        try {
            await user.save(); // Saving user
            res.json({ error: false, message: "Expense added successfully", expense: newExpense }); // If expense is added successfully
        } catch (err) {
            res.json({ error: true, message: err }); // If error occurs while saving user
        }
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while saving expense
    }
});

// Edit expense
app.put('/edit-expense/:id', verifyToken, async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, { title, amount, category }, { new: true }); // Updating expense by id
        res.json({ error: false, message: "Expense updated successfully", expense: updatedExpense }); // If expense is updated successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while updating expense
    }
});

// Delete expense
app.delete('/delete-expense/:id', verifyToken, async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id); // Deleting expense by id

        // Pulling expense from user expenses array
        await User.updateOne(
            { username: req.user.username },
            { $pull: { expenses: req.params.id } }
        );

        res.json({ error: false, message: "Expense deleted successfully" }); // If expense is deleted successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while deleting expense
    }
});

// Add new income
app.post('/add-income', verifyToken, async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    const user = await User.findOne({ username: req.user.username }); // Finding user by username

    // Creating new income
    const newIncome = new Income({
        title,
        amount,
        category,
        userId: user._id,
    });

    try {
        await newIncome.save(); // Saving new income
        user.income.push(newIncome._id); // Pushing new income to user income array
        try {
            await user.save(); // Saving user
            res.json({ error: false, message: "Income added successfully", income: newIncome }); // If income is added successfully
        } catch (err) {
            res.json({ error: true, message: err }); // If error occurs while saving user
        }
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while saving income
    }
});

// Edit income
app.put('/edit-income/:id', verifyToken, async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, { title, amount, category }, { new: true }); // Updating income by id
        res.json({ error: false, message: "Income updated successfully", income: updatedIncome }); // If income is updated successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while updating income
    }
});

// Delete income
app.delete('/delete-income/:id', verifyToken, async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id); // Deleting income by id

        // Pulling income from user income array
        await User.updateOne(
            { username: req.user.username },
            { $pull: { income: req.params.id } }
        );
        res.json({ error: false, message: "Income deleted successfully" }); // If income is deleted successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while deleting income
    }
});

// Default route
app.get('/', (_, res) => {
    res.json({ message: "Welcome to Expense Tracker API" });
});

const PORT = process.env.PORT || 5000; // Setting up port for server

// Starting the server at port 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});