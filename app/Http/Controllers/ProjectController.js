'use strict'

const Project = use('App/Model/Post')

class ProjectController {

  * index(request, response) {
    //
  }

  * create(request, response) {
    yield response.sendView('create')
  }

  * store(request, response) {
    const postData = request.only('name', 'description');
    yield Project.create(postData)
    response.redirect('/');

  }

  * show(request, response) {
    //
  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    //
  }

  * destroy(request, response) {
    //
  }

}

module.exports = ProjectController
