var express 		  = require('express'),
	app 			  = express();
	bodyParser		  = require('body-parser'),
	mongoskin         = require('mongoskin'),
	cardsController   = require('./server/controllers/cards-controller');

var db = mongoskin.db('mongodb://@localhost:27017/HRMgmtDB', {safe:true})

app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

app.use('/js',express.static(__dirname+'/client/js'));
app.use('/css',express.static(__dirname+'/client/css'));
app.use('/bootstrap',express.static(__dirname+'/client/bootstrap'));
app.use('/templates',express.static(__dirname+'/client/templates'));
// app.use('/', express.static(__dirname + '/public'));
// app.use('/images', express.static(__dirname + '/public/images'));
// app.use('/images',express.directory(__dirname + '/public/images'));

app.get('/',function(req,res){
	res.sendFile(__dirname+'/client/views/index.html');
})



app.get('/api/data/collections/:collectionName', cardsController.getCollection);

app.get('/api/data/collections/leavereport', cardsController.getLeaveReport);

app.get('/leavereport',function(req,res){
	res.sendFile(__dirname+'/client/views/index.html');
})

app.get('/leavereport/listview',function(req,res){
	res.sendFile(__dirname+'/client/views/index.html');
})

app.get('/leavereport/calendarview',function(req,res){
	res.sendFile(__dirname+'/client/views/index.html');
})

app.get('/about',function(req,res){
	res.sendFile(__dirname+'/client/views/index.html');
})

app.get('/template/tooltip/tooltip-html-unsafe-popup.html',function(req,res){
	res.sendFile(__dirname+'/client/template/tooltip/tooltip-html-unsafe-popup.html');
})

//REST API
//app.get('/api/cards',cardsController.list);
//app.post('/api/cards',cardsController.create);


app.listen(4000,function(){
	console.log('I\'m Listening...')
})
