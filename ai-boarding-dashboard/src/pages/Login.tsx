import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/helpers';
import { AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Boarding</h1>
          <p className="mt-2 text-gray-600">Dashboard Administrativo</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Información de prueba */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-3">
            Credenciales de prueba:
          </p>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Admin:</span>
              <code className="bg-white px-2 py-1 rounded">admin@aiboarding.com</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Cliente:</span>
              <code className="bg-white px-2 py-1 rounded">cliente@example.com</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Usuario:</span>
              <code className="bg-white px-2 py-1 rounded">usuario@example.com</code>
            </div>
            <p className="mt-2 text-gray-500">Contraseña para todos: <code className="bg-white px-2 py-1 rounded">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};