const express = require("express")
const router = express.Router()

const message_controller = require("../controllers/messageController")
const user_controller = require("../controllers/userController")

const {isAdmin, isAuth} = require("../lib/adminCheck")

// router.get("/", (req, res, next) => { 
//     res.redirect("/message" ) 
// } )

// Message Controllers
router.get("/", message_controller.index)

router.get("/message/create", isAuth, message_controller.message_create_get)
router.post("/message/create", isAuth, message_controller.message_create_post)

router.get("/message/id/delete", isAdmin, message_controller.message_delete_get)
router.post("/message/id/delete", isAdmin, message_controller.message_delete_post)

router.get("/message/id/update", isAuth, message_controller.message_update_get)
router.post("/message/id/update", isAuth, message_controller.message_update_post)

// User Controllers

router.get("/log-in", user_controller.log_in_get)
router.post("/log-in", user_controller.log_in_post)

router.get("/sign-up", user_controller.sign_up_get)
router.post("/sign-up", user_controller.log_in_post)

module.exports = router