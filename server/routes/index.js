var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('**', function(req, res, next) {
  res.sendfile(require('path').join(__dirname + '/../public/index.html'));
});

module.exports = router;
