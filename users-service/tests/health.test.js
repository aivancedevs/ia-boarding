describe('Health Check', () => {
    test('should return healthy status', () => {
      const health = {
        success: true,
        service: 'users-service',
        status: 'healthy',
      };
  
      expect(health.success).toBe(true);
      expect(health.service).toBe('users-service');
      expect(health.status).toBe('healthy');
    });
  });