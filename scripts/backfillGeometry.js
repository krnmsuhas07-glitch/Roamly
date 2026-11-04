
require("dotenv").config();

const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.ACCESS_TOKEN
});

const MONGO_URL = "mongodb://127.0.0.1:27017/roamly";
// Replace ATLASDB_URL with the actual MongoDB URI
// environment variable used in your app.js.

async function backfillGeometry() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        // Find listings without geometry
        const listings = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { geometry: null }
            ]
        });

        console.log(`Found ${listings.length} listings`);

        for (const listing of listings) {

            try {
                const response = await geocodingClient
                    .forwardGeocode({
                        query: `${listing.location}, ${listing.country}`,
                        limit: 1
                    })
                    .send();

                const feature = response.body.features[0];

                if (!feature) {
                    console.log(
                        `Location not found: ${listing.location}`
                    );
                    continue;
                }

                // Save GeoJSON coordinates
                listing.geometry = feature.geometry;

                await listing.save();

                console.log(
                    `Updated: ${listing.title}`,
                    listing.geometry.coordinates
                );

            } catch (error) {
                console.error(
                    `Failed: ${listing.title}`,
                    error.message
                );
            }
        }

        console.log("Migration completed!");

    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

backfillGeometry();
