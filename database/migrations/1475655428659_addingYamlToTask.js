'use strict'

const Schema = use('Schema')

class AddingYamlToTaskSchema extends Schema {

  up () {
    this.table('tasks', (table) => {
      table.text('yaml')
    })
  }

  down () {
  }

}

module.exports = AddingYamlToTaskSchema
