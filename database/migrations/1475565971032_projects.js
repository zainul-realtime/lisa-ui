'use strict'

const Schema = use('Schema')

class ProjectsSchema extends Schema {

  up () {
    this.create('projects', (table) => {
      table.increments()
      table.string('name')
      table.text('description')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('projects')
  }

}

module.exports = ProjectsSchema
