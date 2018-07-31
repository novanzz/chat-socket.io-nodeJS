var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/home', function(req, res, next) {
 res.render('home', { title: 'Express',nama : req.session.namaSession });
});

/*router.get('/:nama', function(req, res) {
  res.render('index2', { title: 'Express', nama1 : req.params.nama, nama: req.session.namaSession});
});*/


module.exports = router;
