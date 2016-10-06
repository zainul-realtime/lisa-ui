'use strict';

class Install {
  constructor(options) {
    this.hasInstalledDep = options.hasInstalledDep;
    this.installedDep = options.installedDep;
    this.yaml = options.yaml;
    this.exec = options.exec;
    this.fs = options.fs;
  }

  setupDependecies() {
    try {
      this.hasInstalledDep = this.yaml.load(this.installedDep);
    } catch (e) {}

    if (!this.hasInstalledDep) {
      this.exec('npm install -g sequelize-auto').stdout.pipe(process.stdout);
      this.exec('npm install -g pg pg-hstore').stdout.pipe(process.stdout);
      this.exec('sequelize-auto -o "./models/' + process.env.NODE_ENV +
        '" -d ' + process.env.DB_NAME +
        ' -h ' + process.env.DB_HOST +
        ' -u ' + process.env.DB_USER +
        ' -p ' + process.env.DB_PORT +
        ' -x ' + process.env.DB_PASSWORD +
        ' -e ' + process.env.DB_DIALECT,
        function(error, stdout, stderr) {})
      try {
        this.fs.writeFileSync(this.installedDep, "install: true", 'utf8');
      } catch (e) {
        console.log(e)
      }
    }
  }
}

module.exports Install;
