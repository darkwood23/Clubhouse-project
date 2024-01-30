const express = require("express")
const router = express.Router()

const message_controller = require("../controllers/messageController")
const user_controller = require("../controllers/userController")

// Message Controllers
app.get("/message", message_controller.index)

app.get("/message/create", message_controller.message_create_get)
app.post("/message/create", message_controller.message_create_post)

app.get("/message/id/delete", message_controller.message_delete_get)
app.post("message/id/delete", message_controller.message_delete_post)

app.get("/message/id/update", message_controller.message_update_get)
app.post("message/id/update", message_controller.message_update_post)

module.exports = router