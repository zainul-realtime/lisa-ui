'use strict'

const Command = use('Command')
const BaseGenerator = require('./Base')
const path = require('path')
const Ioc = require('adonis-fold').Ioc
const Helpers = Ioc.use('Adonis/Src/Helpers')
const i = require('inflect')

class Scaffold extends BaseGenerator {

  constructor () {
    super(Helpers)
  }

  * makeController(name) {
    const entity = this._makeEntityName(name, 'controller', true)
    const toPath = path.join(this.helpers.appPath(), 'Http/Controllers', `${entity.entityPath}.js`)
    const templateOptions = {
      methods: ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'],
      resource: true,
      name: entity.entityName
    }
    yield this._wrapWrite('controller', toPath, templateOptions)
  }

  * makeModel(name) {
    const entity = this._makeEntityName(name, 'model', false, 'singular')
    const table  = this._makeEntityName(name, '', false, 'plural')
    const toPath = path.join(this.helpers.appPath(), 'Model', `${entity.entityPath}.js`)
    const template = 'model'
    const templateOptions = {
      name: entity.entityName,
      table: table.entityName.toLowerCase()
    }

    try {
      yield this.write(template, toPath, templateOptions)
      this._success(toPath);
      this.run('make:migration', [name], {
        create: table.entityName.toLowerCase()
      })
    } catch (e) {
      this._error(e.message)
    }
  }

  * makeRepository(name) {
    const entity = this._makeEntityName(name, 'model', false, 'singular')
    const toPath = path.join(this.helpers.appPath(), 'Repositories', `${entity.entityPath}.js`)
    const template = 'repository'
    const templateOptions = {
      name: entity.entityName,
      lowerName: table.entityName.toLowerCase()
    }
    try {
      yield this.write(template, toPath, templateOptions)
      this._success(toPath);
    } catch (e) {
      this._error(e.message)
    }

  }

  get signature () {
    return 'scaffold {name}'
  }

  get description () {
    return 'Scaffold make easier generate with template'
  }

  * handle (args, options) {
    try {
      const name = args.name
      yield this.makeController(name)
      yield this.makeModel(name)
      this.success('implementation for Scaffold command')
    } catch (e) {
      this._error(e.message)
    }
  }

}

module.exports = Scaffold
