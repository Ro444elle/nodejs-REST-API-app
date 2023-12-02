const request = require("supertest");

const app = require("../app");

describe("Login Controller", () => {
  it("should return status code 200, a token, and a user object with email and subscription fields", async () => {
    const res = await request(app).post("/users/login").send({
      email: "margaretaa@gmail.com",
      password: "test123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "Success");
    expect(res.body).toHaveProperty("code", 200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("email");
    expect(res.body.data).toHaveProperty("subscription");
    expect(typeof res.body.data.email).toBe("string");
    expect(typeof res.body.data.token).toBe("string");
    expect(typeof res.body.data.subscription).toBe("string");
  });
});
