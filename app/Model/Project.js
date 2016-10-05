'use strict'

const Lucid = use('Lucid')
const Project = use('App/Model/Post')

class Project extends Lucid {

  // * index (request, response) {
  //   const projects = yield Project.all()
  //   yield response.sendView('home', { projects: projects.toJSON() })
  // }

}

module.exports = Project
