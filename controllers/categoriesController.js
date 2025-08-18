const { prisma, connectDb } = require("../lib/prisma");

exports.getCategories = async (req, res) => {
  try {
    await connectDb();
    const categories = await prisma.categories.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
