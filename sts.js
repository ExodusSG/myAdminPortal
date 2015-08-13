var async       = require("async"); 
var Trello      = require("node-trello");
var getRequests = require("./getRequests");
var dateFormat  = require('dateformat');
var yaml        = require('js-yaml');
var fs          = require('fs');
var mongo       = require('mongoskin');
var MongoClient = mongo.MongoClient;


//initialization
var mongourl = null;
var appkey   = null;
var token    = null;
var admin    = null;
try {
    var doc  = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    mongourl = doc.mongodburl;  
    appkey   = doc.appKey;
    token    = doc.oauthToken;
    admin    = doc.admin;
} catch (e) {
  console.log(e);
}

var g = new getRequests(appkey,token);
var count = 0; // Total count of while loop operation
var remove_count = 0; // The number of records to be removed
var err_count = 0; // Error count during operations
//connect to database
var _db = MongoClient.connect(mongourl);

async.whilst(
    function () { return true; },    
    function (callback) {
    	count++;
        setTimeout(callback, 5000);  
        console.log(Date())
 
        var collection = _db.collection('TrelloMsgSendingQueue');
        collection.find({}).toArray(function (err, result){
	        var Jcards=JSON.parse(JSON.stringify(result));
	        if(remove_count==0 ) {
	        	Jcards=JSON.parse(JSON.stringify(result));
	        	if(Jcards.length > 0) {
	        		remove_count = Jcards.length;
	        		console.log("Remove_count: "+ remove_count);
	        	}
	        } else {
	        	/* Otherwise, it means that some records is still waiting for removing */
	        	/* Note: But it may be the case error will occur to screw up this */
	        	console.log("Some records are waiting for remove. "+ remove_count);
	        	console.log("Operation error count: "+ err_count);
	        	return;
	        }
	        for(var i=0; i < Jcards.length; ++i) {
	            console.log("item id:"+Jcards[i]._id)
	            g.advCommentCard(Jcards[i],function(data){
	                //console.log(data);
	                if(data!=null){
	                    //console.log(typeof(data))
	                    var myObj = JSON.parse(data)
	                    pushToSentStack(myObj, function (err, data) {
	                    	if(err == null) {
	    	                    //console.log("piggy back:"+myObj.itemid)
	    	                    removefromSendingQueue(myObj.msgID, function(err, data){
	    	                    	if(err == null) {
	    	                    		if( remove_count> 0) remove_count--;
	    	                    	} else {
	    	                    		err_count++;
	    	                    		console.log("Error in removing record from Queue. "+ err_count);
	    	                    	}
	    	                    });     
	                    	} else {
	                    		err_count++;
	                    		console.log("Error in pushing record into Stack. "+ err_count); 		
	                    	}
	                    });                    
	                }
	            });
	        }
        });
    },
    function (err) {
        // 5 seconds have passed
    }//end of function
);

function pushToSentStack(myObj, cb){
    if(myObj ==null || typeof(myObj) == "undefined"){
    	console.log("no more from sending stack");
    	cb(new Error("no more from sending stack"));
    }
    
    collection_name = "TrelloMsgSentRecords";
    _db.createCollection(collection_name,function(err, result) {
        if (err) {
            console.log(err);
            cb(err);
        }
        console.log("create result ok.");
		var sent_obj = {
			"db_name": "MsgDB",
			"collection_name": "TrelloMsgSentRecords",
			"msgID": myObj.msgID,	
			"msg_timestamp": Date(),
			"msg_requestor": myObj.msg_requestor,
			"msg_destination": myObj.msg_destination,
			"msg_content": 	myObj.msg_content, 
			"msg_senttime": Date()
		};
        var collection = _db.collection(collection_name);
        collection.insert(sent_obj,function(err, result) {
            if (err) {
                console.log(err);
                cb(err);
            }
            console.log("INSERT result"+JSON.stringify(result));
            cb(null, myObj);
        });
    });
}

function removefromSendingQueue(cardid, cb){
    var collection = _db.collection('TrelloMsgSendingQueue');
    collection.removeById(cardid,function(err, result) {
    	if (err) {
    		console.log(err);
            cb(err);
        }
        console.log("removed _id:"+cardid)
        cb(null, result);
    });
}
