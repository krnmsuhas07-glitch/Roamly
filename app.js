require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const engine = require('ejs-mate');
const methodoverride = require("method-override");
const expresserror = require("./utils/expresserror");
const dburl = process.env.ATLASDB;
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
main().then(() => {
    console.log("Mongo db connected");
}).catch((err) => {
    console.log(err);
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "./public")));
app.engine('ejs', engine);

async function main() {
    await mongoose.connect(dburl);
}

const store = MongoStore.create({
    mongoUrl: dburl,

    collectionName: "sessions_v2",

    crypto: {
        secret: process.env.MONGO_SESSION_SECRET,
    },

    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo session store", err);
});

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};





passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(session(sessionoptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.curruser = req.user || null;
    next();
});


app.use("/", listingRoutes);
app.use("/", reviewRoutes);
app.use("/", userRoutes);

app.all("/{*splat}", (req, res, next) => {
    next(new expresserror(404, "Page not found"));
});

app.use((err, req, res, next) => {
    console.log(err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).render("error.ejs", {
        err
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});