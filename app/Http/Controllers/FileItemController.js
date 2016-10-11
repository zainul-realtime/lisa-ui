'use strict'

const FileItem = use('App/Model/FileItem');
const FileItemRepository = make('App/Repositories/FileItem');
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

  * index(request, response) {
    const file_items = yield FileItem
                                .query()
                                .where('task_id', request.param('task_id'))
                                .fetch();

    const responseData = this.getParamId(request);
    responseData.file_items = file_items.toJSON()

    yield response.sendView('file_items.index', responseData)
  }

  * store(request, response) {
    const postData = request.only('name', 'description', 'yaml');

    const yaml = yield this.uploadAndMove(request, response);

    postData.yaml = yaml.uploadPath()
    postData.project_id = this.getParamId(request);

    yield FileItem.create(postData)

    response.redirect(this.baseRedirect(postData.project_id));
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

    yield response.redirect(this.baseRedirect(request.param('project_id')))
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
