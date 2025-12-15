class GetProjectsByClient {
    constructor(projectRepository) {
      this.projectRepository = projectRepository;
    }
  
    async execute(clientId) {
      return await this.projectRepository.findByClientId(clientId);
    }
  }
  
  module.exports = GetProjectsByClient;