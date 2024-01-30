const bcrypt = require("bcryptjs")

const checkPasswd = (password, hash) => {
    bcrypt.hash(password, 10, async function (err, hashedPasswd) {
        if(err) {
            res.send("Error logging in! Please try again.")
            return;
        } else {
            return hashedPasswd === hash
        }
    })
}

const genPassword = (password) => {
    bcrypt.hash(password, 10, async function (err, hashedPasswd) {
        if(err) {
            res.send("Error saving your data! Please try again.")
            return;
        } else {
            return hashedPasswd
        }
    })
}

module.exports.checkPasswd = checkPasswd
module.exports.genPassword = genPassword