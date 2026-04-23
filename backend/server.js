require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db"); // 👈 add this

const app = express();

/* ========================
   DB CONNECTION
======================== */
connectDB(); // 👈 call this early

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});