'use strict'

const Project = use('App/Model/Project');
const ProjectRepository = make('App/Repositories/Project');

class ProjectController {

  * index(request, response) {
    const projects = yield Project.all();

    yield response.sendView('projects.index', { projects: projects.toJSON() })
  }

  * create(request, response) {
    yield response.sendView('projects.create')
  }

  * store(request, response) {
    const postData = request.only('name', 'description');

    yield Project.create(postData)

    response.redirect('/projects');
  }

  * show(request, response) {
    const project = yield ProjectRepository.find(request.param('id'))

    yield response.sendView('projects.show', { project: project.toJSON() });
  }

  * edit(request, response) {
    const project = yield ProjectRepository.find(request.param('id'))

    yield response.sendView('projects.edit', { project: project.toJSON() })
  }

  * update(request, response) {
    const updatedData = request.only('name', 'description');

    const project = yield ProjectRepository.update(request.param('id'), updatedData)

    yield response.redirect('/projects')
  }

  * destroy(request, response) {
    yield ProjectRepository.delete(request.param('id'));

    yield response.redirect('/projects')
  }

}

module.exports = ProjectController
