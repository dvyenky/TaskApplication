const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { sequelize } = require("./models");
const taskRoutes = require("./routes/taskroutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => res.send("Task Manager API is running"));

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
