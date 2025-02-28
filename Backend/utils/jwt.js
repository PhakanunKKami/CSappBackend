const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };