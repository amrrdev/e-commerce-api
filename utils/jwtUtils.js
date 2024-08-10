import jwt from "jsonwebtoken";

export const createJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// When a cookie is marked as HttpOnly, it is meant to be accessed only by
// the server through HTTP requests(such as requests to a webpage or an API).
// This restriction prevents the cookie from being accessed or manipulated via JavaScript running in the browser.

export const attachCookiesToResponse = (res, payload) => {
  const token = createJWTToken(payload);
  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    // add signature for cookie to ensure the user does not modify the cookie
    signed: true,
    // Send the cookie only via https
    secure: process.env.NODE_ENV === "production",
  });
};
