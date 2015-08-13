/*module.exports.getCollection = function(req, res, next) {
  res.json(req.collection.find({} ,{limit: 1000, sort: {'_id': -1}}));
};*/
module.exports.getCollection = function(req, res, next) {
  req.collection.find({} ,{limit: 1000, sort: {}}).toArray(function(e, results){
    if (e) return next(e)
    var myObj = {};
    	myObj["responds"] = results;
    res.json(myObj)
  })
};

module.exports.getLeaveReport = function(req, res, next) {
  req.collection.find({collectionName:'leavereport'} ,{limit: 1000, sort: {}}).toArray(function(e, results){
    if (e) return next(e)
    var myObj = {};
      myObj["responds"] = results;
    res.json(myObj)
  })
};
/*module.exports.list = function (req, res){
	Meetup.find({},function (err, results) {
		res.json(results);
	});
}*/