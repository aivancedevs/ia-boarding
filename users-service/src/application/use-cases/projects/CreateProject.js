class CreateProject {
    constructor(projectRepository, clientRepository) {
      this.projectRepository = projectRepository;
      this.clientRepository = clientRepository;
    }
  
    async execute(projectData) {
      const client = await this.clientRepository.findById(projectData.clientId);
      if (!client) {
        throw new Error('Client not found');
      }
  
      return await this.projectRepository.create(projectData);
    }
  }
  
  module.exports = CreateProject;