// app.js
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const config = require("./config");
const cors = require("cors");
const logger = require("./middleware/logger");
const homeRoutes = require("./routes/homeRouters");
const authRoutes = require("./routes/authRoutes");

const prisma = new PrismaClient();

app.use(express.json());
app.use(logger);
app.use(cors());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

async function startServer() {
  try {
    await prisma.$connect(); // ✅ Wait for DB connection
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1); // ❌ Exit if DB can't connect
  }
}

startServer();
