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
    const shortName = entity.entityName.split('Controller')[0];
    const toPath = path.join(this.helpers.appPath(), 'Http/Controllers', `${entity.entityPath}.js`)
    const templateOptions = {
      methods: ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'],
      resource: true,
      name: entity.entityName,
      shortName: shortName,
      shortNameLower: shortName.toLowerCase()
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
      lowerName: entity.entityName.toLowerCase()
    }
    try {
      yield this.write(template, toPath, templateOptions)
      this._success(toPath);
    } catch (e) {
      this._error(e.message)
    }
  }

  * makeView(name) {
    try {
      const entity = this._makeEntityName(name, 'view', false)
      const table  = this._makeEntityName(name, '', false, 'plural')
      const files = ['index', 'show', 'create', 'edit', 'field'];

      for (var i = 0; i < files.length; i++) {
        const toPath = path.join(this.helpers.viewsPath(),`${entity.entityName.toLowerCase()}s`, `${files[i]}.njk`)
        const template = `view_${files[i]}`
        const templateOptions = {
          extend: 'master'
        }
        yield this._wrapWrite(template, toPath, templateOptions)
      }


    }catch(e) {
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
      yield this.makeRepository(name)
      yield this.makeView(name)
      this.success("Ayee finished build , let's code")
    } catch (e) {
      this._error(e.message)
    }
  }

}

module.exports = Scaffold
