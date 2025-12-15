import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, UserCog } from 'lucide-react';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { getUsers, createUser, updateUser, deleteUser, updateUserRole } from '@/api/usersApi';
import { User, CreateUserDto, UpdateUserDto, TableColumn } from '@/types';
import { getErrorMessage, formatDate } from '@/utils/helpers';
import { USER_ROLE_LABELS, USER_ROLES } from '@/utils/constants';

export const Users = () => {
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'USER',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        const updateData: UpdateUserDto = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        await updateUser(selectedUser.id, updateData);
        success('Usuario actualizado correctamente');
      } else {
        await createUser(formData);
        success('Usuario creado correctamente');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleRoleSubmit = async (newRole: string) => {
    if (!selectedUser) return;
    try {
      await updateUserRole(selectedUser.id, newRole);
      success('Rol actualizado correctamente');
      setIsRoleModalOpen(false);
      loadUsers();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      return;
    }
    try {
      await deleteUser(user.id);
      success('Usuario eliminado correctamente');
      loadUsers();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rol',
      render: (user) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {USER_ROLE_LABELS[user.role]}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha de Creación',
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleChangeRole(user)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Cambiar rol"
          >
            <UserCog className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-2 text-gray-600">Gestiona los usuarios del sistema</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={users} />
      </div>

      {/* Modal Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {!selectedUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={USER_ROLES.USER}>{USER_ROLE_LABELS.USER}</option>
              <option value={USER_ROLES.CLIENT_ADMIN}>
                {USER_ROLE_LABELS.CLIENT_ADMIN}
              </option>
              <option value={USER_ROLES.ADMIN}>{USER_ROLE_LABELS.ADMIN}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedUser ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Change Role */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Cambiar Rol de Usuario"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Selecciona el nuevo rol para <strong>{selectedUser?.name}</strong>
          </p>
          <div className="space-y-2">
            {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleRoleSubmit(key)}
                className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-colors ${
                  selectedUser?.role === key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};