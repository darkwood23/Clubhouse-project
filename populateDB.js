#! /usr/bin/env node
require("dotenv").config()
const bcrypt = require("bcryptjs")

console.log(
    'This script populates some test messages and users to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Message = require("./models/message")
const User = require("./models/user")

const messages = []
const users = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createMessages();
  await createUsers();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function messageCreate(index, text, author, date_added) {
  const message = new Message({ 
    text: text,
    author: author,
    date_added: date_added
  });
  await message.save();
  messages[index] = message;
  console.log(`Added message by ${author}`);
}

async function userCreate(index, first_name, second_name, messages, user_joined, username, password, admin) {
  const user = new User({
    first_name: first_name,
    second_name: second_name,
    messages: messages,
    user_joined: user_joined,
    username: username,
    password: password,
    admin: admin
  })
  await user.save()
  users[index] = user
  console.log(`Added user: ${title}`)
}

async function createMessages() {
  console.log("Adding genres");
  await Promise.all([
    messageCreate(0, "Hello, how are you?", users[0], todayDate),
    messageCreate(1, "I'm fine thank you.", users[1], todayDate),
    messageCreate(2, "The code is: IH7777", users[2], todayDate),
  ]);
}

async function createUsers() {
  console.log("Adding Categories")
  await Promise.all([
    userCreate(0, "Simon", "Riley", [messages[0]], todayDate, "CaptainZ", () =>  getHashedPasswd(process.env.SIMON_PASSWD), true),
    userCreate(1, "Soap", "MacTavish", [messages[1]], todayDate, "SniperEA", () => getHashedPasswd(process.env.SOAP_PASSWD), false),
    userCreate(2, "Butcher", "Hengry", [messages[2]], todayDate, "Admin", () => getHashedPasswd(process.env.BUTCHER_PASSWD), true)
  ])
}

function todayDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); 
  let yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today
}

function getHashedPasswd(passwd) {
  bcrypt.hash(passwd, 10, async function(err, hashedPasswd) {
    if (err) {
      console.error(err)
      return
    }
    return hashedPasswd
  })
}