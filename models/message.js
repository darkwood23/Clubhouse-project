const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date_added: { type: Date, required: true }
})

module.exports = mongoose.model("Message", MessageSchema)