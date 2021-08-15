const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app");
const mongodb = require("../../../src/config/mongodb");

let token = null;
let id = null;

describe("GET todo by id /", () => {
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

  it("OK, retrive one todo works", (done) => {
    request(app)
      .get(`/todo/${id}`)
      .set({ Authorization: `Bearer ${token}` })
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
