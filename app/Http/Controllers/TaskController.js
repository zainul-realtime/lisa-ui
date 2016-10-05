'use strict'

const Task = use('App/Model/Task');
const TaskRepository = make('App/Repositories/Task');

class TaskController {
  getProjectId (request) {
    return request.param('project_id');
  }

  baseRedirect(project_id) {
    return `/projects/${project_id}/tasks`;
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
    const postData = request.only('name', 'description', 'task_id');

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
    const updatedData = request.only('name', 'description');

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
