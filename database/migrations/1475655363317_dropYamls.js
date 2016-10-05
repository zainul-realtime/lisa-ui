'use strict'

const Schema = use('Schema')

class DropYamlsSchema extends Schema {

  up () {
    this.drop('yamls')
  }

  down () {
  }

}

module.exports = DropYamlsSchema
