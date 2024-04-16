const express = require('express'); // Importing express
const session = require('express-session'); // Importing express-session
const cors = require('cors'); // Importing cors
const passport = require('passport'); // Importing passport
const localStrategy = require('passport-local'); // Importing passport local strategy
const User = require('./user'); // Importing User model
const Expense = require('./expense'); // Importing Expense model
const Income = require('./income'); // Importing Income model
const joi = require('joi'); // Importing joi for validation
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing


const app = express(); // Creating express app instance
app.use(express.json()); // Using json parser
// app.use(cors()); // Using cors


app.set("trust proxy", 1); // Trusting first proxy

// Setting up and configuring cors
app.use(
    // Using cors with configuration
    cors({
        origin: "http://localhost:3000", // Allowing requests from localhost:3000
        credentials: true, // Allowing credentials
    })
);

app.use(express.urlencoded({ extended: true })); // Using urlencoded parser for form data parsing in POST requests

// Setting up and configuring sessions
app.use(session({
    resave: false, // Resave session
    saveUninitialized: false, // Save uninitialized session
    secret: 'ExpenseTracker', // Secret key for session
    // Setting up session cookie
    cookie: {
        secure: false, // Secure cookie
        sameSite: 'strict', // Same site cookie
        httpOnly: true, // Http only cookie
        maxAge: 60 * 60 * 1000 // Max age of cookie in milliseconds
    }
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

            // If user password is undefined
            if (!user.password) {
                return done(null, false, { message: 'User password is undefined.' });
            }

            const isValid = matchHashedPassword(password, user.password); // Matching password hash with user password

            if (isValid) return done(null, user); // If password is correct
            else return done(null, false, { message: 'Incorrect password.' }); // If password is incorrect
        } catch (err) { // If error occurs
            console.error(err);
            return done(err);
        }
    }));

// Serializing user
passport.serializeUser((user, done) => {
    done(null, user.id); // Serializing user
});

// Deserializing user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Finding user by id
        done(null, user); // If user is found
    } catch (err) {
        done(err, false); // If user is not found
    }
});

// Register new user
app.post('/api/register', async (req, res) => {
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
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // If user is authenticated
    res.json({
        error: false,
        message: "Login success",
    });
});

// Sign out user
app.get('/api/logout', (req, res) => {
    req.logOut(err => {
        if (err) return res.json({ error: true, message: err || "Something went wrong" }); // If error occurs while logging out user
        else return res.json({ error: false, message: "User logged out successfully" }); // If user is logged out successfully
    });
});

// Check current user authentication status
app.get('/api/is-authenticated', async (req, res) => {
    if (req.isAuthenticated()) {
        // Finding user by username and populating expenses and income
        const user = await User.findOne({ username: req.user.username })
            .populate({ path: 'expenses', options: { sort: { date: -1 } } })
            .populate({ path: 'income', options: { sort: { date: -1 } } });

        return res.json({ error: false, message: "User is Signed In", user: user }); // If user is authenticated
    } else return res.json({ error: true, message: "Unauthorized access", }); // If user is not authenticated
});

// Add new expense
app.post('/api/add-expense', async (req, res) => {
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
app.put('/api/edit-expense/:id', async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, { title, amount, category }, { new: true }); // Updating expense by id
        res.json({ error: false, message: "Expense updated successfully", expense: updatedExpense }); // If expense is updated successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while updating expense
    }
});

// Delete expense
app.delete('/api/delete-expense/:id', async (req, res) => {

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
app.post('/api/add-income', async (req, res) => {
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
app.put('/api/edit-income/:id', async (req, res) => {
    const { title, amount, category } = req.body; // Getting title, amount, and category from request body

    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, { title, amount, category }, { new: true }); // Updating income by id
        res.json({ error: false, message: "Income updated successfully", income: updatedIncome }); // If income is updated successfully
    } catch (err) {
        res.json({ error: true, message: err }); // If error occurs while updating income
    }
});

// Delete income
app.delete('/api/delete-income/:id', async (req, res) => {
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

// app.use(express.static('../frontend/build'));

// app.get('*', (req, res) => {
//     res.sendFile('../frontend/build/index.html');
// });

// Starting the server at port 5000
app.listen(5000, () => {
    console.log("Project started at port : 5000");
});