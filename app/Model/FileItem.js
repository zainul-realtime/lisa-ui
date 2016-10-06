'use strict'

const Lucid = use('Lucid')

class FileItem extends Lucid {

  task () {
    return this.belongsTo('App/Model/Task')
  }
  
}

module.exports = FileItem
