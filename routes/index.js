var express = require('express');
var mongoose = require('mongoose');

var fs = require('fs');
var multer  = require('multer')
var router = express.Router();
mongoose.connect('mongodb://localhost/board');
//mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'db connection error!'));
db.once('open',function(callback){
    console.log('db connection success!!');
});
// database handle;

var PersonSchema = mongoose.Schema({
    _id : Number,
    name : String
});
var MessageSchema = mongoose.Schema({
    _id: Number,
    title:  String,
    authorID: {type:Number, ref:'Person',default: 1},
    body:   String,
    img: [String],
    music: [String],
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now }
});
var Message = mongoose.model('Message', MessageSchema);
var Person = mongoose.model('Person',PersonSchema);

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'One Gift' });
});
function get_message_list(req, res) {
    Message.find({}).exec(function (err, msg) {
        if (err) return console.log(err);
        res.json(msg);
    });
}
function post_message(req,imageStr,audioStr) {
    if(!req.body || (!req.body.message_title && !req.body.message_body)) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid message' });
    }
    if(!req.body.message_title){
        req.body.message_title = "So Lazy & No Title."
    }
    Message.findOne({}).sort('-_id').exec(function(err,msg){
        var maxID;
        if(err) return console.log(err);
        if(!msg || !msg._id) maxID = 0;
        else maxID = msg._id;
        nmsg = new Message({_id: maxID+1,title:req.body.message_title,body:req.body.message_body,authorID:req.body.authorID,img:imageStr,music:audioStr});
        nmsg.save(function(err){
            if(err) return console.log(err);
        });
    });
}
router.get('/messages',get_message_list);
//multer
var path = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = file.mimetype.split('/')[0];
    if (type == 'image') {
        cb(null,'./public/image');
    }else if(type == "audio"){
        cb(null,'./public/audio');
    }else{
        cb(null,'./public/upload');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + Math.floor(Math.random() * 1000000000) + file.originalname);
  }
})
var upload = multer({
    storage : storage,
    fileFilter: function (req, file, cb) {
        let type = file.mimetype.split('/')[0];
        if (type == 'image' || type == "audio") {
            cb(null,true);
        }else{
            console.log("Not support type : ",type);
            cb(null,false);
        }
    }
 })
var cpUpload = upload.fields([{name:'message_files'}]);
router.post('/upload',cpUpload,function(req, res, next){
    var files = req.files.message_files;
    var imageArr = new Array();
    var audioArr = new Array();
    if(files){
        for(var i=0;i<files.length;i++){
            let type = files[i].mimetype.split('/')[0];
            let name = path.basename(files[i].path);
            if (type == 'image') {
                imageArr.push(name);
            }else if( type == "audio") {
                audioArr.push(name);
            }
        }
    }
    console.log(imageArr,audioArr);
    post_message(req,imageArr,audioArr);
    res.send({ret_code: '0'});
});
module.exports = router;
