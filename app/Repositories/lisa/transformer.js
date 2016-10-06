'use strict';

class Transformer {

  constructor() {
    this.prop = []
  }

  // prop = [];

  toModel(options, callback) {
    let record = {};
    let attribute;

    if (options.i === 0) {
      this.prop = [];
      options.output.map((value) => {
        this.prop.push(value);
      })
    } else {
      options.output.map((value, i) => {
        record[this.prop[i]] = value;
      })
    }
    return callback(record)
  }

  readRecords(records, callback) {
    let z = 0;
    let models = [];

    records.forEach((output, i, array) => {
      this.toModel({
        output,
        i
      }, (model) => {
        if (model && Object.getOwnPropertyNames(model).length > 0)
          models.push(model)

        z++;
        if (z === array.length) {
          callback(models);
        }
      })
    })
  }

}


module.exports = Transformer;
