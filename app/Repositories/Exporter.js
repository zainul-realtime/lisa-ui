'use strict'

var Sequelize = require('sequelize');
const DB = use('App/Repositories/lisa/db');

class ExporterRepository {

  * run(config, query) {
    let db = new DB();

    let sequelize = db.setORM(Sequelize, config);

    return yield sequelize.query(query, {
      raw: true,
      type: sequelize.QueryTypes.SELECT
    }).then(function(data){
      return data;
    });
  }
}

module.exports = ExporterRepository
