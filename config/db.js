const Mongoose = require("mongoose");
const localDB =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : "mongodb://localhost:27017/to_do_list";
const asyncHandler = require("express-async-handler");

const connect = asyncHandler(async () => {
  await Mongoose.connect(localDB, {});
  console.log("MongoDB connected");
});

module.exports = connect;
