const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const expresserror = require("../utils/expresserror");
const wrapasync = require("../utils/wrapasync.js");
const { Validate } = require("../middleware.js");
const { isloggedin } = require("../middleware.js")
const { isowner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../config/cloudconfig.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocodingClient = mbxGeocoding({
    accessToken: process.env.ACCESS_TOKEN
});

const upload = multer({ storage });

// GET all listings
router.get("/listings", wrapasync(async (req, res) => {
    const data = await Listing.find({});
    res.render("./listings/index.ejs", { data });
}));
router.get("/", wrapasync(async (req, res) => {
    const data = await Listing.find({});
    res.render("./listings/index.ejs", { data });
}));

// GET a single listing

router.get("/listings/:id", wrapasync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        throw new expresserror(404, "Listing not found");
    }

    res.render("./listings/show.ejs", {
        listing,
        mapToken: process.env.ACCESS_TOKEN
    });
}));

// CREATE a new listing form (not async, no wrapper needed)
router.get("/listing/new", isloggedin, (req, res) => {


    if (!req.isAuthenticated()) {
        req.flash("failure", "You must be logged in to create new listing");
        return res.redirect("/user/login");
    }
    res.render("./listings/form.ejs");
});

// CREATE a listing
router.post(
    "/listing/new",
    isloggedin,
    upload.single("image"),
    Validate,
    wrapasync(async (req, res) => {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        })
            .send()
        const { location, country } = req.body;

        if (
            typeof location !== "string" ||
            typeof country !== "string" ||
            !location.trim() ||
            !country.trim()
        ) {
            throw new expresserror(400, "Location and country are required");
        }

        if (!req.file) {
            throw new expresserror(400, "Please upload an image");
        }

        if (/^\d+$/.test(location.trim())) {
            throw new expresserror(400, "Location cannot contain only numbers");
        }

        if (/^\d+$/.test(country.trim())) {
            throw new expresserror(400, "Country cannot contain only numbers");
        }

        const newlisting = new Listing(req.body);

        newlisting.owner = req.user._id;

        newlisting.image = {
            filename: req.file.filename,
            url: req.file.path
        };
        newlisting.geometry = response.body.features[0].geometry;

        await newlisting.save();

        req.flash("success", "New listing created");

        res.redirect("/listings");
    })
);



// EDIT listing form
router.get("/listing/:id/edit", isloggedin, isowner, wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new expresserror(404, "Listing not found");
    }
    if (!req.isAuthenticated()) {
        req.flash("failure", "You must be logged in to update a listing");
        return res.redirect("/user/login");
    }

    res.render("./listings/edit.ejs", { listing });
}));

// UPDATE a listing
router.put("/listing/:id", isloggedin, isowner, upload.single("image"), Validate, wrapasync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);


    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body },
        { runValidators: true, new: true }
    );
    if (typeof req.file !== "undefined") {
        listing.image = {
            filename: req.file.filename,
            url: req.file.path
        };
        await listing.save();
    }
    if (!listing) {
        throw new expresserror(404, "Listing not found");
    }
    req.flash("success", "listing updated");

    res.redirect(`/listings/${id}`);
}));

// DELETE a listing
router.delete("/listing/:id", isloggedin, isowner, wrapasync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        throw new expresserror(404, "Listing not found");
    }

    req.flash("failure", "Listing deleted");

    res.redirect("/listings");
}));

// SEARCH for a listing
router.post("/listing/find", wrapasync(async (req, res) => {
    const locationtxt = (
        typeof req.body.location === "string"
            ? req.body.location
            : ""
    ).trim();

    if (!locationtxt) {
        return res.redirect("/listings");
    }

    const safe = locationtxt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const listing = await Listing.findOne({
        location: new RegExp(safe, "i")
    });

    if (!listing) {
        throw new expresserror(404, "No listing found for that location");
    }
    req.flash("success", "listing found");

    res.render("./listings/show.ejs", { listing });
}));

module.exports = router;