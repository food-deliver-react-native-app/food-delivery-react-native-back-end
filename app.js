// app.js

const express = require("express");
const app = express();
const config = require("./config");
const cors = require("cors");
const logger = require("./middleware/logger");
const homeRoutes = require("./routes/homeRouters");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(logger);
app.use(cors());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
