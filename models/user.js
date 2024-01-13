const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    second_name: { type: String, required: true},
    messages: [{ type: Schema.Types.ObjectId, required: true, ref: "Message"}],
    user_joined: { type: Date, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    admin: { type: Boolean, required: true}
})

UserSchema.virtual('full_name').get(function () {
    return `${this.second_name}, ${this.first_name}`
})

UserSchema.virtual('url').get(function() {
    return `/home/users/${this._id}`
})

module.exports = mongoose.model("User", UserSchema)