'use strict'

const Schema = use('Schema')

class InstalledProjectSchema extends Schema {

  up () {
    this.table('projects', (table) => {
      // alter installed_project table
      table.bool('installed');
    })
  }

  down () {
    this.table('projects', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = InstalledProjectSchema
