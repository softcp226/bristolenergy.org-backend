// const jwt = require("jsonwebtoken");
// const privatekey = process.env.admin_tokenKey;

// const genToken = (user_id) => {
//   const token = jwt.sign({ user_id }, privatekey);
//   return token;
// };
// // console.log(genToken("929haji98298hahjhj"))
// module.exports = genToken;




const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (userId) => {
  const options = {
    expiresIn: "1h", // token expires in 1 hour
    audience: "myapp",
    issuer: "myapp",
    jwtid: uuidv4(), // add a unique id to the token
  };

  const payload = {
    user_id: userId,
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};


module.exports = generateToken
