'use strict'

const Schema = use('Schema')

class AddingColumnUserToLogSchema extends Schema {

  up () {
    this.table('execute_logs', (table) => {
      table.integer('user_id')
    })
  }

  down () {
    this.table('adding_column_user_to_log', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = AddingColumnUserToLogSchema
