const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app");
const mongodb = require("../../../src/config/mongodb");

describe("POST /register", () => {
  before((done) => {
    mongodb
      .connect()
      .then(() => done())
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  after((done) => {
    mongodb
      .close()
      .then(() => done())
      .catch((err) => {
        done(err);
      });
  });

  it("OK, creating a new user works", (done) => {
    request(app)
      .post("/user/register")
      .send({ name: "User Test 1", username: "username1", password: "rahasia" })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        expect(body.data).to.contain.property("name");
        expect(body.data).to.contain.property("username");
        expect(body.data).to.contain.property("token");
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, user exist", (done) => {
    request(app)
      .post("/user/register")
      .send({ name: "User Test 1", username: "username1", password: "rahasia" })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });
});
