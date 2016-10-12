'use strict'
const ExecuteLogRepository = make('App/Repositories/ExecuteLog');
const ExecuteLog = exports = module.exports = {}

ExecuteLog.makeLog = function* (data) {
  
  yield ExecuteLogRepository.create(data);
}
