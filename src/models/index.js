const Sequelize = require('sequelize');
const pg = require('pg');
const config = require('../config/config');
const user = require('./user.model');
const token = require('./token.model');
const file = require('./file.model');
const enterprise = require('./enterprise.model');
const employee = require('./employee.model');

pg.defaults.ssl = false;

const sequelize = new Sequelize(config.postgres.url, {
  dialect: 'postgres',
  ssl: false,
  // dialectOptions: { 
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },
});

const models = {
  User: user(sequelize, Sequelize),
  Token: token(sequelize, Sequelize),
  File: file(sequelize, Sequelize),
  Enterprise: enterprise(sequelize, Sequelize),
  Employee: employee(sequelize, Sequelize),
};

models.Token.belongsTo(models.User);
models.File.belongsTo(models.User);
models.Enterprise.belongsTo(models.User);
models.Employee.belongsTo(models.User);

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };