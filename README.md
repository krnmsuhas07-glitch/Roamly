Roamly 
Roamly is a full-stack travel and accommodation listing web application where users can explore places, view listing details, and share their experiences through reviews.

🚀 **Live Demo:** [Visit Roamly](https://roamly-gqto.onrender.com)


This project is currently a work in progress. The current version focuses on the core listing, authentication, and review workflows.
🚧 Roamly is just getting started — lots more updates and exciting features are coming soon!

✨ Features
- Explore listings — Browse available travel and accommodation listings.
- Listing details — View descriptions, prices, locations, images, and reviews.
- User authentication — Sign up, log in, and log out securely using Passport.
- Create listings — Authenticated users can add new listings with an image.
- Edit and delete listings — Listing owners can manage their own listings.
- Reviews and ratings — Logged-in users can post reviews and ratings.
- Authorization — Only listing owners can modify their listings, and only review authors can delete their reviews.
- Image uploads — Listing images are stored using Cloudinary.
- Location geocoding and maps — Mapbox converts listing locations into geographic coordinates for map functionality.
- Input validation — Joi validation and server-side error handling help protect application data.
- Session storage and flash messages — MongoDB-backed sessions and feedback messages improve the user experience.
  
🛠️ Tech Stack
Area	Technologies
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Frontend	EJS, CSS, JavaScript
Authentication	Passport.js, passport-local-mongoose
Validation	Joi
Image storage	Cloudinary, Multer
Maps and geocoding	Mapbox
Sessions	express-session, connect-mongo
Templating	EJS, EJS-Mate

📁 Project Structure
Roamly/
├── config/          # Cloudinary configuration
├── init/            # Database initialization and seed data
├── models/          # Mongoose models (Listing, Review, User)
├── public/
│   ├── css/         # Stylesheets
│   ├── images/      # Static images
│   └── js/          # Client-side JavaScript
├── routes/          # Listing, review, and user routes
├── scripts/         # Utility scripts
├── uploads/         # Local upload directory
├── utils/           # Error handling and async utilities
├── views/           # EJS templates
├── app.js           # Express application entry point
├── middleware.js    # Authentication, authorization, and validation
├── schema.js        # Listing validation schema
├── reviewschema.js  # Review validation schema
└── package.json

🤝 Contributing
Roamly is an evolving project. Suggestions, feedback, and contributions are welcome as it grows.
📌 Project Status
In active development. The current release establishes the core full-stack application. More updates, improvements, and features are on the way!
Made with ❤️ while learning and building.
