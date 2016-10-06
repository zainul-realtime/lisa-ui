'use strict'

const Exceptions = use('App/Exceptions');
const Transformer = use('App/Repositories/lisa/transformer');
const Validator = use('App/Repositories/lisa/Validator');
const DB = use('App/Repositories/lisa/db');
var SequelizeAuto = require('sequelize-auto');
var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var parse = require('csv-parse/lib/sync');
var async = require('async');
const yaml = require('yamljs');

class FileItemRepository {

  static get inject() {
    return ['App/Model/FileItem'];
  }

  constructor (FileItem) {
    this.FileItem = FileItem;
  }

  * find (id) {
    const fileItem = yield this.FileItem.find(id);

    if (!fileItem) {
      throw new Exceptions.ApplicationExceptions('Cannot find fileItem with given id', 404)
    }

    return fileItem
  }

  * all () {
    const fileItems = yield this.FileItem.all();

    return fileItems
  }

  * create (options) {
    const fileItem = new this.FileItem();

    fileItem.name = options.name;
    fileItem.user_id = options.user_id;
    fileItem.files = options.yaml;
    fileItem.task_id = options.project_id;

    yield fileItem.save()

    if (fileItem.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save fileItem', 500)
    }

    return fileItem
  }

  * update (id, options) {
    const fileItem =  yield this.FileItem.find(id);

    fileItem.name = options.name;
    fileItem.user_id = options.user_id;
    fileItem.files = options.yaml;
    fileItem.task_id = options.project_id;

    yield fileItem.save();

    return fileItem
  }

  * delete (id) {

    const fileItem = yield this.FileItem.find(id);

    yield fileItem.delete();

    if (!fileItem.isDeleted()) {
      throw new Exceptions.ApplicationException('Unable to delete fileItem', 500)
    }

    return true
  }

  * execute(config, task, fileItem, project) {
    let db = new DB();

    let sequelize = db.setORM(Sequelize, config);
    let auto = db.setORM(SequelizeAuto, config);

    var transformer = new Transformer();

    let validation = new Validator({
      sequelize,
      config,
      project,
      task,
      fileItem
    })

    var mappers = yaml.load(task.yaml);

    auto.run(function (err) {
      if (err) throw err;

      var model = fileItem.name;
      var keyModel = auto.foreignKeys[model];

      const StringCsv = fs.readFileSync(fileItem.files);

      const results = parse(StringCsv, {columns: true});

      for (var i = 0; i < results.length; i++) {

        var record = results[i];

        var recordHasValidRelation = validation.belongsToCheck(keyModel, mappers, model, record);

        recordHasValidRelation.then((modelWithForeignKey) => {
          var Model = sequelize.import("../../models/" + project.id + "/" + config.NODE_ENV + "/" + model);

          let validModel = validation.validationType(model, modelWithForeignKey);

          Model.create(validModel)
            .then((savedModel) => {
              console.log(savedModel.toJSON())
            })
            .catch((err) => {
              console.log(err.sql)
              console.log(err.original)
              console.log(err.original.detail)
            });
        }).catch((err) => {
        })
      }
    });
  }
}

module.exports = FileItemRepository
