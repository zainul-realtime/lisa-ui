'use strict'

const Task = use('App/Model/Task');
const TaskRepository = make('App/Repositories/Task');
const Helpers = use('Helpers');
var fs = require('fs');

class TaskController {
  getProjectId (request) {
    return request.param('project_id');
  }

  baseRedirect(project_id) {
    return `/projects/${project_id}/tasks`;
  }

  * uploadAndMove(request, response) {

    var dir = './storage/projects';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const yaml = request.file('yaml', {
        maxSize: '2mb',
        allowedExtensions: ['yml', 'yaml']
    })
    const fileName = this.generateName(yaml.extension());

    yield yaml.move(Helpers.storagePath('projects'), String(fileName));

    if (!yaml.moved()) {
      response.badRequest(yaml.errors())
      return
    }

    return yaml;
  }

  generateName(extention) {
    return String(new Date().getTime()) + String(Math.floor(Math.random()*10000)) +'.'+ extention;
  }

  * index(request, response) {
    const tasks = yield Task.all();

    yield response.sendView('tasks.index',
      {
        tasks: tasks.toJSON(),
        project_id: this.getProjectId(request)
      })
  }

  * create(request, response) {
    yield response.sendView('tasks.create', {project_id: this.getProjectId(request)} )
  }

  * store(request, response) {
    const postData = request.only('name', 'description', 'yaml');

    const yaml = yield this.uploadAndMove(request, response);

    postData.yaml = yaml.uploadPath()
    postData.project_id = this.getProjectId(request);

    yield Task.create(postData)

    response.redirect(this.baseRedirect(postData.project_id));
  }

  * show(request, response) {
    const task = yield TaskRepository.find(request.param('id'))

    yield response.sendView('tasks.show', { task: task.toJSON() });
  }

  * edit(request, response) {
    const task = yield TaskRepository.find(request.param('id'))

    yield response.sendView('tasks.edit', { task: task.toJSON(), project_id: this.getProjectId(request) })
  }

  * update(request, response) {
    const updatedData = request.only('name', 'description', 'yaml');

    if (request.file('yaml').file.size && request.file('yaml').file.size !== 0) {

      const yaml = yield this.uploadAndMove(request, response);

      updatedData.yaml = yaml.uploadPath()

    }

    updatedData.project_id = this.getProjectId(request);

    const task = yield TaskRepository.update(request.param('id'), updatedData)

    yield response.redirect(this.baseRedirect(updatedData.project_id))
  }

  * destroy(request, response) {
    yield TaskRepository.delete(request.param('id'));

    yield response.redirect(this.baseRedirect(request.param('project_id')))
  }

}

module.exports = TaskController
