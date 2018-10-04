var mongoose = require('mongoose');

var BatchSchema = new mongoose.Schema({
    name: String,
    passOutYer: Number,
});
mongoose.model('Batch', BatchSchema);

module.exports = mongoose.model('Batch');