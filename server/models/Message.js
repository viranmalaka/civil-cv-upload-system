var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    contactNo: String,
    message: String,
});
mongoose.model('Message', MessageSchema);

module.exports = mongoose.model('Message');