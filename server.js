require("env2")(".env");

const mongodbConfig = require("./src/config/mongodb");
const app = require('./app.js');

const PORT = process.env.PORT || 8080;

mongodbConfig
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server has started! " + PORT);
    });
  })
  .catch((err) => console.log(err));
