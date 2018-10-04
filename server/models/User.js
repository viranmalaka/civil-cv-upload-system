var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    index: {type: String, unique: true},
    batch: {type: mongoose.Schema.Types.ObjectId, ref: 'Batch'},
    name: String,
    address: String,
    contactNo: [String],
    email: [String],
    accountEmail : String,
    school: [
        {
            name: String,
            from: Number,
            to: Number
        }
    ],
    experience: [
        {
            firm: String,
            from: Number,
            to: Number,
            position: String,
            present: Boolean
        }
    ],
    extra: [String],
    currentlyWorking: {
        firm: String,
        from: Number,
        position: String,
    },
    status: String,
    type: String,  // admin, sadmin, uom
    cvUploadedAt: Date,
    hasDP: Boolean,
    lookingForJob: Boolean,
    password: String,
    resetKey: String,
    firstRowPassword: String,
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');