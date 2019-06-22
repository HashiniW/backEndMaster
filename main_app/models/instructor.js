var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InstructorSchema = Schema({

  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  isEnable: { type: Boolean, required: false, unique: false, default: false },
  
});

module.exports = mongoose.model('Instructor', InstructorSchema);
