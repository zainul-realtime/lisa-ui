'use strict'

const Schema = use('Schema')

class TasksSchema extends Schema {

  up () {
    this.create('tasks', (table) => {
      table.increments()
      table.string('name')
      table.text('description')
      table.integer('project_id')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('tasks')
  }

}

module.exports = TasksSchema
