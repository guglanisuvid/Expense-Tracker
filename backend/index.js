const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./user');


const app = express();

app.use(express.json());
app.use(cors());

// app.use(express.urlencoded({ extended: true }));

// Setting up and configuring sessions
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ExpenseTracker',
}));

// Setting authentication using passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Register new user
app.post('/api/register', (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email
    });

    User.register(user, req.body.password)
        .then(() => {
            passport.authenticate('local')(req, res, () => {
                res.json({ success: true });
            });
        })
        .catch((err) => {
            res.json({ success: false, error: "Something went wrong" });
        });
});


// Login user
app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        if (!user) {
            return res.json({ success: false, message: info.message });
        }
        req.logIn(user, err => {
            if (err) {
                return res.json({ success: false, message: err });
            }
            return res.json({ success: true, message: "Login successful", user });
        });
    })(req, res, next);
});

// Checking if the user is authenticated or not
const isLoggedIn = async (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    } else {
        res.json({ isAuthenticated: false, user: req.user });
    }
}

// Route to check authentication status
app.get('/api/is-authenticated', isLoggedIn, (req, res) => {
    res.json({ isAuthenticated: true });
});



// Sign out user
// app.get('/api/logout', (req, res, next) => {
//     req.logOut(err => {
//         if (err) return next(err);
//         res.redirect('/login');
//     });
// });

// app.use(express.static('../frontend/build'));

// app.get('*', (req, res) => {
//     res.sendFile('../frontend/build/index.html');
// });

app.listen(5000, () => {
    console.log("Project started at port : 5000");
});