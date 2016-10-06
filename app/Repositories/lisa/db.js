'use strict';

class DB {
  setORM(Sequelize) {
    return (new Sequelize(
      process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        logging: false,
        define: {
          timestamps: false
        }
      }))
  }


}

module.exports = DB;
