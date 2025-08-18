const { prisma } = require("../lib/prisma");

exports.getMenu = async (req, res) => {
  const { category, query } = req.query;

  try {
    const where = {};

    // Filter by category ID
    if (category) {
      where.categoryId = category;
    }

    // Search by name using 'contains' (MongoDB-compatible)
    if (query) {
      where.description = { contains: query, mode: "insensitive" }; // or use name if you add that field
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        category: true,
        customizations: {
          include: {
            costumizations: true,
          },
        },
      },
    });

    // Flatten customizations if needed
    const formattedMenus = menus.map((menu) => ({
      ...menu,
      customizations: menu.customizations.map((mc) => mc.costumizations),
    }));

    res.status(200).json(formattedMenus);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};
