'use strict';

class DB {
  setORM(Sequelize, config) {
    return (new Sequelize(
      config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
        dialect: config.DB_DIALECT,
        port: config.DB_PORT,
        host: config.DB_HOST,
        logging: false,
        define: {
          timestamps: false
        }
      }))
  }


}

module.exports = DB;
