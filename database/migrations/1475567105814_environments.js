'use strict'

const Schema = use('Schema')

class EnvironmentsSchema extends Schema {

  up () {
    this.create('environments', (table) => {
      table.increments()
      table.text('env')
      table.integer('project_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('environments')
  }

}

module.exports = EnvironmentsSchema
