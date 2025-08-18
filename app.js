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

app.use(express.json());
app.use(logger);
app.use(cors());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/categories", categoriesRoutes);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
