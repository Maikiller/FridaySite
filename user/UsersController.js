const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users: users });
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user == undefined) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(pass, salt);

      User.create({ email: email, pass: hash })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.redirect(err);
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user != undefined) {
      // exintindo usuario no email
      //validar senhar
      var correct = bcrypt.compareSync(pass, user.pass);
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/admin/articles")
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req,res)=>{
  req.session.user = undefined
  res.redirect("/")
})

module.exports = router;