var express = require('express');
var router = express.Router();
var missionDB = require('./../database/mission');
var userDB = require('./../database/users');
var model = require('./model');

/* GET users listing. */
router.get('/getMission',async function(req, res, next) {
    var id = req.query.id;
    if(!id || parseInt(id) != id){
        res.send(model.error(200))
        return;
    }
    var mission = await missionDB.getMission(id);
    if(mission){
        res.send(model.success(mission))
    }else{
        res.send(model.error(201))
    }
});

router.get('/getMissions',async function(req, res, next) {
    var id = req.query.userid;
    if(!id || parseInt(id) != id){
        res.send(model.error(200))
        return;
    }
    var missionlogdate = req.query.missionlogdate;
    if(!missionlogdate){
        missionlogdate = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate();
    }
    var user = await userDB.getUser(id);
    console.log(user)
    var mission = await missionDB.getMissions(user,missionlogdate);
    if(mission){
        res.send(model.success(mission))
    }else{
        res.send(model.error(201))
    }
});

router.get('/getMyMissions',async function(req, res, next) {
    var user = model.getUser(req);
    var missionlogdate = req.query.missionlogdate;
    if(!missionlogdate){
        missionlogdate = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate();
    }
    var mission = await missionDB.getMyMissions(user,missionlogdate);
    if(mission){
        res.send(model.success(mission))
    }else{
        res.send(model.error(201))
    }
});

router.get('/getMissionLog',async function(req, res, next) {
    var userid = req.query.userid;
    var missionid = req.query.missionid;
    var missionlogdate = req.query.missionlogdate;
    if(!missionid || parseInt(missionid) != missionid){
        res.send(model.error(200))
        return;
    }
    var user = model.getUser(req);
    var missionlog = {
        missionid:missionid,
        userid:userid,
        missionlogdate:missionlogdate
    }
    if(!missionlog.userid){
        missionlog.userid = user.id;
    }
    
    if(!missionlog.missionlogdate){
        missionlog.missionlogdate = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate();
    }
    var result = {
        missionlog : await missionDB.queryMissionLog(missionlog),
        mission : await missionDB.getMission(missionid)
    }
    missionlog.groupid = result.mission.groupid;
    missionlog.leaderid = result.mission.leaderid;
    if(!result.missionlog){
        await missionDB.createMissionLog(missionlog);
        result.missionlog = await missionDB.queryMissionLog(missionlog);
    }
    result.missionlog.isowner = result.missionlog.userid == user.id;    
    result.missionlog.isleader = result.missionlog.leaderid == user.id;    
    result.srceenshots = await missionDB.getSrceenShots(result.missionlog.id);
    res.send(model.success(result));
});

router.get('/changeMissionLogState',async function(req, res, next) {
    var missionlogid = req.query.missionlogid;
    var state = req.query.state;
    if(!missionlogid || parseInt(missionlogid) != missionlogid){
        res.send(model.error(200))
        return;
    }
    if(!state || parseInt(state) != state){
        res.send(model.error(200))
        return;
    }
    var user = model.getUser(req);
    var result = await missionDB.changeMissionLogState(missionlogid,state);
    res.send(model.success(result));
});

router.get('/addSrceenShots',async function(req, res, next) {
    var missionid = req.query.missionid;
    var missionlogid = req.query.missionlogid;
    var imageids = req.query.imageids;
    console.log(imageids)
    var missionlogdate = req.query.missionlogdate;
    if(!missionid || parseInt(missionid) != missionid){
        res.send(model.error(200))
        return;
    }
    var user = model.getUser(req);
    var srceenshot = {
        missionid:missionid,
        userid:user.id,
        groupid:user.groupid,
        missionlogid:missionlogid,
        imageids:imageids,
        missionlogdate:missionlogdate
    }
    
    if(!srceenshot.missionlogid){
        var missionlogid = await missionDB.createMissionLog(srceenshot);
        if(missionlogid){
            srceenshot.missionlogid = missionlogid;
        }else{
            res.send(model.error(200))
            return;
        }
    }
    var mission = await missionDB.createSrceenShots(srceenshot);
    if(mission){
        res.send(model.success(mission))
    }else{
        res.send(model.error(201))
    }
});

module.exports = router;
