const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/UserDetails", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connection successfully");
}).catch((err) => {
  console.error("Connection failed:", err);
});
