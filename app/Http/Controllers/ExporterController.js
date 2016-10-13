'use strict'

const ExporterRepository = make('App/Repositories/Exporter');
const ProjectRepository = make('App/Repositories/Project');
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

  * sqlEditor(request, response) {
    yield response.sendView('exporter.editor',{
      project_id: this.getProjectId(request)
    })
  }

  * runSql(request, response) {
    const postData = request.only('query');

    const project = yield ProjectRepository.find(request.param('project_id'));

    console.log(this.validateNonSelect(postData.query))

    if (this.validateNonSelect(postData.query)) {

      yield response.sendView('exporter.editor',{
        project_id: this.getProjectId(request),
        query: postData.query
      })

    }else {

      const config = yaml.load(project.toJSON().env);

      const data = yield ExporterRepository.run(config, postData.query);

      yield response.sendView('exporter.editor',{
        project_id: this.getProjectId(request),
        data: data,
        column: this.buildColumn(data[0]),
        query: postData.query
      })
    }
  }

}

module.exports = ExporterController
