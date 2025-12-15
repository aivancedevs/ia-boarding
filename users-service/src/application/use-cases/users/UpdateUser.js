class UpdateUser {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(id, userData) {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
  
      if (userData.email && userData.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
          throw new Error('Email already in use');
        }
      }
  
      return await this.userRepository.update(id, userData);
    }
  }
  
  module.exports = UpdateUser;