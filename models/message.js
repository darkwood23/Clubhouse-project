const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    date_added: { type: Date, required: true }
})

module.exports = mongoose.model("Message", MessageSchema)