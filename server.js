require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const passortSetup = require('./passport');
const authRouter = require('./routes/auth');
const signUpRouter = require('./routes/signup');
const mongoose = require('mongoose');

const app = express();

app.use(
    cookieSession({
        name: "session",
        keys:["cyberwolve"],
        maxAge:24*60*60*100
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter)
app.use("/signup", signUpRouter)

app.use(
    cors({
        origin: true,
        methods: "GET, POST, PUT, DELETE",
        credentials: true
    })
)

mongoose.connect(process.env.MONGO_URI, console.log('MONGODB CONNECTED'))

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log("App listening on port " + PORT))