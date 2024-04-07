const express = require('express'); // Importing express
const session = require('express-session'); // Importing express-session
const cors = require('cors'); // Importing cors
const passport = require('passport'); // Importing passport
const localStrategy = require('passport-local'); // Importing passport local strategy
const User = require('./user'); // Importing User model
const Expense = require('./expense'); // Importing Expense model
const joi = require('joi'); // Importing joi for validation
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing


const app = express(); // Creating express app instance
app.use(express.json()); // Using json parser
// app.use(cors()); // Using cors


app.set("trust proxy", 1); // Trusting first proxy

// Setting up and configuring cors
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true })); // Using urlencoded parser for form data parsing in POST requests

// Setting up and configuring sessions
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ExpenseTracker',
    cookie: {
        secure: false,
        sameSite: 'strict',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    }
}));

app.use(passport.initialize()); // Using passport initialize
app.use(passport.session()); // Using passport session 

// Generating Password Hash
const generatePasswordHash = (text) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(text, salt);
    return hash;
};

// Matching Password Hash
const matchHashedPassword = (text, hashedText) => {
    return bcrypt.compareSync(text, hashedText);
};

// User Registration Validation Schema using joi
const userRegisterationValidationSchema = joi.object({
    email: joi.string().email().required().min(5),
    password: joi.string().required().min(3).max(100),
    username: joi.string().required(),
});

// Setting up passport local strategy
passport.use(new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });

            if (!user) return done(null, false, { message: 'Incorrect username.' });

            if (!user.password) {
                return done(null, false, { message: 'User password is undefined.' });
            }

            const isValid = matchHashedPassword(password, user.password);

            if (isValid) return done(null, user);
            else return done(null, false, { message: 'Incorrect password.' });
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));

// Serializing user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializing user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, false);
    }
});

// Register new user
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    const validationResults = userRegisterationValidationSchema.validate({
        email,
        password,
        username,
    });

    if (validationResults.error) {
        return res.json({
            error: true,
            message: validationResults.error || "Something went wrong",
        });
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!existingUser) {
        const newUser = new User({
            email,
            password: generatePasswordHash(password),
            username,
        });

        try {
            await newUser.save();
        } catch (err) {
            return res.json({ error: true, message: err });
        }

        req.logIn(newUser, (err) => {
            if (err) {
                return res.json({ error: true, message: err });
            } else {
                return res.json({ error: false, message: "Sign up success" });
            }
        });
    } else {
        return res.json({ error: true, message: "User already exists" });
    }
});

// Login user
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({
        error: false,
        message: "Login success",
    });
});

// Sign out user
app.get('/api/logout', (req, res) => {
    req.logOut(err => {
        if (err) return res.json({ error: true, message: err || "Something went wrong" });
        else return res.json({ error: false, message: "User logged out successfully" });
    });
});

// Check current user authentication status
app.get('/api/is-authenticated', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findOne({ username: req.user.username }).populate('expenses');
        return res.json({ error: false, message: "User is Signed In", user: user });
    } else return res.json({ error: true, message: "Unauthorized access", });
});

// Add new expense
app.post('/api/add-expense', async (req, res) => {
    const { title, amount, category } = req.body;

    const user = await User.findOne({ username: req.user.username });

    const newExpense = new Expense({
        title,
        amount,
        category,
        userId: user._id,
    });

    try {
        await newExpense.save();
        user.expenses.push(newExpense._id);
        try {
            await user.save();
            res.json({ error: false, message: "Expense added successfully" });
        } catch (err) {
            res.json({ error: true, message: err });
        }
    } catch (err) {
        res.json({ error: true, message: err });
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