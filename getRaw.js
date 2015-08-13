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
//var lastTime = new Date();
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
var count = 0;
//connect to database
var _db = MongoClient.connect(mongourl);

async.whilst(
    function () { return true; },    
        function (callback) {
        count++;
        setTimeout(callback, 5000);
        //console.log(Jcards.length);  
        console.log(Date())
 
        var collection = _db.collection('srcCards');

        
        collection.find({}).toArray(function (err, result) {
        var Jcards=JSON.parse(JSON.stringify(result));
        for(var i=0; i < Jcards.length; ++i) {
            var vid=Jcards[i]._id;
            // console.log(vid)
            pollingCards(Jcards[i]);
            }
        });

        },
    function (err) {
        // 5 seconds have passed
    }//end of function
    );

function pollingCards(card){
    //console.log("polling")
var lid = card.srcID;
var targetID = card.dupID;
var _id = card._id;
// console.log(_id)
g.getActionByCardId(lid,function(data){
            if(typeof(data) == "undefined")
            {
                console.log('data is '+data);
                return;
            }
            var obj = JSON.parse(data);
            var counter = obj.length-1;
            var obj1 = {};
            for(var key in obj){
                obj1[counter] = obj[key];
                counter--;
            }
            
            // console.log(obj1);
            async.each(obj1,
                  // 2nd param is the function that each item is passed to
                  function(item, callback){
                    if(item.memberCreator.fullName == admin)
                        return;
                    //request database
                    var collection = _db.collection('srcCards');
                    //find the time if not found create a new time
                    collection.findById(_id.toString(),function (err, doc) {
                        // console.log(doc.srcID);
                        console.log("The 1st time is "+doc.lastUpdatingTime);
                        var lastTime = new Date();
                        if(doc.lastUpdatingTime != null && doc.lastUpdatingTime != "")
                        {
                            lastTime = new Date(doc.lastUpdatingTime)
                            console.log("Time matched    "+lastTime); 
                        } 
                        else
                        {
                            //console.log("empty");
                            doc.lastUpdatingTime = lastTime;
                            // console.log("----------------"+doc.lastUpdatingTime)
                            // var sentTime = new Date();
                            // var month = sentTime.getMonth()+1;
                            // var _db_name = "TrelloMsg_"+sentTime.getFullYear()+'_'+month+'_'+sentTime.getDate();
                            var srcCollection = _db.collection('srcCards');
                            srcCollection.updateById(_id.toString(),doc,function (err, doc) {
                                console.log("Result ===="+doc)
                            })                            
                        }               
                    console.log("The 2nd time is "+lastTime);
                    dateFormat(lastTime, "isoDateTime");
                    var rTime = new Date(item.date);
                    if(typeof(rTime) == "undefined")
                    {
                        console.log('rTime is '+data);
                        return;
                    }
                    dateFormat(rTime, "isoDateTime");
                    lastTime.setSeconds(lastTime.getSeconds() + 1);
                    //console.log("Real time is: "+rTime)
                    console.log(rTime>lastTime);
                    if(rTime>lastTime){
                        //TrelloMsg_YYYY_MM_DD
                        //create or insert to the stack
                        var sentTime = new Date();
                        var month = sentTime.getMonth()+1;
                        var _db_name = "TrelloMsg_"+sentTime.getFullYear()+'_'+month+'_'+sentTime.getDate();
                        console.log("db name :"+_db_name)    
                        //_db_name = _db_name+"";                        
                        // _db.createCollection(_db_name,function(err, result) {
                        //     if (err) {
                        //         console.log(err);
                        //         throw err;
                        //     }
                        //     console.log("create result "+result);
                        // }
                        // );
                        var collection = _db.collection(_db_name);
                        collection.insert({text:item.data.text,cardid:item.id,msgReferenceID:item.data.card.id,msgReferenceName:item.data.card.name,SubmissionTimeStamp:item.date,originator:item.memberCreator.username},function(err, result) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            console.log("INSERT result"+JSON.stringify(result));
                        }
                        );
                        doc.lastUpdatingTime = rTime;
                        var srcCollection = _db.collection('srcCards');
                        srcCollection.updateById(_id,doc,function (err, doc) {

                        })                                        
                    }
                    else{
                        callback();
                        return;
                    }
                    });//end of findbyid                
                  },
                  // 3rd param is the function to call when everything's done
                  function(error){
                    // All tasks are done now
                    if(error)
                    {
                        console.log("there was an error")               
                    }
                    //console.log("--------------End-----------------")
                    }//end of alldone function
                );
            });
}
