const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app");
const mongodb = require("../../../src/config/mongodb");

let token = null;

describe("GET todo /", () => {
  before((done) => {
    mongodb
      .connect()
      .then(() => done())
      .catch((err) => {
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

  it("OK, login user works", (done) => {
    request(app)
      .post("/user/login")
      .send({ username: "username1", password: "rahasia" })
      .then((res) => {
        const body = res.body;
        token = body.data.token;
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, retrive all todos work", (done) => {
    request(app)
      .get("/todo")
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        expect(body.data).to.have.lengthOf(1);
        done();
      })
      .catch((err) => done(err));
  });
});
