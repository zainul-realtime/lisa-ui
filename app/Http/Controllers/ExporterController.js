'use strict'

const ExporterRepository = make('App/Repositories/Exporter');
const ProjectRepository = make('App/Repositories/Project');
const fs = require('fs');
const yaml = require('yamljs');

class ExporterController {
  getProjectId (request) {
    return request.param('project_id');
  }

  buildColumn(object) {
    const array = [];

    for(var key in object) {
      array.push(key)
    }

    return array;
  }

  validateNonSelect(query) {
    const splitedQuery = query.split(' ');
    if (splitedQuery[0].toLowerCase() === 'select') {
      return false;
    }else {
      return true;
    }
  }

  removeExtention(array) {
    for (var i = 0; i < array.length; i++) {
      array[i] = array[i].split('.')[0];
    }
    return array;
  }

  listTables(project) {
    const config = yaml.load(project.toJSON().env);

    const files = this.removeExtention(
      fs.readdirSync('./models/'+ project.toJSON()['id'] + '/' + config.NODE_ENV)
    );

    return files;
  }

  * sqlEditor(request, response) {

    const project = yield ProjectRepository.find(request.param('project_id'));

    yield response.sendView('exporter.editor',{
      project_id: this.getProjectId(request),
      tables: this.listTables(project)
    })
  }

  * runSql(request, response) {
    const postData = request.only('query');

    const project = yield ProjectRepository.find(request.param('project_id'));

    if (this.validateNonSelect(postData.query)) {

      yield response.sendView('exporter.editor',{
        project_id: this.getProjectId(request),
        query: postData.query,
        tables: this.listTables(project)
      })

    }else {

      const config = yaml.load(project.toJSON().env);

      const data = yield ExporterRepository.run(config, postData.query);

      yield response.sendView('exporter.editor',{
        project_id: this.getProjectId(request),
        data: data,
        column: this.buildColumn(data[0]),
        query: postData.query,
        tables: this.listTables(project)
      })
    }
  }

}

module.exports = ExporterController
