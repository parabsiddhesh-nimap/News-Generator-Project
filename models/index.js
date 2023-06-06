const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('crud', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
.then(() => console.log('Connection has been established successfully.'))
.catch(error => console.error('Unable to connect to the database:', error));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.customers = require('./customers')(sequelize,DataTypes);
db.sequelize.sync();

// exports.sequelize = db
module.exports = db;
