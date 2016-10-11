'use strict'
const ExecuteLogRepository = make('App/Repositories/ExecuteLog');
const ExecuteLog = exports = module.exports = {}

ExecuteLog.makeLog = function* (data) {
  // this.emitter gives access to the event instance
  yield ExecuteLogRepository.create(data);
}
