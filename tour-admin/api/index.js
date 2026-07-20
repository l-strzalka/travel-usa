const bootstrap = require('../dist/main').default;

module.exports = async (req, res) => {
  const app = await bootstrap();
  return app(req, res);
};
