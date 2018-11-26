var mongoose = require('mongoose');

var BatchSchema = new mongoose.Schema({
    name: String,
    passOutYear: String,
});
mongoose.model('Batch', BatchSchema);

module.exports = mongoose.model('Batch');
