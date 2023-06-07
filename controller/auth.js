const jwt = require("jsonwebtoken");
const secretKey = "Siddhesh$Nimap$SecretKey";

function setUser(user_id,name,email,phone,time) {
    return jwt.sign({user_id,name,email,phone},secretKey,{expiresIn:time});
};

function getUsertoken(token) {
    if(!token) return;
    return jwt.verify(token, secretKey);
}


module.exports = { setUser, getUsertoken, secretKey };