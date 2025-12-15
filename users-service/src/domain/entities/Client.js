class Client {
    constructor({
      id,
      name,
      description,
      email,
      phone,
      address,
      status,
      createdAt,
      updatedAt,
      users,
      projects,
    }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.email = email;
      this.phone = phone;
      this.address = address;
      this.status = status;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.users = users;
      this.projects = projects;
    }
  
    isActive() {
      return this.status === 'ACTIVE';
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        email: this.email,
        phone: this.phone,
        address: this.address,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        users: this.users,
        projects: this.projects,
      };
    }
  }
  
  module.exports = Client;