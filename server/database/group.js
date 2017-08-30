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
    }
};