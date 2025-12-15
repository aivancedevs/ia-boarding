class CreateClient {
    constructor(clientRepository) {
      this.clientRepository = clientRepository;
    }
  
    async execute(clientData) {
      const existingClient = await this.clientRepository.findByEmail(clientData.email);
      if (existingClient) {
        throw new Error('Client with this email already exists');
      }
  
      return await this.clientRepository.create(clientData);
    }
  }
  
  module.exports = CreateClient;