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
    origin: "https://viby-alpha.vercel.app",
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

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  initSocket(server);
});
