'use strict'

const Schema = use('Schema')

class AddingDescriptionColumnSchema extends Schema {

  up () {
    this.table('file_items', (table) => {
      // alter adding_description_column table
      table.text('description')
    })
  }

  down () {
    this.table('file_items', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = AddingDescriptionColumnSchema
