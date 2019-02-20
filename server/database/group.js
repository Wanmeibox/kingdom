var base = require('./base');

module.exports = {
    getGroups : async function(id){
        var sql = 'select * from mission where ID=@ID;';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,{ID:id});
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            var mission = result[0];
            return mission;
        }else{
            return false;
        }
    },
    getLeaderGroups : async function(userid){
        var sql = 'SELECT g.*,(select count(*) from `user` where `user`.groupid = g.id) as usercount,(select count(*) from missionlog where missionstate = 1 and groupid = g.id) as state1 FROM kingdom.`group` g where leaderid = @userid;';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,{userid:userid});
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result;
        }else{
            return false;
        }
    },
    getGroupMembers : async function(groupid,date){
        var sql = 'SELECT *,(select ifnull(min(missionstate),0) from missionlog where userid = u.id and missionlogdate = @date) as state FROM `user` u where u.groupid = @groupid;';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,{groupid:groupid,date:date});
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result;
        }else{
            return false;
        }
    }
};