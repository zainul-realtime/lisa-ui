'use strict'

const FileItem = use('App/Model/FileItem');
const FileItemRepository = make('App/Repositories/FileItem');
const Helpers = use('Helpers');
var fs = require('fs');

class FileItemController {
  getParamId (request) {
    return {
      task_id: request.param('task_id');
      project_id: request.param('project_id');
    }
  }

  baseRedirect(project_id) {
    return `/projects/${project_id}/tasks`;
  }

  * uploadAndMove(request, response) {

    var dir = './storage/getParamIds';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const yaml = request.file('csv', {
        maxSize: '2mb',
        allowedExtensions: ['csv']
    })
    const fileName = this.generateName(yaml.extension());

    yield yaml.move(Helpers.storagePath('getParamIds'), String(fileName));

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
    const file_items = yield FileItem
                                .query()
                                .where('task_id', request.param('task_id'))
                                .fetch();;

    yield response.sendView('file_items.index',
      {
        file_items: file_items.toJSON(),
        project_id: this.getParamId(request).project_id,
        task_id: this.getParamId(request).task_id
      })
  }

  * create(request, response) {
    yield response.sendView('file_items.create', {
      project_id: this.getParamId(request).project_id,
      task_id: this.getParamId(request).task_id
    } )
  }

  * store(request, response) {
    const postData = request.only('name', 'description', 'yaml');

    const yaml = yield this.uploadAndMove(request, response);

    postData.yaml = yaml.uploadPath()
    postData.project_id = this.getParamId(request);

    yield FileItem.create(postData)

    response.redirect(this.baseRedirect(postData.project_id));
  }

  * show(request, response) {
    const file_item = yield FileItemRepository.find(request.param('id'))

    yield response.sendView('file_items.show', { file_item: file_item.toJSON() });
  }

  * edit(request, response) {
    const file_item = yield FileItemRepository.find(request.param('id'))

    yield response.sendView('file_items.edit', { file_item: file_item.toJSON(), project_id: this.getParamId(request) })
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

}

module.exports = FileItemController
