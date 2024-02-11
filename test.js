const { genPassword } = require("./lib/passwordUtils")

const hash = genPassword("hello")

console.log(hash)