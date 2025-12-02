const { OAuth2Client } = require('google-auth-library');
const config = require('../../config');

class GoogleOAuthService {
  constructor() {
    this.client = new OAuth2Client(config.google.clientId);
  }

  async verifyToken(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.google.clientId
      });
      
      const payload = ticket.getPayload();
      
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified
      };
    } catch (error) {
      throw new Error('Token de Google inválido');
    }
  }
}

module.exports = new GoogleOAuthService();