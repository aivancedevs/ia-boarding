class GetProjectById {
    constructor(projectRepository) {
      this.projectRepository = projectRepository;
    }
  
    async execute(id) {
      const project = await this.projectRepository.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    }
  }
  
  module.exports = GetProjectById;