const User = require('../../domain/entities/User');
const googleOAuthService = require('../../infrastructure/security/GoogleOAuthService');
const jwtService = require('../../infrastructure/security/JwtService');

class GoogleAuth {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ token }) {
    const googleUser = await googleOAuthService.verifyToken(token);

    let user = await this.userRepository.findByEmail(googleUser.email);

    if (user) {
      if (!user.oauthGoogle) {
        throw new Error('Esta cuenta ya existe con email y contraseña. Por favor inicia sesión normalmente.');
      }
    } else {
      const newUser = new User({
        email: googleUser.email,
        name: googleUser.name,
        password: null,
        oauthGoogle: true
      });

      user = await this.userRepository.create(newUser);
    }

    const authToken = jwtService.generateToken({
      id: user.id,
      email: user.email
    });

    return {
      user: user.toJSON(),
      token: authToken
    };
  }
}

module.exports = GoogleAuth;