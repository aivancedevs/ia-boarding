const jwt = require('jsonwebtoken');
const config = require('../../config');

class JwtService {
  generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new JwtService();