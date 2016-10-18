'use strict'

const Schema = use('Schema')

class BoxSchema extends Schema {

  up () {
    this.create('boxes', (table) => {
      table.increments()
      
        
        table.integer('integer_field')
        
      
        
        table.string('string_field', 500)
        
      
        
        table.text('text_field')
        
      
        
        table.float('float_field', 5,2)
        
      
        
        table.decimal('decimal_field', 5,2)
        
      
        
        table.boolean('boolean_field')
        
      
        
        table.date('date_field')
        
      
        
        table.datetime('datetime_field')
        
      
        
        table.time('time_field')
        
      
        
        table.timestamp('timestamp_field')
        
      
        
        table.json('json_field')
        
      
        
        table.jsonb('jsonb_field')
        
      
        
        table.enu('enu_field')
        
      
        
        table.binary('binary_field')
        
      
      table.timestamps()
    })
  }

  down () {
    this.drop('boxes')
  }

}

module.exports = BoxSchema
