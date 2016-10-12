'use strict';

class Install {
  constructor(options) {
    this.exec = options.exec;
  }

  * setupDependecies(config, project) {
    const pwd = '';

    if (config.DB_PASSWORD != null) {
      pwd = ' -x ' + config.DB_PASSWORD;
    }

    console.log('sequelize-auto -o "./models/'+ project.id +'/' + config.NODE_ENV +
      '" -d ' + config.DB_NAME +
      ' -h ' + config.DB_HOST +
      ' -u ' + config.DB_USER +
      ' -p ' + config.DB_PORT +
      pwd +
      ' -e ' + config.DB_DIALECT)

    return yield this.exec('sequelize-auto -o "./models/'+ project.id +'/' + config.NODE_ENV +
      '" -d ' + config.DB_NAME +
      ' -h ' + config.DB_HOST +
      ' -u ' + config.DB_USER +
      ' -p ' + config.DB_PORT +
      pwd +
      ' -e ' + config.DB_DIALECT);
  }
}

module.exports = Install;
