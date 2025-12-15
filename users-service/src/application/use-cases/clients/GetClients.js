class GetClients {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(filters = {}) {
    return await this.clientRepository.findAll(filters);
  }
}

module.exports = GetClients;