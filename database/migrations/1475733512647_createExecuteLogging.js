'use strict'

const Schema = use('Schema')

class CreateExecuteLoggingSchema extends Schema {

  up () {
    this.create('execute_logs', (table) => {
      table.increments()
      table.string('status')
      table.text('response')
      table.text('sql')
      table.text('object')
      table.text('data')
      table.text('proccess')
      table.text('exceptions')
      table.integer('file_item_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('execute_logs')
  }

}

module.exports = CreateExecuteLoggingSchema
