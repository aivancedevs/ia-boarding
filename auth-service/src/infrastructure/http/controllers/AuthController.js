const SupabaseUserRepository = require('../../repositories/SupabaseUserRepository');
const RegisterUser = require('../../../application/use-cases/RegisterUser');
const LoginUser = require('../../../application/use-cases/LoginUser');
const GoogleAuth = require('../../../application/use-cases/GoogleAuth');
const GetUserProfile = require('../../../application/use-cases/GetUserProfile');

class AuthController {
  constructor() {
    // No inicializar nada aquí
    this._userRepository = null;
    this._registerUser = null;
    this._loginUser = null;
    this._googleAuth = null;
    this._getUserProfile = null;
  }

  // Getters lazy para inicializar solo cuando se necesitan
  get userRepository() {
    if (!this._userRepository) {
      this._userRepository = new SupabaseUserRepository();
    }
    return this._userRepository;
  }

  get registerUser() {
    if (!this._registerUser) {
      this._registerUser = new RegisterUser(this.userRepository);
    }
    return this._registerUser;
  }

  get loginUser() {
    if (!this._loginUser) {
      this._loginUser = new LoginUser(this.userRepository);
    }
    return this._loginUser;
  }

  get googleAuth() {
    if (!this._googleAuth) {
      this._googleAuth = new GoogleAuth(this.userRepository);
    }
    return this._googleAuth;
  }

  get getUserProfile() {
    if (!this._getUserProfile) {
      this._getUserProfile = new GetUserProfile(this.userRepository);
    }
    return this._getUserProfile;
  }

  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      
      const result = await this.registerUser.execute({ email, password, name });
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await this.loginUser.execute({ email, password });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req, res, next) {
    try {
      const { token } = req.body;
      
      const result = await this.googleAuth.execute({ token });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      
      const user = await this.getUserProfile.execute(userId);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();