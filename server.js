const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const knex = require("knex");
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "ibra",
    password: "",
    database: "smart-brain"
  }
});

const app = express();
const cors = require("cors");
app.use(bodyParser.json());
const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gail.com"
    }
  ]
};

app.use(cors());
app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post("/register",(req, res) => register.handleRegister(req, res, db, bcrypt));

app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db) );

app.listen(3001, () => {
  console.log("app is runnig on port 3000");
});
