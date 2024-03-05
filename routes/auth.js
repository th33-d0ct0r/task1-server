const router = require('express').Router();
const passport = require('passport');
const cors = require("cors");
const userSchema = require('../schemas/userSchema');
const bodyParser = require('body-parser')
const {sendMail} = require('../utils/mailHelper');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

router.use(bodyParser.json());


router.use(
    cors({
        origin: true,
        methods: "GET, POST, PUT, DELETE",
        credentials: true
    })
)

router.get("/login/success", async (req,res) => {
    if (req.user) {
        const reqUser = await userSchema.findOne({email: req.user.emails[0]['value']})
        console.log(reqUser)
        // console.log(req.user)
        if (reqUser) {
            res.status(200).json({
                error: false,
                message: "Successfully logged in",
                user: req.user
            })
        } else {
            res.status(200).json({
                error: false,
                message: "Profile incomplete",
                user: req.user
            })
        }
    } else {
        res.status(200).json({
            error: true,
            message: "Not authorized"
        });
    }
})

router.post("/update/:age", async (req,res) => {
    // const reqUser = await userSchema.findOne({email: req.user.emails[0]['value']})
    // console.log(reqUser)
    // console.log(req.body)
    // console.log(req.body)
    const {age} = req.params
    console.log(req.body)
    const {user} = req.body
    console.log(age)
    console.log(user)
    let splitUsername = user.name.split(" ");
    let token = ""
    if (splitUsername.length <= 1) {
        token += splitUsername[0][0]
    } else {
        token += (splitUsername[0][0] + splitUsername[1][0])
    }

    token += String(age)
    token += String(Math.round(Math.random() * 1000))
    const newUser = new userSchema({
        email: user.email,
        username: user.name,
        age: age,
        token: token 
    })

    await newUser.save()


    await sendMail(user.email, "Your code", "Your code is: " + token)
    return res.status("200").json({
        error: false,
        message: "User authorized successfully"
    })

})

router.get("/login/failed", async (req,res) => {
    res.status(401).json({
        error: true,
        message: "login failed"
    })
})

router.get(
    "/google/callback", 
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed"
    })
)

router.get('/google', passport.authenticate("google", ["profile", "email"]));

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
})

module.exports = router