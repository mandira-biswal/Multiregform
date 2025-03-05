// Import required modules
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");


// Connect to the MongoDB database (without deprecated options)
mongoose.connect("mongodb://localhost:27017/yourdb")
  .then(() => {
    console.log("Connection successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Import the Register model
const Register = require("./models/registers");

const port = process.env.PORT || 5000;

const imp = express();

// Set the path for static files (e.g., CSS, JS)
const static_path = path.join(__dirname, "public");
imp.use(express.static(static_path));  // Serve static files

// Set the path for views (Handlebars templates)
const template_path = path.join(__dirname, "..", "templates", "views");
imp.set("view engine", "hbs");
imp.set("views", template_path);

// Set the path for partials (Handlebars partials)
const partials_path = path.join(__dirname, "..", "templates", "partials");
hbs.registerPartials(partials_path);  // Register partials

// Middleware to parse incoming request bodies (for POST requests)
imp.use(express.json());
imp.use(express.urlencoded({ extended: true }));

// Route to render the 'in' view (in.hbs)
imp.get("/", (req, res) => {
    res.render("in");  // Renders in.hbs template
});

// Other routes
imp.get("/about", (req, res) => {
    res.render("about");
});

imp.get("/register", (req, res) => {
    res.render("register");
});

imp.get("/shop", (req, res) => {
    res.render("shop");
});

// POST route to handle form submission for registration
imp.post("/register", async (req, res) => {
    // Log the entire body for debugging purposes
    console.log("Received Request Body: ", req.body);

    const { name, email, password, gender, phone, address, confirmpassword } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !gender || !password || !phone || !address || !confirmpassword) {
        return res.status(400).render("register", {
            error: "All fields are required."
        });
    }

    // Validate if passwords match
    if (password !== confirmpassword) {
        return res.status(400).render("register", {
            error: "Passwords do not match."
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).render("register", {
            error: "Please enter a valid email address."
        });
    }

    try {
        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new Register({
            name,
            email,
            password: hashedPassword,  // Store the hashed password
            gender,
            phone,
            address,
        });

        // Save the user to the database
        await newUser.save();

        // Redirect to the register page with success message
        res.status(201).render("register", {
            success: "User registered successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("register", {
            error: "Something went wrong. Please try again later."
        });
    }
});

// Start the server
imp.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});
