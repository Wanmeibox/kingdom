var express = require('express');
var router = express.Router();
var https = require('https');
var crypto = require('crypto');
var model = require('./model');

global.wechat = {
    appId:'wx4a084aadc651a9d6',
    secret:'5796bf2d09619eb6cad4ebbca07f533d'
}
var httpsGet = function(url){
    return new Promise(function (resolve, reject) {
        var body = '';
        var req = https.request(url, function(res) {
            res.on('data',function(d){
                body += d;
            }).on('end', function(){
                var json = JSON.parse(body.toString());
                resolve(json);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            reject(e);
        })
        req.end();
    });
}

var getAccessToken = async function (){
    console.log('get wechat access token');
    if(global.wecht && global.wechat.timer){
        clearTimeout(global.wechat.timer);
    }
    try{
        var result = await httpsGet('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+global.wechat.appId+'&secret='+global.wechat.secret);
        var now = new Date().getTime();
        global.wechat.access_token = result.access_token;
        global.wechat.expires_time = now + (result.expires_in * 1000);
        getJSAPITicket();
        global.wechat.timer = setTimeout(getAccessToken,result.expires_in * 1000);
    }catch(ex){
        console.log('get wechat access token error!');
        console.log(ex);
        setTimeout(getAccessToken,10 * 1000);
    }
}

var getJSAPITicket = async function (){
    console.log('get wechat jsapi ticket');
    if(global.wecht && global.wechat.timer){
        clearTimeout(global.wechat.timer);
    }
    try{
        var result = await httpsGet('https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' + global.wechat.access_token);
        var now = new Date().getTime();
        global.wechat.ticket = {
            ticket:result.ticket,
            expires_time:now + (result.expires_in * 1000)
        }
//        global.wechat.timer = setTimeout(getAccessToken,result.expires_in * 1000);
    }catch(ex){
        console.log('get wechat jsapi ticket error!');
        console.log(ex);
        setTimeout(getJSAPITicket,10 * 1000);
    }
}
getAccessToken();

router.get('/token',async function(req, res, next) {
    
    console.log(global.wechat);
    res.send({success:true});
});

router.all('/signature',async function(req, res, next) {
    var url = decodeURIComponent(req.query.url);
    var timestamp = new Date().getTime();
    var para = {
        appId:global.wechat.appId,
        nonceStr:timestamp+"",
        jsapi_ticket:global.wechat.ticket.ticket,
        timestamp:timestamp,
        url:url
    }
    var string1 = `jsapi_ticket=${para.jsapi_ticket}&noncestr=${para.nonceStr}&timestamp=${timestamp}&url=${url}`;
    var sha1 = crypto.createHash('sha1');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(string1);
    para.signature = sha1.digest('hex'); 
    delete para.jsapi_ticket;
    res.send(model.success(para));
});

//router.post('/message',function(req, res, next) {
//    res.send('');
//});

module.exports = router;



