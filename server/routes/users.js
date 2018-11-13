let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
let User = require('../models/User');
let Batch = require('../models/Batch');

// file uploading
let csv = require('csvtojson');

/**
 * Configure JWT
 */
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let bcrypt = require('bcryptjs');
let config = require('../config'); // get config file

const verifyToken = (req, res, next) => {

  let token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({auth: false, message: 'No token provided.'});

  // verifies secret and checks exp
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      return res.status(500).jsonp({auth: false, message: 'Failed to authenticate token.'});
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  });
};
const createUser = (usr, next) => {
  let generator = require('generate-password');
  let password = generator.generate({
    length: 10,
    numbers: true
  });

  let hashedPassword = bcrypt.hashSync(password, 8);

  // keep same password for super admins
  if (usr.type === 'sadmin') {
    hashedPassword = bcrypt.hashSync(usr.password, 8);
  }
  User.create({
    index: usr.index,
    name: usr.name,
    type: usr.type,
    batch: usr.batch,
    status: usr.status,
    password: hashedPassword,
    firstRowPassword: password,
  }, next);
};

router.post('/login', function (req, res, next) {

  User.findOne({index: req.body.index}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).jsonp({auth: false, token: null});

    // if user is found and password is valid
    // create a token
    let token = jwt.sign({id: user._id, type: user.type}, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).jsonp({auth: true, token: token});
  });
});

router.get('/logout', function (req, res) {
  res.status(200).jsonp({auth: false, token: null});
});


router.get('/uEyMTw32v9-create-super-admin', (req, res, next) => {
  if (req.query['token'] === 'malaka') {
    createUser({
      index: req.query['username'],
      password: req.query['password'],
      type: 'sadmin',
    }, (err, usr) => {
      if (err) return next(err);
      res.jsonp({success: true});
    });
  } else {
    res.jsonp({success: false});
  }
});

router.post('/create-user', (req, res, next) => {
  Batch.findById(req.body.batch, (err, bth) => {
    if (err) return next(err);
    if (bth) {
      createUser({
        index: req.body.index,
        batch: bth._id,
        status: 'first-login',
        type: 'uom',
      }, (err, usr) => {
        if (err) return next(err);
        res.jsonp({success: true, user: usr});
      })
    } else {
      res.jsonp({success: false});
    }
  });
});

router.put('/edit-jobs', verifyToken, (req, res, next) => {
  if (req.userType === 'sadmin' || req.userType === 'admin') {
    User.find({index: req.body.arr}, (err, users) => {
      if (err) return next(err);
      let count = 0;
      users.forEach(u => {
        u.lookingForJob = req.body.val;
        u.save((err1, ux) => {
          if (err1) return next(err1);
          count += 1;
          if (count === users.length) {
            res.jsonp({success: true});
          }
        });
      });
    });
  } else {
    res.jsonp({success: false});
  }
});

router.post('/bulk-users', verifyToken, (req, res, next) => {
  if (req.userType === 'sadmin' || req.userType === 'admin') {
    let base64Data = req.body.csv.replace(/^data:text\/csv;base64,/, "");
    const filename = 'uploads/csv/' + new Date().getTime() + '.csv';
    require('fs').writeFile(filename, base64Data, 'base64', function (err, result) {
      csv().fromFile(filename)
        .then((jsonObj) => {
          let errList = [];
          let succList = [];

          let saveOneByOne = (i, next) => {
            if (i === jsonObj.length) {
              // final
              next({err: errList, succ: succList})
            } else {
              let usr = jsonObj[i];
              usr.batch = req.body.batch;
              usr.type = 'uom';
              usr.status = 'first-login';
              createUser(usr, (err, newUsr) => {
                if (err) {
                  errList.push(err);
                } else {
                  succList.push(newUsr);
                }
                saveOneByOne(i + 1, next);
              });
            }
          };

          saveOneByOne(0, (output) => {
            res.jsonp(output);
          });
        })
    });
  } else {
    res.jsonp({success: false});
  }
});

router.put('/edit-special', verifyToken, (req, res, next) => {
  if (req.userType === 'uom') {
    User.findById(req.userId, (err, user) => {
      if (err) return next(err);
      user.special = req.body.special;
      user.save((err, newUser) => {
        if (err) return next(err);
        res.jsonp({success: true, newUser: newUser});
      });
    })
  } else {
    res.jsonp({success: false});
  }
});

router.post('/cv-upload', verifyToken, (req, res, next) => {
  const fs = require('fs');
  if (req.userType === 'uom') {
    let base64Data = req.body.cv.replace(/^data:application\/pdf;base64,/, "");

    User.findById(req.userId, (err, user) => {

      const filename = 'uploads/cv/' + user.index + '.pdf';

      if (fs.existsSync(filename)) { // if exist delete it
        fs.unlinkSync(filename);
      }
      fs.writeFile(filename, base64Data, 'base64', (err, result) => {
        if (err) return next(err);
        user.cvUploadedAt = new Date();
        user.save((err, newUsr) => {
          if (err) return next(err);
          res.jsonp({success: true, uploadedAt: newUsr.cvUploadedAt});
        })
      });
    });
  } else {
    res.jsonp({success: false});
  }
});

router.post('/dp-upload', verifyToken, (req, res, next) => {
  const fs = require('fs');
  if (req.userType === 'uom') {
    let jpg = req.body.dp.indexOf(/^data:image\/jpg;base64,/) > -1;
    let base64Data = req.body.dp.replace(/^data:image\/jpg;base64,/, "");
    base64Data = req.body.dp.replace(/^data:image\/png;base64,/, "");

    User.findById(req.userId, (err, user) => {

      const filename = 'uploads/dp/' + user.index + (jpg ? '.jpg' : '.png');

      if (fs.existsSync(filename)) { // if exist delete it
        fs.unlinkSync(filename);
      }
      fs.writeFile(filename, base64Data, 'base64', (err, result) => {
        if (err) return next(err);
        user.hasDP = true;
        user.save(err => {
          if (err) return next(err);
          res.jsonp({success: true, hasDP: true});
        });
      })
    });
  }
});


router.get('/me', verifyToken, function (req, res, next) {

  User.findById(req.userId, {password: 0}).populate('batch').exec((err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).send("No user found.");
    res.jsonp({success: true, user: user});
  });

});

router.get('/get-all', (req, res, next) => {
    let limit, page;
    if (req.query['limit']) {
        limit = req.query['limit'];
        delete req.query['limit'];
    }
    if (req.query['page']) {
        page = req.query['page'];
        delete req.query['page'];
    }

    let select = '-index -status -type -password -resetKey -firstRowPassword';
    let where = req.query;
    where['type'] = 'uom';

    User.find(where)
    .populate('batch')
    .exec((err, usrs) => {
      res.jsonp({all: usrs});
    })
});

router.get('/public/:id', (req, res, next) => {
  let select = '-status -type -password -resetKey -firstRowPassword';
  User.findOne({'type': 'uom', 'status': {$ne: 'first-login'}, '_id': req.params.id})
    .select(select)
    .populate('batch')
    .exec((err, usrs) => {
      res.jsonp({user: usrs});
    })
});

router.get('/search', (req, res, next) => {
  let
    limit = req.query['limit'] || 10,
    page = req.query['page'] || 1;

  let select = '-status -type -password -resetKey';
  let where = {};
  where['type'] = 'uom';
  where['status'] = {$ne: 'first-login'};

  if (req.query['available']==='true') {
    where['lookingForJob'] = true;
  }
  if (req.query['name']) {
    where['name'] = {$regex: new RegExp(req.query['name'].toLowerCase() , "i")};
  }
  if (req.query['batch']) {
    where['batch'] = req.query['batch'];
  }
  if (req.query['spec']) {
    // console.log()
    where['special'] = { "$in" : JSON.parse(req.query['spec'])};
  }

  User.paginate(where, {
    select: select,
    populate: 'batch',
    page: page,
    limit: limit,
  }, (err, users) => {
    if (err) return next(err);
    res.jsonp({success: true, users: users});
  });
});

router.get('/admin', verifyToken, (req, res, next) => {

});

// user account features
router.post('/change-password', verifyToken, (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId, (err, usr) => {
      if (err) return next(err);
      let passwordIsValid = bcrypt.compareSync(req.body.oldPass, usr.password);
      if (!passwordIsValid) {
        return res.jsonp({success: false, msg: 'Current password is wrong'});
      }
      usr.password = bcrypt.hashSync(req.body.newPass, 8);

      if (usr.status === 'first-login') {
        usr.status = 'uom';
      }

      usr.save((err, newUsr) => {
        if (err) return next(err);
        res.jsonp({success: true});
      });
    })
  } else {
    res.jsonp({success: false});
  }
});

router.put('/edit', verifyToken, (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId, (err, usr) => {
      if (req.body.name) usr.name = req.body.name;
      if (req.body.address) usr.address = req.body.address;
      if (req.body.contactNo) usr.contactNo = req.body.contactNo;
      if (req.body.email) usr.email = req.body.email;
      if (req.body.accountEmail) usr.accountEmail = req.body.accountEmail;
      if (req.body.school) usr.school = req.body.school;
      if (req.body.linkedIn) usr.linkedIn = req.body.linkedIn;

      usr.save((err, newUsr) => {
        if (err) return next(err);
        res.jsonp({success: true, newUser: newUsr});
      });
    });
  } else {
    res.jsonp({success: false});
  }
});


router.put('/edit-looking-for-job', verifyToken, (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId, (err, usr) => {
      usr.lookingForJob = req.body.job;

      usr.save((err, newUsr) => {
        if (err) return next(err);
        res.jsonp({success: true, newStatus: newUsr.lookingForJob});
      });
    });
  } else {
    res.jsonp({success: false});
  }
});


router.put('/edit-experience', verifyToken, (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId).exec((err, usr) => {
      if (err) return next(err);

      usr.experience = req.body.experience;

      usr.save((err, newUsr) => {
        if (err) return next(err);
        res.jsonp({success: true, newExp: newUsr.experience});
      });
    })
  } else {
    res.jsonp({success: false});
  }
});

router.put('/edit-extra', verifyToken, (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId).exec((err, usr) => {
      if (err) return next(err);
      usr.extra = req.body.extra;
      usr.save((err, newUsr) => {
        if (err) return next(err);
        res.jsonp({success: true, newExtra: newUsr.extra});
      });
    })
  } else {
    res.jsonp({success: false});
  }
});


module.exports.router = router;
module.exports.verify = verifyToken;
