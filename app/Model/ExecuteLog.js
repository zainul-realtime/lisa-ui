'use strict'

const Lucid = use('Lucid')

class ExecuteLog extends Lucid {

  fileItem () {
    return this.belongsTo('App/Model/FileItem')
  }

}

module.exports = ExecuteLog
