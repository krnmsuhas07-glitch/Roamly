const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapasync = require("../utils/wrapasync.js");
const { Validatereview } = require("../middleware.js");
const { isloggedin, isauthor } = require("../middleware.js")


router.delete("/listing/:id/reviews/:reviewId", isloggedin, isauthor, wrapasync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const delreview = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);

}))

router.post("/listings/:id/reviews", isloggedin, Validatereview, wrapasync(async (req, res) => {
    let { id } = req.params;
    const newreview = new Review(req.body);
    const listing = await Listing.findById(id);
    newreview.author = req.user._id;
    console.log(newreview.author);
    await newreview.save();
    listing.reviews.push(newreview);
    await listing.save();
    req.flash("success", "New Review created");
    res.redirect(`/listings/${listing._id}`);
}))

module.exports = router;