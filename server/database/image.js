var base = require('./base');

module.exports = {
    get : async function(id){
        var sql = 'select * from Image where ID=@ID';
        var result = await base.execSqlByParam(sql,{ID:id});
        if(result.length > 0){
            return result[0];
        }else{
            return false;
        }
    },
    getAll : async function(type,ownerid){
        var sql = 'select * from Image where OwnerID = @OwnerID and Type = @Type order by OrderIndex asc';
        var result = await base.execSqlByParam(sql,{Type:type,OwnerID:ownerid});
        if(result.length > 0){
            return result;
        }else{
            return [];
        }
    }
}