// const jwt = require("jsonwebtoken");
// const privatekey = process.env.admin_tokenKey;

// const verifyToken = (req, res, next) => {
//   // console.log(req.body);
//   try {
//     jwt.verify(req.body.token, privatekey);
//     next();
//   } catch (err) {
//     res.status(403).json({
//       error: true,
//       errMessage: `${err.message},Please login again to access this api`,
//     });
//   }
// };
// module.exports = verifyToken;




const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const options = {
      audience: "myapp",
      issuer: "myapp",
    };

    const decoded = jwt.verify(req.body.token, secretKey, options);
    // return decoded.user_id;
    // console.log(decoded.user_id);
    next();
  } catch (err) {
    // return null;
    res.status(403).json({
      error: true,
      errMessage: `${err.message},Please login again to access this api`,
    });
  }
};

module.exports = verifyToken; 
