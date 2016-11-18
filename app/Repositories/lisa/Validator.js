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
          delete recordModel[key];
        } else {
          recordModel[key] = Number(recordModel[key]);
        }
      }else {
        if (recordModel[key] == '' || recordModel[key] == null) {
          if (Model.tableAttributes[key].allowNull == false)
            delete recordModel[key];
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

      var abc = keyModel[key];

      if (keyModel[key].target_table != null) {

        var searchKey = this.builderSearchKey(keyModel, mappers, modelName, key);

        var objectSearch = this.hasRootSearch(searchKey, this.sequelize, keyModel, key);

        if (objectSearch.hasParent) {
          var listParent = [];
          var i = 0;
          for (var keyRecordModel in recordModel) {
            var parent = {}
            parent.key = key;
            parent.value = recordModel[key +'#'+ i];

            if (parent.value !== undefined) {
              listParent.push(parent)
            }
            i++;
          }

          // find record model that match with key and
          let createdModel = this.foreignKeyModelMultiple(objectSearch.foreignKeyModel, listParent).next().value;

        } else {

          var searchCriteria = {};

          searchCriteria[objectSearch.searchKey] = recordModel[keyModel[key].source_column];

          if (recordModel[keyModel[key].source_column] && searchCriteria[objectSearch.searchKey]) {

            var columnFk = keyModel[key].source_column;

            let createdModel = this.foreignKeySearch(objectSearch.foreignKeyModel, searchCriteria).next().value;

            this.newRecordModel[columnFk] = createdModel;
          }

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

  * foreignKeyModelMultiple(foreignKeyModel, listSearchCriteria) {

    for (var i=0, len =  listSearchCriteria.length; i < len; i++) {
      var searchBuilder = {}
      searchBuilder[listSearchCriteria[i].key] = listSearchCriteria[i].value;
      var model;

      if (i == 0) {
        model = yield foreignKeyModel.findAll({
          raw:true,
          where: searchBuilder
        }).then((lists) => {
          return lists;
        })
      }else {

        console.log(model)
      }
    }


    return model
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
    var hasParent = undefined;
    if ( searchKey && searchKey.hasOwnProperty("rootSearch")
          && searchKey.hasOwnProperty("hasParent") ) {
      var foreignKeyModel = sequelize.import("../../../models/" + this.project.id + "/" +
        this.config.NODE_ENV + "/" +
        searchKey['rootSearch']);
        hasParent = true;
        searchKey = searchKey['column'];

    } else if (searchKey && searchKey.hasOwnProperty("rootSearch")) {
      var foreignKeyModel = sequelize.import("../../../models/" + this.project.id + "/" +
        this.config.NODE_ENV + "/" +
        searchKey['rootSearch']);
      searchKey = searchKey['column'];

    } else {
      var foreignKeyModel = sequelize.import("../../../models/" + this.project.id + "/" +
        this.config.NODE_ENV + "/" +
        keyModel[key].target_table);

    }

    return {foreignKeyModel, searchKey, hasParent};
  }
}

module.exports = Validator;
