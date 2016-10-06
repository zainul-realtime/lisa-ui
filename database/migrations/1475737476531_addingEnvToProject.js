'use strict'

const Schema = use('Schema')

class AddingEnvToProjectSchema extends Schema {

  up () {
    this.table('projects', (table) => {
      table.text('env')
    })
  }

  down () {
    this.table('projects', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = AddingEnvToProjectSchema
