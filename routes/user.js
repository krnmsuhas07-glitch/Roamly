const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require('passport');
const { saveredirecturl } = require("../middleware.js")

router.get("/user/signup", (req, res) => {
    res.render("./user/signup.ejs");
})

router.post("/user/signup", wrapasync(async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newuser = await new User({ email: email, username: username });
        let registereduser = await User.register(newuser, password);
        req.login(registereduser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Roamly,Explore Places")
            res.redirect("/listings");
        }))

    } catch (e) {
        req.flash("failure", e.message);
        res.redirect("/user/signup")
    }
}))
router.get("/user/login", (req, res) => {
    res.render("./user/login.ejs");
})

router.post(
    "/user/login", saveredirecturl,
    passport.authenticate("local", {
        failureRedirect: "/user/login",
        failureFlash: {
            type: "failure",
            message: "Invalid username or password!"
        }
    }),
    (req, res) => {
        req.flash("success", `Welcome to Roamly! You are logged in ${req.user.username}`);

        const redirectUrl = res.locals.redirectUrl || "/listings";

        delete req.session.redirectUrl;

        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("failure", "You are logged out successfully bye :)");
        res.redirect("/listings");
    })
})

module.exports = router;