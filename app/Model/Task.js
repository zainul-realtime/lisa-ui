'use strict'

const Lucid = use('Lucid')

class Task extends Lucid {

  project () {
    return this.belongsTo('App/Model/Project')
  }
  
}

module.exports = Task
