'use strict'

const chai = use('chai')
const assert = chai.assert
const Project = use('App/Model/Project')
const ProjectRepository = make('App/Repositories/Project')
const Lucid = use('Lucid')
use('co-mocha')

describe('Unit Test Project Repository', function () {

  afterEach(function * () {
    const Db = use('Database')
    yield Db.truncate('projects')
  })

  it('should save project to the database when all required fields have been passed', function * () {
    const name = 'RealtimeProject';
    const description = 'Realtime Project Description';

    yield ProjectRepository.create({
      name: name,
      description: description,
      env: '/home/url/url'
    })

    const project = yield Project.findBy('name', name);

    assert.equal(project.name, name);
    assert.equal(project.description, description);
  })

})
