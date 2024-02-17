const User = require("../models/user")
const Message = require("../models/message")
const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler");
const { isAdmin } = require("../lib/adminCheck")

function todayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today
}

exports.index = asyncHandler( async (req, res, next ) => {
    const [
        numMessages,
        numUsers,
        allMessages,
    ] = await Promise.all([
        Message.countDocuments({}).exec(),
        User.countDocuments({}).exec(),
        Message.find().exec(),
    ])

    res.render("index", {
        title: "Hacker's Den",
        no_messages: numMessages,
        no_users: numUsers,
        messages: allMessages,
        admin: isAdmin
    })

    // res.send("Hello world")
})

exports.message_create_get = asyncHandler(async (req, res, next ) => {
    res.render("message_form", {
        title: "Message"
    })
})

exports.message_create_post = [
    body("messagetext", "The message can't be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler( async (req, res, next) => {
        const errors = validationResult(req)

        const message = new Message({
            text: req.body.messagetext,
            author: req.user,
            date_added: todayDate()
        })

        if(!errors.isEmpty()) {
            res.render("message_form", {
                title: "Create Message",
                message: message,
                errors: errors.array()
            })
            return
        } else {
            await message.save()
            res.redirect("/")
        }
    })
]

exports.message_delete_get = asyncHandler( async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate("author").exec()

    if (message === null) {
        const err = new Error("Message not found")
        err.status = 404
        return next(err)
    }

    res.render("message_delete", {
        title: "Delete Message",
        message: message
    })
})

exports.message_delete_post = asyncHandler( async (req, res, next) => {
    await Message.findByIdAndDelete(req.body.messageid).exec()
})

exports.message_update_get = asyncHandler( async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate("author").exec()

    if (message === null) {
        const err = new Error("Message not found")
        err.status = 404
        return next(err)
    }

    res.render("message_form", {
        title: "Message Update",
        message: message
    })
})

exports.message_update_post = [
    body("text", "Text must not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler (async (req, res, next) => {
        const errors = validationResult(req)

        const message = new Message({
            text: req.body.text,
            author: req.body.author,
            date_added: req.body.date_added,
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            res.render("message_form", {
                title: 'Update Message',
                message: message,
                errors: errors.array()
            })
            return
        } else {
            await Message.findByIdAndUpdate(req.params.id, message, {})
            res.redirect("/")
        }
    })
]