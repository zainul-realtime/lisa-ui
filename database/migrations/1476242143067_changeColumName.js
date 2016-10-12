'use strict'

const Schema = use('Schema')

class ChangeColumNameSchema extends Schema {

  up () {
    this.table('execute_logs', (table) => {
      // alter change_colum_name table
      table.renameColumn('proccess', 'process')
    })
  }

  down () {
    this.table('execute_logs', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = ChangeColumNameSchema
