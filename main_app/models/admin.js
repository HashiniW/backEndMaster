var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = Schema({

  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  
});

module.exports = mongoose.model('Admin', AdminSchema);
