class User {
    constructor({ id, email, password, name, oauthGoogle = false, createdAt, updatedAt }) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.name = name;
      this.oauthGoogle = oauthGoogle;
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt || new Date();
    }
  
    toJSON() {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
        oauthGoogle: this.oauthGoogle,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
  
  module.exports = User;