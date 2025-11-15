const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔐 Secret key for signing token
const SECRET_KEY = "mysecretkey";

// 🧍 Hardcoded Example User
const sampleUser = {
  id: 1,
  username: "testuser",
  password: "password123"
};

// ---------------------------------------
// 1️⃣ LOGIN ROUTE - RETURNS JWT TOKEN
// ---------------------------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // simple check
  if (username !== sampleUser.username || password !== sampleUser.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT token
  const token = jwt.sign(
    { id: sampleUser.id, username: sampleUser.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// ---------------------------------------
// 2️⃣ JWT VERIFICATION MIDDLEWARE
// ---------------------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

// ---------------------------------------
// 3️⃣ PROTECTED ROUTE
// ---------------------------------------
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user
  });
});

// ---------------------------------------
// Start Server
// ---------------------------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
