const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { initSupabase } = require('./infrastructure/database/supabase');
const authRoutes = require('./infrastructure/http/routes/authRoutes');
const errorHandler = require('./infrastructure/http/middlewares/errorHandler');
const { swaggerUi, specs } = require('./infrastructure/http/swagger/swagger');

const app = express();

// Inicializar Supabase
initSupabase();

app.use(helmet());
app.use(cors({
  origin: config.cors.origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth Service API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customSiteTitle: 'Auth Service API',
  customCss: '.swagger-ui .topbar { display: none }'
}));

app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
});

module.exports = app;