const express = require("express")
const router = express.Router()

const message_controller = require("../controllers/messageController")
const user_controller = require("../controllers/userController")

app.get("/", (req, res, next) => { res.redirect("/log-in" ) } )

// Message Controllers
app.get("/message", message_controller.index)

app.get("/message/create", message_controller.message_create_get)
app.post("/message/create", message_controller.message_create_post)

app.get("/message/id/delete", message_controller.message_delete_get)
app.post("message/id/delete", message_controller.message_delete_post)

app.get("/message/id/update", message_controller.message_update_get)
app.post("message/id/update", message_controller.message_update_post)

// User Controllers

app.get("/log-in", user_controller.log_in_get)
app.post("/log-in", user_controller.log_in_post)

app.get("/sign-up", user_controller.sign_up_get)
app.post("/sign-up", user_controller.log_in_post)

module.exports = router