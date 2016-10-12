'use strict'

const ExecuteLog = use('App/Model/ExecuteLog');
const ExecuteLogRepository = make('App/Repositories/FileItem');

class ExecuteLogController {
  getParamId (request) {
    return {
      task_id: request.param('task_id'),
      project_id: request.param('project_id'),
      file_id: request.param('file_id')
    }
  }

  baseRedirect(project_id) {
    return `/projects/${project_id}/tasks/${task_id}/file_items`;
  }

  findAndToJSON(array, find) {
    for (var i = 0, len = array.length; i < len; i++) {
      (array[i])[find] = JSON.parse((array[i])[find])
    }
    return array
  }

  * index(request, response) {

    const execute_logs = yield ExecuteLog
                                .query()
                                .where('file_item_id', request.param('file_id'))
                                .fetch();

    const responseData = this.getParamId(request);

    responseData.execute_logs = this.findAndToJSON(execute_logs.toJSON(), 'response');

    yield response.sendView('execute_logs.index', responseData)
  }
}

module.exports = ExecuteLogController
