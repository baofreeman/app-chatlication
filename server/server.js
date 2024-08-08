const http = require("http");
const app = require("./app");
require("dotenv").config();
const connect = require("./config/connectdb");

const PORT = process.env.PORT || 5000;
const DATABASE_URI = process.env.DATABASE_URI;

const server = http.createServer(app);
connect(DATABASE_URI);

server.listen(PORT, () => {
  console.log("Server listing PORT", PORT);
});
