const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("./utils/rateLimiter");
const routes = require("./routes");

const app = express();


app.use(cors({
  origin: 'https://stroyeadminpanel.onrender.com',
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(rateLimiter);

app.use("/api", routes);
app.set('trust proxy', true);

const db = require("./models");

db.sequelize
    .sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err);
    });

module.exports = app;
