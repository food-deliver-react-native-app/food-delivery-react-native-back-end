const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function startServer(app) {
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
module.exports = startServer;
