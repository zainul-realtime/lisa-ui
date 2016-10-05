'use strict'

const Exceptions = use('App/Exceptions');

class TaskRepository {

  static get inject() {
    return ['App/Model/Task'];
  }

  constructor (Task) {
    this.Task = Task;
  }

  * find (id) {
    const task = yield this.Task.find(id);

    if (!task) {
      throw new Exceptions.ApplicationExceptions('Cannot find task with given id', 404)
    }

    return task
  }

  * all () {
    const tasks = yield this.Task.all();

    return tasks
  }

  * create (options) {
    const task = new this.Task();

    task.name = options.name;
    task.description = options.description;
    task.project_id = options.project_id;

    yield task.save()

    if (task.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save task', 500)
    }

    return task
  }

  * update (id, options) {
    const task =  yield this.Task.find(id);

    task.name = options.name;
    task.description = options.description;
    task.project_id = options.project_id;

    yield task.save();

    return task
  }

  * delete (id) {

    const task = yield this.Task.find(id);

    yield task.delete();

    if (!task.isDeleted()) {
      throw new Exceptions.ApplicationException('Unable to delete task', 500)
    }

    return true
  }
}

module.exports = TaskRepository
