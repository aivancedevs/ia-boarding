import { useState } from 'react';
import { Menu, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLE_LABELS } from '@/utils/constants';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Menu button for mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role ? USER_ROLE_LABELS[user.role] : ''}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Mi Perfil
              </Link>
              <hr className="my-1" />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};