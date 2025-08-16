const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function connectDb() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

module.exports = { prisma, connectDb };
