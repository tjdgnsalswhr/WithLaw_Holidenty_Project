var express = require('express');
//var login = require('./routes/loginroutes');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const app = express();

//먼저 디비 연결
mongoose.connect('mongodb://localhost:27017/WithLaw');
var db = mongoose.connection;

db.on('error', function(){
    console.log('데이터베이스 연결 실패!');
    return;
});
db.once('open',function(){
    console.log('데이터베이스 연결 성공!');
});

//app 짜기


app.use(bodyParser.json()); //bodyParser 기능 추가해야 POST 방식으로 통신 가능
app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(3000, () =>
{
  console.log('App listening on port 3000!');
});



//var router = express.Router();

app.get('/',function(req,res)
{
    res.send('Hello World');
});
//router.route('process/login').post(
app.post('/process/login',
    function(req,res)
    {

        console.log('로그인 요청')
        console.log(req.body);
        var ID = req.body.user_id;
        var PW = req.body.user_password;
        console.log('ID : ' + ID + ', PW : ' + PW);
        //res.end();
        
        if(db)
        {
            userLogin(db,ID,PW,function(err,docs)
            {
                let json = {
                    'confirm': '0' //0: 에러, 1: 로그인 성공, 2: 로그인 실패, 3: db 실패
                };
                if(db)
                {
                    if(err)
                    {
                        console.log('ERROR!!');
                        //res.writeHead(200, {"Content-Type":"text/html;characterset=utf8"});
                        //res.write('Error Ocurred');
                        //res.end();
                        res.send(json);
                        return;
                    }
                    if(docs)
                    {
                        console.dir(docs);
                        //res.writeHead(200,{"Content-Type":"text/html;characterset=utf8"});
                        //res.write('Login Success');
                        //res.write('user' + docs[0].id + ' : ' + docs[0].name);
                        //res.end();
                        json.confirm = '1'
                        res.send(json);
                    }
                    else
                    {
                        console.log('값이 없음!');
                        json.confirm = '2';
                        res.send(json);
                    }
                }
                else{
                    console.log('Database 연결 실패');
                    json.confirm = '3';
                    res.send(json);
                }
            });

        }
    }
);


app.post('/process/register',
    function(req,res)
    {

        console.log('회원가입 요청')
        console.log(req.body);
        var id = req.body.user_id;
        var pw = req.body.user_password;
        var name = req.body.user_name;
        var phonenumber = req.body.user_phonenumber;
        console.log('ID : ' + id + ', PW : ' + pw);
        console.log('NAME : ' + name + ', PHONENUMBER : ' + phonenumber);
        //res.end();
        
        if(db)
        {
            userRegister(db,id,pw,name,phonenumber,function(err,result)
            {
                let json = {
                    'confirm': '0' //0: 에러, 1: 로그인 성공, 2: 로그인 실패, 3: db 실패
                };
                if(db)
                {
                    if(err)
                    {
                        console.log('ERROR!!');
                        //res.writeHead(200, {"Content-Type":"text/html;characterset=utf8"});
                        //res.write('Error Ocurred');
                        //res.end();
                        res.send(json);
                        return;
                    }
                    if(result)
                    {
                        console.dir(result);
                        //res.writeHead(200,{"Content-Type":"text/html;characterset=utf8"});
                        //res.write('Login Success');
                        //res.write('user' + docs[0].id + ' : ' + docs[0].name);
                        //res.end();
                        json.confirm = '1'
                        res.send(json);
                    }
                    else
                    {
                        console.log('값이 없음!');
                        json.confirm = '2';
                        res.send(json);
                    }
                }
                else{
                    console.log('Database 연결 실패');
                    json.confirm = '3';
                    res.send(json);
                }
            });

        }
    }
);

//app.use('/',router); //라우트 미들웨어 등록, 위에 등록했던것들을 올리는 느낌인가봄


var userLogin = function(db, id, password, callback)
{
    console.log('input id : ' + id.toString() + ' : pw : ' + password);
    //테이블 및 칼럼 접근
    var user = db.collection("user");

    //찾고자 하는 정보 입력
    var result = user_login.find({"user_id": id, "user_pw": password});
    result.toArray(
        function(err,docs)
        {
            if(err)
            {
                callback(err,null);
                return;
            }
            if(docs.length>0)
            {
                console.log('사용자를 찾았습니다 [ '+docs+' ] ');
                callback(null,docs);
            }
            else
            {
                console.log('사용자를 찾을 수 없습니다 [ ' + docs + ' ] ');
                callback(null, null);
            }
        }
    );
};


var userRegister = function(db, id, pw, name, phonenumber, callback)
{
    console.log('Register 함수 호출됨' + name + ', ' + id + ', ' + pw + ', ' + phonenumber);
    var user = db.collection('user');
    user.insertMany([{"user_name" : name, "user_id" : id, "user_pw" : pw, "user_phone" : phonenumber}],
    function(err, result)
    {
        if(err)
        {
            callback(err,null);
            return;
        }
        if(result.insertedCount>0)
        {
            console.log('사용자 추가 됨' + result.insertedCount);
            callback(null, result);
        }
        else
        {
            console.log('사용자 추가 안됨' + result.insertedCount);
            callback(null, null);
        }
    }
    );
};

