class UpdateClient {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id, clientData) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    if (clientData.email && clientData.email !== client.email) {
      const existingClient = await this.clientRepository.findByEmail(clientData.email);
      if (existingClient) {
        throw new Error('Email already in use');
      }
    }

    return await this.clientRepository.update(id, clientData);
  }
}

module.exports = UpdateClient;