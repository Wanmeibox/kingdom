var express = require('express');
var router = express.Router();
var groupDB = require('./../database/group');
var model = require('./model');

router.get('/getLeaderGroups',async function(req, res, next) {
    var user = model.getUser(req);
    var members = await groupDB.getLeaderGroups(user.id);
    if(members){
        res.send(model.success(members))
    }else{
        res.send(model.error(201))
    }
});

router.get('/getGroupMembers',async function(req, res, next) {
    var id = req.query.groupid;
    if(!id || parseInt(id) != id){
        res.send(model.error(200))
        return;
    }
    var missionlogdate = req.query.missionlogdate;
    if(!missionlogdate){
        missionlogdate = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate();
    }
    var members = await groupDB.getGroupMembers(id,missionlogdate);
    if(members){
        res.send(model.success(members))
    }else{
        res.send(model.error(201))
    }
});

module.exports = router;
