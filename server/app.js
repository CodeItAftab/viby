const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./utils/database");
const routes = require("./routes/index");
const { initSocket } = require("./utils/socket");
const morgan = require("morgan");

dotenv.config({
  path: "./.env",
});

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use(routes);

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  initSocket(server);
});
