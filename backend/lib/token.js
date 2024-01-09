import jwt from "jsonwebtoken";

import config from "../config.js";

function createToken(payload) {
  return jwt.sign(payload, config.jwt.secret);
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

export { createToken, verifyToken };
