# 🎨 Integración con Frontend

Ejemplos de cómo integrar el Auth Service desde tu aplicación frontend.

## 📦 React Example

### 1. Instalar dependencias

```bash
npm install axios @react-oauth/google
```

### 2. Crear servicio de autenticación

```javascript
// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const authService = {
  // Registrar usuario
  register: async (email, password, name) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login con Google
  loginWithGoogle: async (googleToken) => {
    const response = await axios.post(`${API_URL}/auth/google`, {
      token: googleToken
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener token
  getToken: () => localStorage.getItem('token'),

  // Obtener usuario
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null')
};

export default authService;
```

### 3. Componente de Login

```javascript
// src/components/Login.jsx
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import authService from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      window.location.href = '/dashboard'; // O usa React Router
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await authService.loginWithGoogle(credentialResponse.credential);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="divider">O</div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Error con Google')}
      />
    </div>
  );
}

export default Login;
```

### 4. Configurar Google OAuth en el frontend

```javascript
// src/main.jsx o src/index.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = 'tu-google-client-id.apps.googleusercontent.com';

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
```

### 5. Proteger rutas

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function ProtectedRoute({ children }) {
  const token = authService.getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

### 6. Axios interceptor (opcional, recomendado)

```javascript
// src/config/axios.js
import axios from 'axios';
import authService from '../services/authService';

// Agregar token automáticamente a todas las requests
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejar errores 401 (token expirado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔥 Next.js Example

### API Route para proxy

```javascript
// pages/api/auth/[...path].js
export default async function handler(req, res) {
  const { path } = req.query;
  const endpoint = path.join('/');
  
  const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers.authorization && {
        Authorization: req.headers.authorization
      })
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });
  
  const data = await response.json();
  res.status(response.status).json(data);
}
```

## 📱 React Native Example

```javascript
// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Cambiar por tu URL en producción

export const register = async (email, password, name) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name
    });
    
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfile = async () => {
  const token = await AsyncStorage.getItem('token');
  
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};
```

## 🌐 Vanilla JavaScript Example

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Auth Demo</title>
</head>
<body>
    <div id="login-form">
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Contraseña">
        <button onclick="login()">Iniciar Sesión</button>
        <div id="error"></div>
    </div>

    <div id="user-info" style="display: none;">
        <h2>Bienvenido, <span id="user-name"></span></h2>
        <button onclick="logout()">Cerrar Sesión</button>
    </div>

    <script>
        const API_URL = 'http://localhost:3000';

        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    showUserInfo(data.data.user);
                } else {
                    document.getElementById('error').textContent = data.error;
                }
            } catch (error) {
                document.getElementById('error').textContent = 'Error de conexión';
            }
        }

        function showUserInfo(user) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('user-name').textContent = user.name || user.email;
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.reload();
        }

        // Verificar si ya está logueado
        window.addEventListener('load', () => {
            const user = localStorage.getItem('user');
            if (user) {
                showUserInfo(JSON.parse(user));
            }
        });
    </script>
</body>
</html>
```

## 🔐 Tips de Seguridad Frontend

### 1. Almacenamiento del token

```javascript
// ✅ BUENO: En localStorage (simple)
localStorage.setItem('token', token);

// ✅ MEJOR: En httpOnly cookies (más seguro)
// Requiere configurar el backend para enviar cookies
```

### 2. Manejo de token expirado

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. CORS en desarrollo

Si tienes problemas de CORS en desarrollo, asegúrate que el backend tenga:

```javascript
// Backend
app.use(cors({
  origin: 'http://localhost:5173' // Tu puerto de Vite/React
}));
```

## 📚 Recursos útiles

- [React OAuth Google Docs](https://www.npmjs.com/package/@react-oauth/google)
- [Axios Documentation](https://axios-http.com/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

**¿Necesitas más ejemplos?** Abre un issue en el repo.