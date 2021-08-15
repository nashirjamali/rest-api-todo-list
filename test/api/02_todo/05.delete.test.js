const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app");
const mongodb = require("../../../src/config/mongodb");

let token = null;
let id = null;

describe("DELETE todo /", () => {
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
        id = body.data[0]._id;
        expect(res.statusCode).to.equal(200);
        expect(body.data).to.have.lengthOf(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("OK, delete todo works", (done) => {
    request(app)
      .delete(`/todo/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Todo test 2",
        description: "testing for todo",
        time: "2021-08-15 15:34",
      })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        done();
      })
      .catch((err) => done(err));
  });
});
