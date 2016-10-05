'use strict'

const Exceptions = use('App/Exceptions');

class Project {

  static get inject() {
    return ['App/Model/Project'];
  }

  constructor (Project) {
    this.Project = Project;
  }

  * find (id) {
    const project = yield this.Project.find(id);

    if (!project) {
      throw new Exceptions.ApplicationExceptions('Cannot find project with given id', 404)
    }

    return project
  }

  * all () {
    const projects = yield this.Project.all();

    return projects
  }

  * create (options) {
    const project = new this.Project();

    project.name = options.name;
    project.description = options.description;

    yield project.save()

    if (project.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save project', 500)
    }

    return project
  }

  * update (id, options) {
    const project =  yield this.Project.find(id);

    project.name = options.name;
    project.description = options.description;

    yield project.save();

    return project
  }

  * delete (id) {

    const project = yield this.Project.find(id);

    yield project.delete();

    if (!project.isDeleted()) {
      throw new Exceptions.ApplicationException('Unable to delete project', 500)
    }

    return true
  }
}
