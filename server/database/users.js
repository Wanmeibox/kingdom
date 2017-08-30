var base = require('./base');

var users = {}
users.login = async function(user){
    var sql = 'select * from User where UserName = @UserName and Password = @Password;update kingdom.user set lastlogintime = current_timestamp() where UserName = @UserName;';
    var result = await base.execSqlByParam(sql,user);
    if(result.length > 0 && result[0].length > 0){
        return result[0][0];
    }else{
        return false;
    }
}
module.exports = users;