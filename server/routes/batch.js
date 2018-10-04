let express = require('express');
let router = express.Router();
let Batch = require('../models/Batch');
let usrVerify = require('./users').verify;

/* GET home page. */
router.get('/', (req, res, next) => {
    Batch.find().exec((err, batches) => {
        if(err) return next(err);
        res.jsonp({batches: batches});
    })
});

router.get('/:id', (req, res, next) => {
    Batch.findById(req.params.id).exec((err, batch) => {
        if(err) return next(err);
        res.jsonp({batch: batch});
    })
});

router.post('/', usrVerify, (req, res, next) => {
    if(req.userType === 'sadmin') {
        Batch.create({
            name: req.body.name,
            passOutYear: req.body.passOutYear
        }, (err, bth) => {
           if(err) return next(err);
           res.jsonp({success: true});
        });
    } else {
        res.jsonp({success: false});
    }
});

router.put('/:id', usrVerify, (req, res, next) => {
    if(req.userType === 'sadmin') {
        Batch.findById(req.params.id, (err, btch) => {
           if(req.body.name) { btch.name = req.body.name }
           if(req.body.passOutYear) { btch.passOutYear = req.body.passOutYear }
           btch.save((err, newBtch) => {
               if(err) return next(err);
               res.jsonp({success: true});
           });
        });
    } else {
        res.jsonp({success: false});
    }
});

router.delete('/:id', usrVerify, (req, res, next) => {
    if(req.userType === 'sadmin') {
        Batch.findByIdAndRemove(req.params.id, (err, bth) => {
            if(err) return next(err);
            res.jsonp({success: true});
        });
    } else {
        res.jsonp({success: false});
    }
});

module.exports = router;
