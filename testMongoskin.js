var mongo = require('mongoskin');
var db = null;
//console.log(db.collection('article').find({"name":1,_id:0}))
var dbRequests = module.exports =function(dbname,tablename,callback){
	db = mongo.db("mongodb://localhost:27017/"+dbname, {native_parser:true});
	db.collection(tablename).find().toArray(function(err, items) {
		db.close();
		callback(items);
	});
}
