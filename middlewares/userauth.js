const jwt = require("jsonwebtoken");

function userAuth(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  userAuth,
};
