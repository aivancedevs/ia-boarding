const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const { getSupabaseClient } = require('../database/supabase');

class SupabaseUserRepository extends UserRepository {
  constructor() {
    super();
    this.supabase = getSupabaseClient();
    this.tableName = 'users';
  }

  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error buscando usuario: ${error.message}`);
    }

    if (!data) return null;

    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      oauthGoogle: data.oauth_google,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    });
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error buscando usuario: ${error.message}`);
    }

    if (!data) return null;

    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      oauthGoogle: data.oauth_google,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    });
  }

  async create(user) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        email: user.email,
        password: user.password,
        name: user.name,
        oauth_google: user.oauthGoogle
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('El email ya está registrado');
      }
      throw new Error(`Error creando usuario: ${error.message}`);
    }

    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      oauthGoogle: data.oauth_google,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    });
  }

  async update(id, userData) {
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password;
    if (userData.name) updateData.name = userData.name;
    if (userData.oauthGoogle !== undefined) updateData.oauth_google = userData.oauthGoogle;

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }

    if (!data) return null;

    return new User({
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      oauthGoogle: data.oauth_google,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    });
  }

  async delete(id) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }

    return true;
  }
}

module.exports = SupabaseUserRepository;