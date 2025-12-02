const passwordService = require('../../infrastructure/security/PasswordService');
const jwtService = require('../../infrastructure/security/JwtService');

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (user.oauthGoogle) {
      throw new Error('Esta cuenta fue creada con Google. Por favor inicia sesión con Google.');
    }

    const isPasswordValid = await passwordService.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwtService.generateToken({
      id: user.id,
      email: user.email
    });

    return {
      user: user.toJSON(),
      token
    };
  }
}

module.exports = LoginUser;