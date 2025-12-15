const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mock Login
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ email, password }).value();

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({
      data: {
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + user.role.toLowerCase()
      },
      success: true
    });
  } else {
    res.status(401).json({
      message: 'Credenciales incorrectas',
      success: false
    });
  }
});

// Mock Logout
server.post('/auth/logout', (req, res) => {
  res.json({ success: true });
});

// Wrapper para todas las respuestas
server.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('/auth/')) {
    const originalSend = res.json;
    res.json = function(data) {
      if (Array.isArray(data)) {
        return originalSend.call(this, { data, success: true });
      }
      if (data && !data.data && !data.success) {
        return originalSend.call(this, { data, success: true });
      }
      return originalSend.call(this, data);
    };
  }
  next();
});

// Rutas personalizadas
server.get('/users/clients', (req, res) => {
  const clients = router.db.get('clients').value();
  res.json({ data: clients, success: true });
});

server.get('/users/clients/:id', (req, res) => {
  const client = router.db.get('clients').find({ id: parseInt(req.params.id) }).value();
  res.json({ data: client, success: true });
});

server.get('/users/projects', (req, res) => {
  const projects = router.db.get('projects').value();
  res.json({ data: projects, success: true });
});

server.get('/users/projects/:id', (req, res) => {
  const project = router.db.get('projects').find({ id: parseInt(req.params.id) }).value();
  res.json({ data: project, success: true });
});

server.get('/users/projects/client/:clientId', (req, res) => {
  const projects = router.db.get('projects').filter({ clientId: parseInt(req.params.clientId) }).value();
  res.json({ data: projects, success: true });
});

server.use(router);

server.listen(4000, () => {
  console.log('🚀 Mock API Server running on http://localhost:4000');
});