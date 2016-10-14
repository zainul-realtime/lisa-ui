'use strict'

const Schema = use('Schema')

class ChangeColumNameYamlSchema extends Schema {

  up () {
    this.table('yamls', (table) => {
      table.renameColumn('env', 'data')
    })
  }

  down () {
    this.table('yamls', (table) => {
      // table.renameColumn('data', 'env')
      // opposite of up goes here
    })
  }

}

module.exports = ChangeColumNameYamlSchema
