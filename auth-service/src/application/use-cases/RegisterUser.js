const User = require('../../domain/entities/User');
const passwordService = require('../../infrastructure/security/PasswordService');
const jwtService = require('../../infrastructure/security/JwtService');

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password, name }) {
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await passwordService.hash(password);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      oauthGoogle: false
    });

    const createdUser = await this.userRepository.create(user);

    const token = jwtService.generateToken({
      id: createdUser.id,
      email: createdUser.email
    });

    return {
      user: createdUser.toJSON(),
      token
    };
  }
}

module.exports = RegisterUser;