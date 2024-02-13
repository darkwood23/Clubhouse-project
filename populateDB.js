#! /usr/bin/env node
require("dotenv").config()
const {genPassword} = require("./lib/passwordUtils")

console.log(
    'This script populates some test messages and users to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
// const userArgs = process.argv.slice(2);

const Message = require("./models/message")
const User = require("./models/user")

const messages = []
const users = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.LOG_IN;

main().catch((err) => console.log(err));

function todayDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); 
  let yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today
}

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createMessages();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function messageCreate(index, text, author) {
  const message = new Message({ 
    text: text,
    author: author,
    date_added: todayDate()
  });
  await message.save();
  messages[index] = message;
  console.log(`Added message by ${author}`);
}

async function userCreate(index, first_name, second_name, username, password, admin) {
  const user = new User({
    first_name: first_name,
    second_name: second_name,
    user_joined: todayDate(),
    username: username,
    password: genPassword(password),
    admin: admin
  })
  await user.save()
  console.log(`Added user: ${username}`)
  users[index] = user
}

async function createMessages() {
  console.log("Adding messages");
  await Promise.all([
    messageCreate(0, "Hello, how are you?", users[0]),
    messageCreate(1, "I'm fine thank you.", users[1]),
    messageCreate(2, "The code is: IH7777", users[2]),
  ]);
}

async function createUsers() {
  console.log("Adding users")
  await Promise.all([
    userCreate(0, "Simon", "Riley", "CaptainZ", process.env.SIMON_PASSWD, true),
    userCreate(1, "Soap", "MacTavish", "SniperEA", process.env.SOAP_PASSWD, false),
    userCreate(2, "Butcher", "Hengry", "Admin", process.env.BUTCHER_PASSWD, true)
  ])
  console.log(users)
}