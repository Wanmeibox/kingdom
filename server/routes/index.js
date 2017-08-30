var express = require('express');
var router = express.Router();
var users = require('./../database/users');
var model = require('./model');
global.sessionMap = new Map();
global.sessionMap.set('hzl',{token:'hzl',user:{username:'hzl',groupid:1,id:1}})
var session_timeout = 1000 * 60 * 60 * 24 * 7;
function guidGenerator() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

router.get('/user/login',async function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.query;
    var login = await users.login(user);
    var timespan = new Date().getTime();
    
    if(login){
        var session = {
            token:guidGenerator(),
            user:login,
            loginTime:timespan,
            timeout:timespan + session_timeout
        }
        global.sessionMap.set(session.token,session);
        delete session.user.password;
        res.send(model.success(session))
    }else{
        res.send(model.error(100))
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var ua = req.headers["user-agent"];
    var isMobile = ((/iphone|ipod|ipad|android/gi).test(ua));
    isMobile = true;
    if(req.session.user){
        res.redirect(isMobile ? 'mobile/main.html' : 'desktop.htm');
    }else{
        res.redirect(isMobile ? 'mobile/login.html' : 'login.htm');
    }
});

module.exports = router;
