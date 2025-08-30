const { prisma, connectDb } = require("../lib/prisma");

exports.getMenu = async (req, res) => {
  await connectDb();
  const { category, query, limit, id } = req.query;

  try {
    if (id) {
      const menuItem = await prisma.menu.findUnique({
        where: { id: String(id) },
        include: {
          category: true,
          customizations: {
            include: {
              costumizations: true,
            },
          },
        },
      });

      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      const formattedMenuItem = {
        ...menuItem,
        customizations: menuItem.customizations.map((mc) => mc.costumizations),
      };

      return res.status(200).json(formattedMenuItem);
    }

    const where = {};

    if (category) {
      where.categoryId = category;
    }

    if (query) {
      where.OR = [
        { description: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ];
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
      take: limit ? parseInt(limit, 10) : undefined,
    });

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
