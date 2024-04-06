const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./user');
const joi = require('joi');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

// Setting up and configuring sessions
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ExpenseTracker',
    cookie: {
        secure: false
    }
}));

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

const userRegisterationValidationSchema = joi.object({
    email: joi.string().email().required().min(5),
    password: joi.string().required().min(3).max(100),
    username: joi.string().required(),
});

// Setting up passport local strategy
passport.use(new localStrategy(async (username, password, done) => {
    try {
        await User.findOne({ username: username })
            .exec()
            .then(user => {
                if (!user) return done(null, false, { message: 'Incorrect username.' });

                // console.log("User found:", user);

                if (!user.password) {
                    return done(null, false, { message: 'User password is undefined.' });
                }

                const isValid = matchHashedPassword(password, user.password);

                if (isValid) return done(null, user);
                else return done(null, false, { message: 'Incorrect password.' });
            })
            .catch(err => {
                console.error(err);
                return done(err);
            });
    } catch (err) {
        console.error(err);
        return done(err);
    }
}));

// Serializing and deserializing user
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

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

        newUser.save();

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
app.get('/api/is-authenticated', (req, res) => {
    if (req.isAuthenticated()) return res.json({ error: false, message: "User is Signed In", user: req.user });
    else return res.json({ error: true, message: "Unauthorized access", });
});

// app.use(express.static('../frontend/build'));

// app.get('*', (req, res) => {
//     res.sendFile('../frontend/build/index.html');
// });

app.listen(5000, () => {
    console.log("Project started at port : 5000");
});