const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const connect = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

connect();

// CORS configuration
const corsOptions = {
  origin: "http://127.0.0.1:8080",
  methods: "GET, PUT, POST, DELETE",
};
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.use(errorHandler);
