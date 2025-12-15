class User {
    constructor({
      id,
      email,
      firstName,
      lastName,
      role,
      status,
      clientId,
      createdAt,
      updatedAt,
      client,
    }) {
      this.id = id;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.role = role;
      this.status = status;
      this.clientId = clientId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.client = client;
    }
  
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  
    isActive() {
      return this.status === 'ACTIVE';
    }
  
    isAdmin() {
      return this.role === 'ADMIN';
    }
  
    isClientAdmin() {
      return this.role === 'CLIENT_ADMIN';
    }
  
    toJSON() {
      return {
        id: this.id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        fullName: this.fullName,
        role: this.role,
        status: this.status,
        clientId: this.clientId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        client: this.client,
      };
    }
  }
  
  module.exports = User;