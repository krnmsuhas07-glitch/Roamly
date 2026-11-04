const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],

        },

        coordinates: {
            type: [Number],

        }
    },
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})
listingSchema.post("findOneAndDelete", async (deletedListing) => {
    if (deletedListing) {
        await Review.deleteMany({
            _id: { $in: deletedListing.reviews }
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema);


// Post middleware: runs after a listing is deleted


module.exports = Listing;

