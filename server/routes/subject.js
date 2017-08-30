var express = require('express');
var router = express.Router();
var subjectDB = require('./../database/subject');
var model = require('./model');

/* GET users listing. */
router.get('/get',async function(req, res, next) {
    var id = req.query.id;
    if(!id || parseInt(id) != id){
        res.send(model.error(200))
        return;
    }
    var subject = await subjectDB.get(id);
    if(subject){
        res.send(model.success(subject))
    }else{
        res.send(model.error(201,'专题不存在或者已被删除'))
    }
});

//首页轮播图
router.get('/getIndexBanner',async function(req, res, next) {
    var goodsList = await subjectDB.getIndexBanner();
    res.send(model.success(goodsList))
});

//首页专题
router.get('/getIndexSubject',async function(req, res, next) {
    var goodsList = await subjectDB.getIndexSubject();
    res.send(model.success(goodsList))
});

module.exports = router;
