'use strict'

const Exceptions = use('App/Exceptions');

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
}

module.exports = FileItemRepository
