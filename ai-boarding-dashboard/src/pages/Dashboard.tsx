import { useEffect, useState } from 'react';
import { Users, Briefcase, FolderKanban, TrendingUp } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getUsers } from '@/api/usersApi';
import { getClients } from '@/api/clientsApi';
import { getProjects } from '@/api/projectsApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/helpers';

export const Dashboard = () => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    clients: 0,
    projects: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [users, clients, projects] = await Promise.all([
        user?.role === 'ADMIN' ? getUsers() : Promise.resolve([]),
        ['ADMIN', 'CLIENT_ADMIN'].includes(user?.role || '')
          ? getClients()
          : Promise.resolve([]),
        getProjects(),
      ]);

      const activeProjects = projects.filter(
        (p) => p.status === 'IN_PROGRESS'
      ).length;

      setStats({
        users: users.length,
        clients: clients.length,
        projects: projects.length,
        activeProjects,
      });
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido, <span className="font-medium">{user?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'ADMIN' && (
          <Card title="Usuarios" value={stats.users} icon={Users} color="blue" />
        )}

        {['ADMIN', 'CLIENT_ADMIN'].includes(user?.role || '') && (
          <Card
            title="Clientes"
            value={stats.clients}
            icon={Briefcase}
            color="green"
          />
        )}

        <Card
          title="Proyectos Totales"
          value={stats.projects}
          icon={FolderKanban}
          color="purple"
        />

        <Card
          title="Proyectos Activos"
          value={stats.activeProjects}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Resumen de Actividad
        </h2>
        <p className="text-gray-600">
          Este es tu panel de control principal. Desde aquí puedes acceder a todas
          las funcionalidades del sistema.
        </p>
      </div>
    </div>
  );
};