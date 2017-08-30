var express = require('express');
var router = express.Router();
var group = require('./../database/group');
var model = require('./model');

/* GET users listing. */
router.get('/login',async function(req, res, next) {
    res.send('');
});

module.exports = router;
