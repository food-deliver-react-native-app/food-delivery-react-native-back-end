const { prisma, connectDb } = require("../lib/prisma");

exports.addToCart = async (req, res) => {
  try {
    await connectDb();

    const userId = req.user.id;
    const { menuId, quantity = 1, customizations = [] } = req.body;

    if (!menuId) {
      return res.status(400).json({ error: "menuId is required" });
    }

    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { customizations: true } } },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
      cart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { customizations: true } } },
      });
    }

    cart.items = cart.items || [];

    const isSameCustomizations = (a, b) => {
      if (a.length !== b.length) return false;
      const aIds = a.map((c) => c.costumizationId).sort();
      const bIds = b.map((c) => c).sort();
      return JSON.stringify(aIds) === JSON.stringify(bIds);
    };

    const existingItem = cart.items.find(
      (item) =>
        item.menuId === menuId &&
        isSameCustomizations(
          item.customizations.map((c) => c.costumizationId),
          customizations
        )
    );

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
        include: { customizations: true },
      });
      return res
        .status(200)
        .json({ success: "Cart updated", item: updatedItem });
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        menuId,
        quantity,
        customizations: {
          create: customizations.map((c) => ({ costumizationId: c })),
        },
      },
      include: { customizations: true },
    });

    return res
      .status(200)
      .json({ success: "Item added to cart", item: newItem });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return res.status(500).json({ error: "Failed to add to cart" });
  }
};

exports.getCart = async (req, res) => {
  try {
    await connectDb();

    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            menu: true,
            customizations: { include: { costumization: true } }, // include customization details
          },
        },
      },
    });

    if (!cart || !cart.items.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(cart.items);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    return res.status(500).json({ error: "Failed to fetch cart" });
  }
};
exports.deleteCartItem = async (req, res) => {
  try {
    await connectDb();

    const userId = req.user.id;
    const { cartItemId, menuId } = req.body;

    if (!cartItemId) {
      return res.status(400).json({ error: "cartItemId is required" });
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
        ...(menuId ? { menuId } : {}),
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (!menuId) {
      await prisma.cartItemCustomization.deleteMany({
        where: { cartItemId },
      });

      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return res.status(200).json({ success: "Item deleted from cart" });
    }

    if (item.quantity > 1) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: { decrement: 1 } },
      });

      return res
        .status(200)
        .json({ success: "Quantity decreased", item: updatedItem });
    } else {
      await prisma.cartItemCustomization.deleteMany({
        where: { cartItemId },
      });

      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return res.status(200).json({ success: "Item removed from cart" });
    }
  } catch (error) {
    console.error("❌ Error updating/deleting cart item:", error);
    return res.status(500).json({ error: "Failed to update/delete cart item" });
  }
};
