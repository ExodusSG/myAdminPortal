var getCollection = require('g:/nodejs/testMongoskin');

getCollection('article','info',function (data) {
	console.log(data);
})


module.exports.create = function (req, res) {
	//console.log(req.body);
	var ainfo = new rdata(req.body);
	console.log(rdata);
}

module.exports.list = function (req, res){
	rdata.find({},function (err, results) {
		res.json(results);
	});
}