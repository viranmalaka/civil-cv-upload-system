let express = require('express');
let router = express.Router();
let User = require('../models/User');
let usrVerify = require('./users').verify;

router.get('/firm', (req, res, next) => {
    User.find().distinct('experience.firm').exec((err, firm) => {
        if (err) return next(err);
        res.jsonp({firms: firm});
    })
});

router.put('/firm', usrVerify, (req, res, next) => {
    if (req.userType === 'sadmin') {
        User.find().exec((err, users) => {
            if (err) return next(err);
            users.forEach(u => {
                let updated = false;
                u.experience.forEach(e => {
                    if (e.firm === req.body.oldVal) {
                        e.firm = req.body.newVal;
                        updated = true;
                    }
                });
                if(updated) {
                    u.save();
                }
            });
            res.jsonp({success: true});
        });
    } else {
        res.jsonp({success: false});
    }
});


router.get('/position', (req, res, next) => {
    User.find().distinct('experience.position').exec((err, position) => {
        if(err) return next(err);
        res.jsonp({success: true, positions: position});
    })
});

router.put('/position', usrVerify, (req, res, next) => {
    if (req.userType === 'sadmin') {
        User.find().exec((err, users) => {
            if (err) return next(err);
            users.forEach(u => {
                let updated = false;
                u.experience.forEach(e => {
                    if (e.position === req.body.oldVal) {
                        e.position = req.body.newVal;
                        updated = true;
                    }
                });
                if(updated) {
                    u.save();
                }
            });
            res.jsonp({success: true});
        });
    } else {
        res.jsonp({success: false});
    }
});


router.get('/school', (req, res, next) => {
    User.find().distinct('school.name').exec((err, school) => {
        if(err) return next(err);
        res.jsonp({schools: school});
    })
});

router.put('/school', usrVerify, (req, res, next) => {
    if (req.userType === 'sadmin') {
        User.find().exec((err, users) => {
            if (err) return next(err);
            users.forEach(u => {
                let updated = false;
                u.school.forEach(s => {
                    if (s.name === req.body.oldVal) {
                        s.name = req.body.newVal;
                        updated = true;
                    }
                });
                if(updated) {
                    u.save();
                }
            });
            res.jsonp({success: true});
        });
    } else {
        res.jsonp({success: false});
    }
});

module.exports = router;
