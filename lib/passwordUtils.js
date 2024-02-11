const bcrypt = require("bcryptjs")

const checkPasswd = (password, hash) => {
    bcrypt.hash(password, 10, async function (err, hashedPasswd) {
        if(err) {
            throw err("Error logging in!");
        } else {
            return hashedPasswd === hash
        }
    })
}

const genPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

module.exports.genPassword = genPassword
module.exports.checkPasswd = checkPasswd