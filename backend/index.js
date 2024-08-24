const express = require('express'); // Importing express
const session = require('express-session'); // Importing express-session
const cors = require('cors'); // Importing cors
const passport = require('passport'); // Importing passport
const localStrategy = require('passport-local'); // Importing passport local strategy
const User = require('./user'); // Importing User model
const Expense = require('./expense'); // Importing Expense model
const Income = require('./income'); // Importing Income model
const joi = require('joi'); // Importing joi for validation
const dotenv = require('dotenv'); // Importing dotenv for environment variables
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const mongoose = require('mongoose'); // Importing mongoose
const MongoStore = require('connect-mongo'); // Importing connect-mongo for session store
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

// Setting up and configuring sessions
app.use(session({
    resave: false, // Resave session
    saveUninitialized: false, // Save uninitialized session
    secret: process.env.SESSION_SECRET, // Secret key for session
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60, // 7 days
        touchAfter: 24 * 3600, // 24 hours
        autoRemove: 'native', // Automatically remove expired sessions
    }),
    cookie: {
        secure: true, // Secure cookie
        httpOnly: true, // httpOnly cookie
        sameSite: 'none', // SameSite cookie
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
}));

app.use(passport.initialize()); // Using passport initialize
app.use(passport.session()); // Using passport session

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

// Setting up passport local strategy
passport.use(new localStrategy(
    // Setting up username and password fields
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    // Authenticating user with username and password
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username }); // Finding user by username

            if (!user) return done(null, false, { message: 'Incorrect username.' }); // If user not found

            if (!user.password) return done(null, false, { message: 'User password is undefined.' }); // If user password is undefined

            const isValid = matchHashedPassword(password, user.password); // Matching password hash with user password

            if (isValid) return done(null, user);// If password is correct
            else return done(null, false, { message: 'Incorrect password.' }); // If password is incorrect
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));

// Serializing user
passport.serializeUser((user, done) => {
    try {
        done(null, user.id); // Serializing user
    } catch (err) {
        console.error(err);
        done(err, false); // If error occurs while serializing user
    }
});

// Deserializing user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Finding user by id
        if (user) {
            return done(null, user); // If user is found
        } else return done(null, false); // If user is not found
    } catch (err) {
        console.error(err);
        done(err, false); // If user is not found
    }
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
        } catch (err) {
            return res.json({ error: true, message: err }); // If error occurs while saving user
        }

        req.logIn(newUser, (err) => {
            if (err) {
                return res.json({ error: true, message: err }); // If error occurs while logging in user
            } else {
                return res.json({ error: false, message: "Sign up success" }); // If user is signed up successfully
            }
        });
    } else {
        return res.json({ error: true, message: "User already exists" }); // If user already exists
    }
});

// Login user
app.post("/login", passport.authenticate("local"), (req, res) => {
    try {
        // If user is authenticated
        res.json({
            error: false,
            message: "Login success",
        });
    } catch (err) {
        console.error(err);
        res.json({ error: true, message: err || "Something went wrong" });
    }
});

// Sign out user
app.get('/logout', (req, res) => {
    req.logOut(err => {
        if (err) {
            return res.json({ error: true, message: err || "Something went wrong" })
        } // If error occurs while logging out user
        else {
            return res.json({ error: false, message: "User logged out successfully" })
        }; // If user is logged out successfully
    });
});

// Check current user authentication status
app.get('/is-authenticated', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
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
        } else return res.json({ error: true, message: "Unauthorized access", });
    } catch (err) {
        console.error(err);
        return res.json({ error: true, message: err });
    }
});

// Add new expense
app.post('/add-expense', async (req, res) => {
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
app.put('/edit-expense/:id', async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, { title, amount, category }, { new: true }); // Updating expense by id
        res.json({ error: false, message: "Expense updated successfully", expense: updatedExpense }); // If expense is updated successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while updating expense
    }
});

// Delete expense
app.delete('/delete-expense/:id', async (req, res) => {

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
app.post('/add-income', async (req, res) => {
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
            res.json({ error: false, message: "Expense added successfully", income: newIncome }); // If income is added successfully
        } catch (err) {
            res.json({ error: true, message: err }); // If error occurs while saving user
        }
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while saving income
    }
});

// Edit income
app.put('/edit-income/:id', async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, { title, amount, category }, { new: true }); // Updating income by id
        res.json({ error: false, message: "Income updated successfully", income: updatedIncome }); // If income is updated successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while updating income
    }
});

// Delete income
app.delete('/delete-income/:id', async (req, res) => {
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