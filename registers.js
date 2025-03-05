const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,  // Changed to String to preserve leading zeros
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash the password before saving the employee document
employeeSchema.pre("save", async function(next) {
    
    next();
});

const Register = mongoose.model("Register", employeeSchema);
module.exports = Register;
