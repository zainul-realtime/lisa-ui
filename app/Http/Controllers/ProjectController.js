'use strict'

const yaml = require('yamljs');
const Project = use('App/Model/Project');
const ProjectRepository = make('App/Repositories/Project');
const Helpers = use('Helpers');
const fs = require('fs');

class ProjectController {

  * index(request, response) {
    const projects = yield Project.all();

    yield response.sendView('projects.index', { projects: projects.toJSON() })
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

  * download(request, response) {
    const project = yield ProjectRepository.find(request.param('id'));

    const projectenv = project.toJSON().env.split('/')[project.toJSON().env.split('/').length-1];

    response.attachment(Helpers.storagePath('projects/'+projectenv, projectenv));
  }

  generateName(extention) {
    return String(new Date().getTime()) + '&' + String(Math.floor(Math.random()*10000)) +'.'+ extention;
  }

  * create(request, response) {
    yield response.sendView('projects.create')
  }

  * store(request, response) {
    const postData = request.only('name', 'description');

    const requestFile = request.file('env', {
        maxSize: '2mb',
        allowedExtensions: ['yml', 'yaml']
    })

    const env = yield this.uploadAndMove(requestFile, response, './storage/projects', 'projects');

    postData.env = env.uploadPath();

    yield Project.create(postData)

    response.redirect('/projects');
  }

  * show(request, response) {
    const project = yield ProjectRepository.find(request.param('id'))

    yield response.sendView('projects.show', { project: project.toJSON() });
  }

  * install(request, response) {

    const project = yield ProjectRepository.find(request.param('id'));

    const config = yaml.load(project.toJSON().env);

    const installed = yield ProjectRepository.install(config, project.toJSON());

    response.redirect('/projects');

  }

  * edit(request, response) {
    const project = yield ProjectRepository.find(request.param('id'))

    yield response.sendView('projects.edit', { project: project.toJSON() })
  }

  * update(request, response) {
    const updatedData = request.only('name', 'description');

    if (request.file('env').file.size && request.file('env').file.size !== 0) {

      const requestFile = request.file('env', {
          maxSize: '2mb',
          allowedExtensions: ['yml', 'yaml']
      })

      const env = yield this.uploadAndMove(requestFile, response, './storage/projects', 'projects');

      updatedData.env = env.uploadPath()

    }

    const project = yield ProjectRepository.update(request.param('id'), updatedData)

    yield response.redirect('/projects')
  }

  * destroy(request, response) {
    yield ProjectRepository.delete(request.param('id'));

    yield response.redirect('/projects')
  }

}

module.exports = ProjectController
