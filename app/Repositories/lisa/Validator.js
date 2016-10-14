'use strict';
var co = require('co');

class Validator {

  constructor(options) {
    this.sequelize = options.sequelize;
    this.config = options.config;
    this.project = options.project;
    this.task = options.task;
    this.fileItem = options.fileItem;
    this.newRecordModel = {};
  }

  validationType(model, recordModel) {

    for (let key in recordModel) {
      let Model = this.sequelize.import("../../../models/" + this.project.id + "/" + this.config.NODE_ENV +
        "/" + model);

      let type = Model.tableAttributes[key].type.constructor.key;
      if (['INTEGER', 'BIGINT'].indexOf(type) !== -1) {
        if (recordModel[key] == '' || recordModel[key] == null) {
          // TODO::will be check if don't required
          delete recordModel[key];
        } else {
          recordModel[key] = Number(recordModel[key]);
        }
      }
    }

    return recordModel;
  }

  belongsToCheck(keyModel, mappers, modelName, recordModel) {
    // record model always get new
    var i =0;

    this.newRecordModel = recordModel;

    for (var key in keyModel) {

      if (keyModel[key].target_table != null) {

        var searchKey = this.builderSearchKey(keyModel, mappers, modelName, key);

        var objectSearch = this.hasRootSearch(searchKey, this.sequelize, keyModel, key);

        var searchCriteria = {};

        searchCriteria[objectSearch.searchKey] = recordModel[keyModel[key].source_column];

        if (recordModel[keyModel[key].source_column] && searchCriteria[objectSearch.searchKey]) {

          var columnFk = keyModel[key].source_column;

          let createdModel = this.foreignKeySearch(objectSearch.foreignKeyModel, searchCriteria).next().value;

          this.newRecordModel[columnFk] = createdModel;
        }

      }

    }

    const record1 = this.buildRecord(this.newRecordModel);

    return record1;

  }

  buildRecord(record) {
    return co(function *(){
      for (var key in record) {
        if (typeof record[key].then == 'function') {
          const created = yield Promise.resolve(record[key]);
          record[key] = Number(created.object.toJSON().id);
        }
      }
      return record;
    });
  }

  finishCallback(i, keyModel) {
    return Object.keys(keyModel).length === i;
  }

  * foreignKeySearch(foreignKeyModel, searchCriteria, recordModel) {

    const model = yield foreignKeyModel.findOrCreate({
        where: searchCriteria,
        defaults: {}
      })
      .spread((object, created) => {
        return {object, created};
      })
      // .catch((err) => {
      //   return {err, searchCriteria};
      // })

    return model;
  }

  builderSearchKey(keyModel, mappers, modelName, key) {
    let searchKey;
    for (let keyMapper in mappers) {

      if (keyMapper === modelName) {

        let mapperModel = mappers[keyMapper];
        for (var keyColumn in mapperModel) {

          if (keyColumn === keyModel[key].source_column) {
            searchKey = mapperModel[keyColumn];
          }
        }
      }
    }
    return searchKey;
  }

  hasRootSearch(searchKey, sequelize, keyModel, key) {
    if (searchKey && searchKey.hasOwnProperty("rootSearch")) {
      var foreignKeyModel = sequelize.import("../../../models/" + this.project.id + "/" +
        this.config.NODE_ENV + "/" +
        searchKey['rootSearch']);
      searchKey = searchKey['column'];

    } else {
      var foreignKeyModel = sequelize.import("../../../models/" + this.project.id + "/" +
        this.config.NODE_ENV + "/" +
        keyModel[key].target_table);

    }

    return {foreignKeyModel, searchKey};
  }
}

module.exports = Validator;
