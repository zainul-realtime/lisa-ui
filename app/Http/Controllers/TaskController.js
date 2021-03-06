'use strict'

const Task = use('App/Model/Task');
const FileItem = use('App/Model/FileItem');
const TaskRepository = make('App/Repositories/Task');
const FilteItemRepository = make('App/Repositories/FileItem')
const Helpers = use('Helpers');
var fs = require('fs');

class TaskController {
  getProjectId (request) {
    return request.param('project_id');
  }

  baseRedirect(project_id) {
    return `/projects/${project_id}/tasks`;
  }

  * uploadAndMove(requestFile, response, dir, storagePath) {

    // var dir = './storage/tasks';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const fileUpload = requestFile;

    const fileName = this.generateName(fileUpload.extension());

    yield fileUpload.move(Helpers.storagePath(storagePath), String(fileName));

    if (!fileUpload.moved()) {
      response.badRequest(fileUpload.errors())
      return
    }

    return fileUpload;
  }

  generateName(extention) {
    return String(new Date().getTime()) + '&' + String(Math.floor(Math.random()*10000)) +'.'+ extention;
  }

  * index(request, response) {
    const tasks = yield Task.query().where('project_id', request.param('project_id')).fetch();

    yield response.sendView('tasks.index',
      {
        tasks: tasks.toJSON(),
        project_id: this.getProjectId(request)
      })
  }

  * download(request, response) {
    const task = yield TaskRepository.find(request.param('id'));

    const taskyaml = task.toJSON().yaml.split('/')[task.toJSON().yaml.split('/').length-1];

    response.attachment(Helpers.storagePath('tasks/'+taskyaml, taskyaml));
  }

  * create(request, response) {
    yield response.sendView('tasks.create', {project_id: this.getProjectId(request)} )
  }

  * store(request, response) {
    const postData = request.only('name', 'description', 'yaml');

    const requestFile = request.file('yaml', {
        maxSize: '2mb',
        allowedExtensions: ['yml', 'yaml']
    })

    const yaml = yield this.uploadAndMove(requestFile, response, './storage/tasks', 'tasks');

    postData.yaml = yaml.uploadPath()
    postData.project_id = this.getProjectId(request);

    const created = yield Task.create(postData)

    if (created.toJSON().id) {
      for (var i = 0; i < request.file('file_items[]').length; i++) {
        yield this.storeFileItem(request, response, i, created.toJSON().id);
      }
    }

    response.redirect(this.baseRedirect(postData.project_id));
  }

  * storeFileItem(request, response, i, task_id) {
    const postData = {};

    const requestFile = request.file('file_items[]', {
        maxSize: '2mb',
        allowedExtensions: ['csv']
    })[i];

    const file_csv = yield this.uploadAndMove(requestFile, response, './storage/file_items', 'file_items');

    postData.task_id = task_id;
    postData.name = (request.file('file_items[]')[i]).file.name.split('.')[0];
    postData.files = file_csv.uploadPath();

    return yield FileItem.create(postData);
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

      const requestFile = request.file('yaml', {
          maxSize: '2mb',
          allowedExtensions: ['yml', 'yaml']
      })

      const yaml = yield this.uploadAndMove(requestFile, response, './storage/tasks', 'tasks');

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
