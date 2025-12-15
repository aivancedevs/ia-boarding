import { Home, Users, Briefcase, FolderKanban, LogOut, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  roles: string[];
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: ROUTES.DASHBOARD,
      roles: ['ADMIN', 'CLIENT_ADMIN', 'USER'],
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      path: ROUTES.USERS,
      roles: ['ADMIN'],
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: Briefcase,
      path: ROUTES.CLIENTS,
      roles: ['ADMIN', 'CLIENT_ADMIN'],
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: FolderKanban,
      path: ROUTES.PROJECTS,
      roles: ['ADMIN', 'CLIENT_ADMIN', 'USER'],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">AI Boarding</h1>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};