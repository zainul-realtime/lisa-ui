'use strict'

const Schema = use('Schema')

class YamlsSchema extends Schema {

  up () {
    this.create('yamls', (table) => {
      table.increments()
      table.text('env')
      table.integer('task_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('yamls')
  }

}

module.exports = YamlsSchema
