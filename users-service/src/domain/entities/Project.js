class Project {
    constructor({
      id,
      name,
      description,
      status,
      clientId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      client,
    }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.status = status;
      this.clientId = clientId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.client = client;
    }
  
    isActive() {
      return this.status === 'ACTIVE';
    }
  
    isArchived() {
      return this.status === 'ARCHIVED';
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        status: this.status,
        clientId: this.clientId,
        startDate: this.startDate,
        endDate: this.endDate,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        client: this.client,
      };
    }
  }
  
  module.exports = Project;