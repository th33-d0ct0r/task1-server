const router = require('express').Router();
const cors = require('cors')
const userSchema = require('../schemas/userSchema');

router.use(
    cors({
        origin: true,
        methods: "GET, POST, PUT, DELETE",
        credentials: true
    })
)

router.post('/singup', async (req,res) => {
    const {username, age, email, password} = req.body
    const foundUser = await userSchema.findOne({email: email});
    if (foundUser) {
        return res.status(403).json({
            error: true,
            message: "User already exists."
        })
    }

    if (!username || !age || !email || !password) {
        return res.status(403).json({
            error: true,
            message: "Please enter all credentials."
        })
    }

    let splitUsername = username.split(" ");
    let token = ""
    if (splitUsername.length <= 1) {
        token += splitUsername[0][0]
    } else {
        token += (splitUsername[0][0] + splitUsername[1][0])
    }

    token += String(age)
    token += String(Math.round(Math.random() * 1000))

    const newUser = new userSchema({
        email: email,
        username: username,
        age: age,
        password: password,
        token: token 
    })
    console.log(newUser)
    await newUser.save();

    return res.status(200).json({
        error: false,
        message: "Successfully created user",
        user: req.user
    })
})

module.exports = router