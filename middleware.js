const expresserror = require("./utils/expresserror");
const listingschema = require("./schema.js");
const reviewschema = require("./reviewschema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const Validate = (req, res, next) => {

    let { error } = listingschema.validate(req.body);

    if (error) {
        const message = error.details
            .map((el) => el.message)
            .join(", ");

        return next(new expresserror(400, message));
    }
    else {
        next();
    }
}
const Validatereview = (req, res, next) => {

    let { error } = reviewschema.validate(req.body);
    console.log(error);
    if (error) {
        const message = error.details
            .map((el) => el.message)
            .join(", ");

        return next(new expresserror(400, message));
    }
    else {
        next();
    }
}
const isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in to access these features");
        return res.redirect("/user/login");
    }

    next();
}
const saveredirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isowner = async (req, res, next) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.curruser._id)) {
        req.flash("failure", "You dont have access to it ");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

const isauthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("failure", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("failure", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports = { Validate, Validatereview, isloggedin, saveredirecturl, isowner, isauthor };