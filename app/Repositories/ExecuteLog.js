'use strict'

const Exceptions = use('App/Exceptions');

class ExecuteLogRepository {

  static get inject() {
    return ['App/Model/ExecuteLog'];
  }

  constructor (ExecuteLog) {
    this.ExecuteLog = ExecuteLog;
  }

  * find (id) {
    const executeLog = yield this.ExecuteLog.find(id);

    if (!executeLog) {
      throw new Exceptions.ApplicationExceptions('Cannot find executeLog with given id', 404)
    }

    return executeLog
  }

  * all () {
    const executeLogs = yield this.ExecuteLog.all();

    return executeLogs
  }

  * create (options) {
    const executeLog = new this.ExecuteLog();

    executeLog.status = options.status;
    executeLog.response = options.response;
    executeLog.sql = options.sql;
    executeLog.object = options.object;
    executeLog.data = options.data;
    executeLog.process = options.process;
    executeLog.exceptions = options.exceptions;
    // executeLog.user_id = options.user_id;

    yield executeLog.save()

    if (executeLog.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save executeLog', 500)
    }

    return executeLog
  }

  * update (id, options) {
    const executeLog =  yield this.ExecuteLog.find(id);

    executeLog.status = options.status;
    executeLog.response = options.response;
    executeLog.sql = options.sql;
    executeLog.object = options.object;
    executeLog.data = options.data;
    executeLog.process = options.process;
    executeLog.exceptions = options.exceptions;
    // executeLog.user_id = options.user_id;

    yield executeLog.save();

    return executeLog
  }

  * delete (id) {

    const executeLog = yield this.ExecuteLog.find(id);

    yield executeLog.delete();

    if (!executeLog.isDeleted()) {
      throw new Exceptions.ApplicationException('Unable to delete executeLog', 500)
    }

    return true
  }
}

module.exports = ExecuteLogRepository
