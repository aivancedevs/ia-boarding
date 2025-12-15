class UpdateProject {
    constructor(projectRepository) {
      this.projectRepository = projectRepository;
    }
  
    async execute(id, projectData) {
      const project = await this.projectRepository.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
  
      return await this.projectRepository.update(id, projectData);
    }
  }
  
  module.exports = UpdateProject;