import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLE_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/helpers';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-gray-600">Información de tu cuenta</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Rol</p>
                <p className="text-gray-900">{USER_ROLE_LABELS[user.role]}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-gray-900">{formatDateTime(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};