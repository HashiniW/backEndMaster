var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = Schema({

  name: { type: String, required: true, unique: true },
  instructor: { type: String, required: true, unique: false },
  isEnable: { type: Boolean, required: true, unique: false },
  
});

module.exports = mongoose.model('Course', CourseSchema);
