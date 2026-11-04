
require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.ACCESS_TOKEN
});

const mongo_db = process.env.ATLASDB;

async function initDB() {
    try {
        // Connect first
        await mongoose.connect(mongo_db);
        console.log("MongoDB connected");

        const updatedData = [];

        // Geocode every sample listing
        for (const obj of initdata.data) {

            const response = await geocodingClient.forwardGeocode({
                query: `${obj.location}, ${obj.country}`,
                limit: 1
            }).send();

            const feature = response.body.features[0];

            if (!feature) {
                throw new Error(
                    `Could not find coordinates for ${obj.location}`
                );
            }

            updatedData.push({
                ...obj,

                geometry: feature.geometry,

                owner: "6ade16c64910365bb8d0327b"
            });

            console.log(`Geocoded: ${obj.location}`);
        }

        // Only replace existing data after successful geocoding
        await Listing.deleteMany({});

        await Listing.insertMany(updatedData);

        console.log("All listings initialized successfully!");

    } catch (error) {
        console.error("Initialization failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

initDB();
