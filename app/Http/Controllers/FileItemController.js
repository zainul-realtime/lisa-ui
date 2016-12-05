'use strict'

const FileItem = use('App/Model/FileItem');
const FileItemRepository = make('App/Repositories/FileItem');
const ProjectRepository = make('App/Repositories/Project');
const yaml = require('yamljs');
const Helpers = use('Helpers');
var fs = require('fs');

class FileItemController {
  getParamId (request) {
    return {
      task_id: request.param('task_id'),
      project_id: request.param('project_id')
    }
  }

  baseRedirect(project_id) {
    return `/projects/${project_id}/tasks`;
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

  * uploadAndMove(requestFile, response, dir, storagePath) {

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
    const file_items = yield FileItem
                                .query()
                                .where('task_id', request.param('task_id'))
                                .fetch();

    const project = yield ProjectRepository.find(request.param('project_id'));

    const responseData = this.getParamId(request);
    responseData.file_items = file_items.toJSON()
    responseData.tables = this.listTables(project);

    yield response.sendView('file_items.index', responseData)
  }

  * store(request, response) {
    const postData = {};

    const requestFile = request.file('file_items', {
        maxSize: '2mb',
        allowedExtensions: ['csv']
    });

    const file_csv = yield this.uploadAndMove(requestFile, response, './storage/file_items', 'file_items');

    postData.task_id = request.param('task_id');
    postData.name = request.input('file_name')
    postData.description = request.input('description')
    postData.files = file_csv.uploadPath();

    yield FileItem.create(postData);

    response.redirect('back');
  }

  * download(request, response) {
    const file_item = yield FileItemRepository.find(request.param('id'));

    const filename = file_item.toJSON().files.split('/')[file_item.toJSON().files.split('/').length-1];

    response.attachment(Helpers.storagePath('file_items/'+filename, filename));
  }

  * update(request, response) {
    const updatedData = request.only('name', 'description', 'yaml');

    if (request.file('yaml').file.size && request.file('yaml').file.size !== 0) {

      const yaml = yield this.uploadAndMove(request, response);

      updatedData.yaml = yaml.uploadPath()

    }

    updatedData.project_id = this.getParamId(request);

    const file_item = yield FileItemRepository.update(request.param('id'), updatedData)

    yield response.redirect(this.baseRedirect(updatedData.project_id))
  }

  * destroy(request, response) {
    yield FileItemRepository.delete(request.param('id'));

    response.redirect('back');
  }

  * execute(request, response) {
    const fileItemEager = yield FileItem.query().where('id' ,request.param('id'))
                          .with('task', 'task.project')
                          .fetch();

    const fileItem = fileItemEager.toJSON()[0];

    const task = fileItem.task;

    const project = task.project;

    const config = yaml.load(project.env);

    FileItemRepository.execute(config, task, fileItem, project);

    response.redirect('back')
  }

}

module.exports = FileItemController
