const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// const gethash=async()=>{
//    const result= await hashPassword("secretadmin1025!")
//    console.log(result)
// }

// gethash()

module.exports = hashPassword;
