class CreateUser {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(userData) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
  
      return await this.userRepository.create(userData);
    }
  }
  
  module.exports = CreateUser;