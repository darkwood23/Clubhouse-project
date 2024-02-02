const express = require("express")
const router = express.Router()

const message_controller = require("../controllers/messageController")
const user_controller = require("../controllers/userController")

const {isAdmin, isAuth} = require("../lib/adminCheck")

app.get("/", (req, res, next) => { res.redirect("/message" ) } )

// Message Controllers
app.get("/message", message_controller.index)

app.get("/message/create", isAuth, message_controller.message_create_get)
app.post("/message/create", isAuth, message_controller.message_create_post)

app.get("/message/id/delete", isAdmin, message_controller.message_delete_get)
app.post("message/id/delete", isAdmin, message_controller.message_delete_post)

app.get("/message/id/update", isAuth, message_controller.message_update_get)
app.post("message/id/update", isAuth, message_controller.message_update_post)

// User Controllers

app.get("/log-in", user_controller.log_in_get)
app.post("/log-in", user_controller.log_in_post)

app.get("/sign-up", user_controller.sign_up_get)
app.post("/sign-up", user_controller.log_in_post)

module.exports = router