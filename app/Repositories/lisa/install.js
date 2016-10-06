'use strict';

class Install {
  constructor(options) {
    this.exec = options.exec;
  }

  * setupDependecies(config, project) {
    yield this.exec('npm install -g sequelize-auto');
    yield this.exec('npm install -g pg pg-hstore');
    return yield this.exec('sequelize-auto -o "./models/'+ project.id +'/' + config.NODE_ENV +
      '" -d ' + config.DB_NAME +
      ' -h ' + config.DB_HOST +
      ' -u ' + config.DB_USER +
      ' -p ' + config.DB_PORT +
      ' -x ' + config.DB_PASSWORD +
      ' -e ' + config.DB_DIALECT);
  }
}

module.exports = Install;
