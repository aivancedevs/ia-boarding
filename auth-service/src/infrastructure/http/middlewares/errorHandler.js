const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: err.message
      });
    }
  
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }
  
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
      success: false,
      error: err.message || 'Error interno del servidor'
    });
  };
  
  module.exports = errorHandler;