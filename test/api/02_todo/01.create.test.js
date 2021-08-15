const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app");
const mongodb = require("../../../src/config/mongodb");

let token = null;

describe("POST todo /", () => {
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

  it("OK, creating new todo works", (done) => {
    request(app)
      .post("/todo")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Todo test",
        description: "testing for todo",
        time: "2021-08-15 15:34",
      })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        expect(body.data).to.contain.property("name");
        expect(body.data).to.contain.property("description");
        expect(body.data).to.contain.property("time");
        expect(body.data).to.contain.property("status");
        done();
      })
      .catch((err) => done(err));
  });
});
