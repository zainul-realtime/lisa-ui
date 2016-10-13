'use strict'

class ExporterController {

  * sqlEditor(request, response) {
    yield response.sendView('exporter.editor')
  }

}

module.exports = ExporterController
