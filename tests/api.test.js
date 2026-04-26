import request from "supertest";
import app from "../app.js";

describe("API Health & Config", () => {
  it("should return system status on /api/v1/status", async () => {
    const response = await request(app).get("/api/v1/status");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("systemStatus", "All Good!");
  });

  it("should load metrics on /status-monitor (express-status-monitor)", async () => {
    const response = await request(app).get("/status");
    // Status monitor renders an HTML page
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
  });

  it("should correctly handle unauthenticated /api/v1/me requests", async () => {
    const response = await request(app).get("/api/v1/me");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
