var express = require('express');
var _und = require('underscore');
var mongoose = require('mongoose');

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
function post_message(req, res) {
    if(!req.body || !req.body.title || !req.body.body) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid message' });
    }

    Message.findOne({}).sort('-_id').exec(function(err,msg){
        var maxID;
        if(err) return console.log(err);
        if(!msg || !msg._id) maxID = 0;
        else maxID = msg._id;
        nmsg = new Message({_id: maxID+1,title:req.body.title,body:req.body.body});
        nmsg.save(function(err){
            if(err) return console.log(err);
        });
    });
    res.json({});
    //var message = new Message()
    //Message.save
    //get_message_list(req, res);
}
router.get('/messages',get_message_list);
router.post('/messages',post_message);
module.exports = router;
