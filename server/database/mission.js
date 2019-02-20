var base = require('./base');

module.exports = {
    getMission : async function(id){
        var sql = 'select mission.*,g.leaderid from mission left join `group` g on groupid = g.id where mission.id=@ID;';
        
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
    createMission : async function(mission){
        var sql = 'INSERT INTO `kingdom`.`mission`(`groupid`,`missionname`,`missiondetail`,`cycletype`,`missionflag`,`createtime`)VALUES(@groupid,@missionname,@missiondetail,@cycletype,default,default);';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,mission);
        }catch(ex){
            console.log(ex)
        }
        if(result){
            return true;
        }else{
            return false;
        }
    },
    createMissionLog : async function(missionlog){
        var sql = 'INSERT INTO `kingdom`.`missionlog`(`missionid`,`userid`,`groupid`,`createtime`,`missionstate`,`missionlogdate`)VALUES(@missionid,@userid,@groupid,default,default,@missionlogdate);';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,missionlog);
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result.insertId;
        }else{
            return false;
        }
    },
    queryMissionLog : async function(missionlog){
        var sql = 'select missionlog.*,g.leaderid from `missionlog` left join `group` g on g.id = groupid where userid = @userid and missionid = @missionid and missionlogdate = @missionlogdate;';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,missionlog);
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result[0];
        }else{
            return false;
        }
    },
    createSrceenShots : async function(srceenshot){
        var sqlTemplate = 'INSERT INTO `kingdom`.`screenshot`(`userid`,`groupid`,`missionid`,`missionlogid`,`imageid`,`createtime`)VALUES(@userid,@groupid,@missionid,@missionlogid,@imageid,default);';
        var sql = '';
        var imageids = srceenshot.imageids.split(',');
        imageids.forEach(function(imageid){
            if(!imageid){
                return;
            }
            srceenshot.imageid = imageid;
            sql += base.sqlParse(sqlTemplate,srceenshot);
        })
        var result;
        try{
            result = await base.execSql(sql);
        }catch(ex){
            console.log(ex)
        }
        if(result){
            return true;
        }else{
            return false;
        }
    },
    getSrceenShots: async function(missionlogid){
        var sql = 'select * from `kingdom`.`screenshot` where missionlogid = @missionlogid;';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,{missionlogid:missionlogid});
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result;
        }else{
            return false;
        }
    },
    getMissions1 : async function(groupid){
        var sql = 'select * from mission';
        if(groupid){
            sql += ' where groupid=@groupid;'
        }
        var result;
        try{
            result = await base.execSqlByParam(sql,{groupid:groupid});
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result;
        }else{
            return false;
        }
    },
    getMissions : async function(user,date){
        var sql = 'SELECT mission.*,ifnull(missionlog.missionstate,0) as missionstate,ifnull(missionlog.missionlogdate,date(@date)) as missionlogdate FROM mission left join missionlog on mission.id = missionlog.missionid and missionlogdate = @date and missionlog.userid = @id where mission.groupid=@groupid;';
        user.date = date;
        var result;
        try{
            result = await base.execSqlByParam(sql,user);
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result;
        }else{
            return false;
        }
    },
    getMyMissions : async function(user,date){
        var sql = 'SELECT mission.*,ifnull(missionlog.missionstate,0) as missionstate,ifnull(missionlog.missionlogdate,date(@date)) as missionlogdate FROM mission left join missionlog on mission.id = missionlog.missionid and missionlogdate = @date and missionlog.userid = @id where mission.groupid=@groupid;';
        user.date = date;
        var result;
        try{
            result = await base.execSqlByParam(sql,user);
        }catch(ex){
            console.log(ex)
        }
        delete user.date;
        if(result){
            return result;
        }else{
            return false;
        }
    },
    changeMissionLogState : async function(missionlogid,state){
        var sql = 'update missionlog set missionstate = @state where id = @id;';
        
        var result;
        try{
            result = await base.execSqlByParam(sql,{id:missionlogid,state:state});
        }catch(ex){
            console.log(ex)
        }
        
        if(result){
            return result;
        }else{
            return false;
        }
    }
}