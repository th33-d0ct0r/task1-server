const mongoose = require("mongoose")
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const userSchema = new mongoose.Schema({
    username: reqString,
    age: {
        type: Number,
        required: true,
        default: 0
    },
    email: reqString,
    token: reqString
})

module.exports = mongoose.model("user", userSchema);