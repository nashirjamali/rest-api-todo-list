const mongoose = require("mongoose");

const NODE_ENV = process.env.NODE_ENV;
const host = process.env.MONGO_HOST;
const name = process.env.MONGO_NAME;
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASSWORD;

function connect() {
  return new Promise((resolve, reject) => {
    const connectString =
      user && pass
        ? `mongodb://${user}:${pass}@${host}:27017/${name}`
        : `mongodb://${host}:27017/${name}`;
    mongoose
      .connect(connectString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res, err) => {
        if (err) return reject(err);
        resolve();
      });
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
