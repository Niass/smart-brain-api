const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// const saltRounds = 10;
// const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const app = express();
const cors = require('cors');
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

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    req.body.password,
    "$2b$10$tenW4tlKGDSNT7TJQTeLXuMzkJCM/jWquEUB8Na2oSPyEvSNNAGfO",
    function(err, res) {
      // res == true
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    someOtherPlaintextPassword,
    "$2b$10$tenW4tlKGDSNT7TJQTeLXuMzkJCM/jWquEUB8Na2oSPyEvSNNAGfO",
    function(err, res) {
      // res == false
      console.log("second guess", res);
    }
  );

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name } = req.body;
  //   bcrypt.genSalt(saltRounds, function(err, salt) {
  //     bcrypt.hash(password, salt, function(err, hash) {
  //         // Store hash in your password DB.
  //         console.log(hash);
  //     });
  // });
  database.users.push({
    id: "125",
    name,
    email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]); 
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("no such user");
  }
});
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }
  });
  if (!found) {
    console.log(req.body);
    res.status(404).json("no such user");
  }
});

app.listen(3001, () => {
  console.log("app is runnig on port 3000");
});

/**
 *
 * /--> res = this is working
 * /signin --> POST = success/fail
 * /register -- > POST = user
 * /profile/:userId --> GET = user
 * /image --> PUT --> user
 *
 *
 */
