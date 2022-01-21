const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Rocket API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      // url: `http://65.1.43.202/test_dep/v1`
    },
  ],
};

module.exports = swaggerDef;
