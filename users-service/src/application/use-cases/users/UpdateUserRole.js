class UpdateUserRole {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(id, role) {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
  
      const validRoles = ['ADMIN', 'CLIENT_ADMIN', 'USER'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
      }
  
      return await this.userRepository.updateRole(id, role);
    }
  }
  
  module.exports = UpdateUserRole;