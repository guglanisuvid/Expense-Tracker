const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");

const PORT = 5000;

// Loading environment variables
require("dotenv").config();

// Connecting to database
require("./dbconnect");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting up and configuring sessions
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "ExpenseTracker",
    cookie: {
      secure: false,
      sameSite: "strict",
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // in minutes 60 mins
    },
  })
);

// Configuring passport js
require("./passport/config")(passport);

app.use(passport.initialize());
app.use(passport.session());

// Registering routes
app.use("/", require("./routes/normal"));
app.use("/api", require("./routes/api"));

// Serving react app
// app.use(express.static('../frontend/build'));

app.use((req, res) => {
  if (req.method === "GET") {
    // Page not found error in case user requests invalid url
    res.status(400).end();
  } else res.status(405).end(); // Disallow any unregistered methods which are not implemented
});

app.listen(PORT, () => {
  console.log(
    `Project started at port : ${PORT}\nView project : http://localhost:${PORT}`
  );
});
