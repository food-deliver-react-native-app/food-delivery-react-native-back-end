// app.js

const express = require("express");
const app = express();
const config = require("./config");
const cors = require("cors");
const logger = require("./middleware/logger");
const homeRoutes = require("./routes/homeRouters");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use(express.json());
app.use(logger);
app.use(cors());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/categories", categoriesRoutes);
app.use("/cart", cartRoutes);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
