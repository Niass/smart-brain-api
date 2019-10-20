const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "ibra",
    password: "",
    database: "smart-brain"
  }
});

// db.select('*').from('users').then(data => {
//   console.log(data);
// });

// const saltRounds = 10;
// const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
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
  const { email, name, password } = req.body;
  const saltRounds = 10;
  //   bcrypt.genSalt(saltRounds, function(err, salt) {
  //     bcrypt.hash(password, salt, function(err, hash) {
  //         // Store hash in your password DB.
  //         console.log(hash);
  //     });
  // });
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'));
    });

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id
    })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("error getting user"));
});
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json("unable to get entries"));
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
