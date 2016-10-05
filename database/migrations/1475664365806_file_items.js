'use strict'

const Schema = use('Schema')

class FileItemsSchema extends Schema {

  up () {
    this.create('file_items', (table) => {
      table.increments()
      table.string('name')
      table.text('files')
      table.integer('task_id')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('file_items')
  }

}

module.exports = FileItemsSchema
