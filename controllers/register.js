

const handleRegister = (req, res, db, bcrypt) => {
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
    }

    module.exports = {
      handleRegister: handleRegister
    }