class DeleteClient {
    constructor(clientRepository) {
      this.clientRepository = clientRepository;
    }
  
    async execute(id) {
      const client = await this.clientRepository.findById(id);
      if (!client) {
        throw new Error('Client not found');
      }
  
      return await this.clientRepository.delete(id);
    }
  }
  
  module.exports = DeleteClient;