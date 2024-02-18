const User = require("../models/user")
const { genPassword } = require("../lib/passwordUtils")
const passport = require("passport")

const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")
require("dotenv").config()

const getTime = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today
}

exports.sign_up_get = asyncHandler( async (req, res, next) => {
    res.render("user_sign_up", {
        title: "Sign Up"
    })
} )

exports.sign_up_post = [
    body("first_name", "First name must be atleast 3 characters")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("last_name", "Last name must be atleast 3 characters")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("username", "Username must be atleast 3 characters")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("password", "Password must be atleast 5 characters")
        .trim()
        .isLength({min: 5})
        .escape(),
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req)

        const user = new User({
            first_name: req.body.first_name,
            second_name: req.body.last_name,
            user_joined: getTime(),
            username: req.body.username,
            password: genPassword(req.body.password),
            admin: false
        })

        if(!errors.isEmpty()) {
            res.render("user_sign_up", {
                title: "Sign Up",
                errors: errors.array(),
            })
        } else {
            await user.save()
            res.redirect("/")
        }
    })
]

exports.log_in_get = asyncHandler( async (req, res, next) => {
    res.render("user_log_in", {
        title: "Log In"
    })
})

exports.log_in_post = passport.authenticate('local', { failureRedirect: '/catalog/login-faliure', successRedirect: '/' } )

exports.admin_pass_get = asyncHandler( async (req, res, next) => {
    res.render("admin_form", {
        title: "Code to become an admin:"
    })
})

exports.admin_pass_post = asyncHandler( async ( req, res, next ) => {
    const password = process.env.ADMIN_PASS
    const givenPassword = req.body.admincode
    const userId = req.user._id

    const user = await User.findById(userId)

    const newUser = new User({
        _id: user._id,
        first_name: user.first_name,
        second_name: user.second_name,
        user_joined: user.user_joined,
        username: user.username,
        password: user.password,
        admin: true
    })

    if(password === givenPassword) {
        await User.findByIdAndUpdate(userId, newUser)
        res.redirect("/")
    } else {
        res.redirect("/catalog/login-faliure")
    }
})