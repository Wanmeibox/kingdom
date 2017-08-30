var base = require('./base');

module.exports = {
    get : async function(id){
        var sql = 'select * from Subject where ID=@ID';
        var result = await base.execSqlByParam(sql,{ID:id});
        if(result.length > 0){
            return result[0];
        }else{
            return false;
        }
    },
    getIndexBanner : async function(){
        var sql = 'SELECT * FROM subject left join image on image.Type = 6 and subject.ID = image.OwnerID where image.ImagePath is not null order by image.isMain desc, image.OrderIndex asc;';
        var result = await base.execSqlByParam(sql,{});
        if(result.length > 0){
            return result;
        }else{
            return [];
        }
    },
    getIndexSubject : async function(){
        var sql = 'SELECT subject.ID,subject.Title,subject.Content,subject.Status,subject.CreateTime,image.ImagePath FROM subject left join (select image.* from image join subject on image.Type = 4 and subject.ID = image.OwnerID order by image.isMain desc, image.OrderIndex asc limit 0,1) as image on subject.ID = image.OwnerID where image.ImagePath is not null order by subject.OrderIndex asc;';
        var result = await base.execSqlByParam(sql,{});
        if(result.length > 0){
            return result;
        }else{
            return [];
        }
    }
}