const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`🚀 Sukma Portfolio API running on http://localhost:${config.port}`);
  console.log(`📚 Swagger docs: http://localhost:${config.port}/api/docs`);
  console.log(`🌍 Environment: ${config.env}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => console.log('Process terminated'));
});
